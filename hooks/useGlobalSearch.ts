/**
 * Global Search Hook
 * Unified search across all entities: Replays, Players, Teams, Matches
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { ReplayAPISDK } from '@/types/replay-api/sdk';
import { ReplayApiSettingsMock } from '@/types/replay-api/settings';
import { logger } from '@/lib/logger';
import { ReplayFile } from '@/types/replay-api/replay-file';

export interface GlobalSearchResult {
  type: 'replay' | 'player' | 'team' | 'match';
  id: string;
  title: string;
  description: string;
  href: string;
  metadata?: any;
}

export interface UseGlobalSearchResult {
  results: GlobalSearchResult[];
  loading: boolean;
  error: string | null;
  search: (query: string) => Promise<void>;
  clear: () => void;
}

// Initialize SDK with real API base URL (no mock)
const baseUrl = process.env.NEXT_PUBLIC_REPLAY_API_URL || process.env.REPLAY_API_URL || 'http://localhost:8080';
const sdk = new ReplayAPISDK({ ...ReplayApiSettingsMock, baseUrl }, logger);

/**
 * Transform replay files to search results
 */
function transformReplays(replays: ReplayFile[]): GlobalSearchResult[] {
  return replays.map((replay) => ({
    type: 'replay' as const,
    id: replay.id,
    title: `Replay: ${replay.networkId} - ${replay.gameId}`,
    description: `Uploaded ${new Date(replay.createdAt).toLocaleDateString()} • ${replay.status}`,
    href: `/match/${replay.id}`,
    metadata: {
      gameId: replay.gameId,
      networkId: replay.networkId,
      status: replay.status,
      createdAt: replay.createdAt,
    },
  }));
}

/**
 * Transform player profiles to search results
 */
function transformPlayers(players: any[]): GlobalSearchResult[] {
  return players.map((player) => ({
    type: 'player' as const,
    id: player.id || player.user_id,
    title: player.steam_name || player.username || 'Unknown Player',
    description: `Steam ID: ${player.steam_id || 'N/A'} • ${player.profiles?.length || 0} profiles`,
    href: `/players/${player.id || player.user_id}`,
    metadata: {
      steamId: player.steam_id,
      profiles: player.profiles,
    },
  }));
}

/**
 * Transform squads/teams to search results
 */
function transformTeams(teams: any[]): GlobalSearchResult[] {
  return teams.map((team) => ({
    type: 'team' as const,
    id: team.id,
    title: team.name || 'Unnamed Team',
    description: `${team.members?.length || 0} members • Created ${new Date(team.created_at).toLocaleDateString()}`,
    href: `/teams/${team.id}`,
    metadata: {
      members: team.members,
      createdAt: team.created_at,
    },
  }));
}

/**
 * Global search hook
 */
export function useGlobalSearch(): UseGlobalSearchResult {
  const [results, setResults] = useState<GlobalSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const search = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchTerm = query.trim();
      const allResults: GlobalSearchResult[] = [];

      // Abort previous in-flight requests
      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      const commonFetchInit: RequestInit = { signal: controller.signal };

      // Search replays
      try {
        const replays = await sdk.replayFiles.searchReplayFiles({
          search_term: searchTerm
        });
        if (replays && replays.length > 0) {
          // Limit to 5 results
          allResults.push(...transformReplays((replays as ReplayFile[]).slice(0, 5)));
        }
      } catch (err) {
        logger.warn('Replay search failed:', err);
      }

      // Search players
      try {
        const players = await sdk.playerProfiles.searchPlayerProfiles({
          nickname: searchTerm
        });
        if (players && players.length > 0) {
          // Limit to 5 results
          allResults.push(...transformPlayers(players.slice(0, 5)));
        }
      } catch (err) {
        logger.warn('Player search failed:', err);
      }

      // Search teams/squads
      try {
        const squads = await sdk.squads.searchSquads({
          name: searchTerm
        });
        if (squads && squads.length > 0) {
          // Limit to 5 results
          allResults.push(...transformTeams(squads.slice(0, 5)));
        }
      } catch (err) {
        logger.warn('Team search failed:', err);
      }

      setResults(allResults);
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        logger.warn('Global search aborted');
        return; // Ignore aborted requests
      }
      logger.error('Global search error:', err);
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResults([]);
    setError(null);
    if (abortRef.current) {
      abortRef.current.abort();
    }
  }, []);

  return {
    results,
    loading,
    error,
    search,
    clear,
  };
}
