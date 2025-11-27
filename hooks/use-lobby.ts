/**
 * useLobby Hook
 * React hook for lobby operations with state management and polling
 */

'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ReplayAPISDK } from '@/types/replay-api/sdk';
import { ReplayApiSettingsMock } from '@/types/replay-api/settings';
import { logger } from '@/lib/logger';
import type {
  MatchmakingLobby,
  LobbyStatus,
  CreateLobbyRequest,
  CreateLobbyResponse,
  JoinLobbyResponse,
  SetPlayerReadyResponse,
  StartMatchResponse,
  ListLobbiesRequest,
  LobbyStats,
  PlayerSlot,
} from '@/types/replay-api/lobby.types';

const getApiBaseUrl = (): string =>
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_REPLAY_API_URL || 'http://localhost:8080'
    : process.env.NEXT_PUBLIC_REPLAY_API_URL || process.env.REPLAY_API_URL || 'http://localhost:8080';

// --- Helper Functions ---

const isLobbyTerminal = (status: LobbyStatus): boolean => {
  return ['completed', 'cancelled', 'expired'].includes(status);
};

const isLobbyActive = (status: LobbyStatus): boolean => {
  return ['waiting_for_players', 'ready_check', 'starting', 'in_progress'].includes(status);
};

const getReadyCount = (slots: PlayerSlot[]): number => {
  return slots.filter((s) => s.player_id && s.is_ready).length;
};

const getPlayerCount = (slots: PlayerSlot[]): number => {
  return slots.filter((s) => s.player_id !== null).length;
};

// --- Hook Types ---

export interface UseLobbyResult {
  // State
  lobby: MatchmakingLobby | null;
  lobbies: MatchmakingLobby[];
  stats: LobbyStats | null;
  isLoading: boolean;
  error: string | null;
  // Computed
  isInLobby: boolean;
  isHost: boolean;
  playerCount: number;
  readyCount: number;
  canStart: boolean;
  // Actions
  createLobby: (request: CreateLobbyRequest) => Promise<CreateLobbyResponse | null>;
  joinLobby: (lobbyId: string, playerId: string, playerMmr?: number) => Promise<JoinLobbyResponse | null>;
  leaveLobby: (lobbyId: string) => Promise<boolean>;
  setReady: (lobbyId: string, playerId: string, isReady: boolean) => Promise<SetPlayerReadyResponse | null>;
  startMatch: (lobbyId: string) => Promise<StartMatchResponse | null>;
  cancelLobby: (lobbyId: string) => Promise<boolean>;
  refreshLobby: (lobbyId: string) => Promise<void>;
  listLobbies: (filters?: ListLobbiesRequest) => Promise<void>;
  fetchStats: (gameId?: string, region?: string) => Promise<void>;
  // Helpers
  clearError: () => void;
  clearLobby: () => void;
}

export function useLobby(currentPlayerId?: string, pollIntervalMs = 2000): UseLobbyResult {
  const [lobby, setLobby] = useState<MatchmakingLobby | null>(null);
  const [lobbies, setLobbies] = useState<MatchmakingLobby[]>([]);
  const [stats, setStats] = useState<LobbyStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const sdk = useMemo(() => {
    const baseUrl = getApiBaseUrl();
    logger.info('[useLobby] Initializing SDK', { baseUrl });
    return new ReplayAPISDK({ ...ReplayApiSettingsMock, baseUrl }, logger);
  }, []);

  // Computed values
  const isInLobby = useMemo(() => lobby !== null && isLobbyActive(lobby.status), [lobby]);

  const isHost = useMemo(() => {
    if (!lobby || !currentPlayerId) return false;
    return lobby.creator_id === currentPlayerId;
  }, [lobby, currentPlayerId]);

  const playerCount = useMemo(() => {
    if (!lobby) return 0;
    return getPlayerCount(lobby.player_slots);
  }, [lobby]);

  const readyCount = useMemo(() => {
    if (!lobby) return 0;
    return getReadyCount(lobby.player_slots);
  }, [lobby]);

  const canStart = useMemo(() => {
    if (!lobby || !isHost) return false;
    const players = getPlayerCount(lobby.player_slots);
    const ready = getReadyCount(lobby.player_slots);
    return (
      lobby.status === 'waiting_for_players' &&
      players >= lobby.min_players &&
      (!lobby.requires_ready_check || ready === players)
    );
  }, [lobby, isHost]);

  // Start polling for lobby status
  const startPolling = useCallback(
    (lobbyId: string) => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }

      const poll = async () => {
        try {
          const result = await sdk.lobbies.getLobby(lobbyId);
          if (result?.lobby) {
            setLobby(result.lobby);
            if (isLobbyTerminal(result.lobby.status)) {
              stopPolling();
            }
          }
        } catch (err) {
          logger.error('[useLobby] Polling error:', err);
        }
      };

      // Initial poll
      poll();

      // Set up interval
      pollingRef.current = setInterval(poll, pollIntervalMs);
      logger.info('[useLobby] Started polling', { lobbyId, intervalMs: pollIntervalMs });
    },
    [sdk, pollIntervalMs]
  );

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
      logger.info('[useLobby] Stopped polling');
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  const createLobby = useCallback(
    async (request: CreateLobbyRequest): Promise<CreateLobbyResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await sdk.lobbies.createLobby(request);
        if (result) {
          setLobby(result.lobby);
          startPolling(result.lobby.id);
        } else {
          setError('Failed to create lobby');
        }
        return result;
      } catch (err: unknown) {
        logger.error('[useLobby] Error creating lobby:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [sdk, startPolling]
  );

  const joinLobby = useCallback(
    async (lobbyId: string, playerId: string, playerMmr?: number): Promise<JoinLobbyResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await sdk.lobbies.joinLobby(lobbyId, { player_id: playerId, player_mmr: playerMmr });
        if (result) {
          setLobby(result.lobby);
          startPolling(lobbyId);
        } else {
          setError('Failed to join lobby');
        }
        return result;
      } catch (err: unknown) {
        logger.error('[useLobby] Error joining lobby:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [sdk, startPolling]
  );

  const leaveLobby = useCallback(
    async (lobbyId: string): Promise<boolean> => {
      if (!currentPlayerId) return false;

      setIsLoading(true);
      setError(null);

      try {
        await sdk.lobbies.leaveLobby(lobbyId, { player_id: currentPlayerId });
        stopPolling();
        setLobby(null);
        return true;
      } catch (err: unknown) {
        logger.error('[useLobby] Error leaving lobby:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [sdk, currentPlayerId, stopPolling]
  );

  const setReady = useCallback(
    async (lobbyId: string, playerId: string, isReady: boolean): Promise<SetPlayerReadyResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await sdk.lobbies.setPlayerReady(lobbyId, { player_id: playerId, is_ready: isReady });
        if (result) {
          setLobby(result.lobby);
        } else {
          setError('Failed to update ready status');
        }
        return result;
      } catch (err: unknown) {
        logger.error('[useLobby] Error setting ready status:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [sdk]
  );

  const startMatch = useCallback(
    async (lobbyId: string): Promise<StartMatchResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await sdk.lobbies.startMatch(lobbyId);
        if (result) {
          setLobby(result.lobby);
        } else {
          setError('Failed to start match');
        }
        return result;
      } catch (err: unknown) {
        logger.error('[useLobby] Error starting match:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [sdk]
  );

  const cancelLobby = useCallback(
    async (lobbyId: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        await sdk.lobbies.cancelLobby(lobbyId);
        stopPolling();
        setLobby(null);
        return true;
      } catch (err: unknown) {
        logger.error('[useLobby] Error cancelling lobby:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [sdk, stopPolling]
  );

  const refreshLobby = useCallback(
    async (lobbyId: string) => {
      try {
        const result = await sdk.lobbies.getLobby(lobbyId);
        if (result?.lobby) {
          setLobby(result.lobby);
        }
      } catch (err: unknown) {
        logger.error('[useLobby] Error refreshing lobby:', err);
      }
    },
    [sdk]
  );

  const listLobbies = useCallback(
    async (filters?: ListLobbiesRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await sdk.lobbies.listLobbies(filters);
        if (result) {
          setLobbies(result.lobbies);
        } else {
          setError('Failed to list lobbies');
        }
      } catch (err: unknown) {
        logger.error('[useLobby] Error listing lobbies:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    },
    [sdk]
  );

  const fetchStats = useCallback(
    async (gameId?: string, region?: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await sdk.lobbies.getLobbyStats(gameId, region);
        setStats(result);
        if (!result) {
          setError('Failed to fetch lobby stats');
        }
      } catch (err: unknown) {
        logger.error('[useLobby] Error fetching stats:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    },
    [sdk]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearLobby = useCallback(() => {
    stopPolling();
    setLobby(null);
  }, [stopPolling]);

  return {
    lobby,
    lobbies,
    stats,
    isLoading,
    error,
    isInLobby,
    isHost,
    playerCount,
    readyCount,
    canStart,
    createLobby,
    joinLobby,
    leaveLobby,
    setReady,
    startMatch,
    cancelLobby,
    refreshLobby,
    listLobbies,
    fetchStats,
    clearError,
    clearLobby,
  };
}

// Re-export types
export type {
  MatchmakingLobby,
  LobbyStatus,
  CreateLobbyRequest,
  CreateLobbyResponse,
  JoinLobbyResponse,
  SetPlayerReadyResponse,
  StartMatchResponse,
  ListLobbiesRequest,
  LobbyStats,
  PlayerSlot,
};
