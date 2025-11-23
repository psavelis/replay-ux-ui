/**
 * Matchmaking SDK Client
 * Real-time matchmaking API client with polling support
 */

import type { Logger } from 'pino';
import type {
  JoinQueueRequest,
  JoinQueueResponse,
  PoolStatsResponse,
  SessionStatusResponse,
} from './matchmaking.types';

export class MatchmakingSDK {
  private baseURL: string;
  private logger: Logger;
  private pollInterval: NodeJS.Timeout | null = null;

  constructor(baseURL: string, logger: Logger) {
    this.baseURL = baseURL;
    this.logger = logger;
  }

  /**
   * Join the matchmaking queue
   */
  async joinQueue(request: JoinQueueRequest): Promise<JoinQueueResponse> {
    try {
      const response = await fetch(`${this.baseURL}/matchmaking/queue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Failed to join queue: ${response.statusText}`);
      }

      const data = await response.json();
      this.logger.info({ session_id: data.session_id }, 'Joined matchmaking queue');
      return data;
    } catch (error) {
      this.logger.error({ error }, 'Error joining queue');
      throw error;
    }
  }

  /**
   * Leave the matchmaking queue
   */
  async leaveQueue(sessionId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/matchmaking/queue/${sessionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to leave queue: ${response.statusText}`);
      }

      this.logger.info({ session_id: sessionId }, 'Left matchmaking queue');
      this.stopPolling();
    } catch (error) {
      this.logger.error({ error }, 'Error leaving queue');
      throw error;
    }
  }

  /**
   * Get session status
   */
  async getSessionStatus(sessionId: string): Promise<SessionStatusResponse> {
    try {
      const response = await fetch(`${this.baseURL}/matchmaking/session/${sessionId}`);

      if (!response.ok) {
        throw new Error(`Failed to get session status: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      this.logger.error({ error }, 'Error getting session status');
      throw error;
    }
  }

  /**
   * Get pool statistics
   */
  async getPoolStats(
    gameId: string,
    gameMode?: string,
    region?: string
  ): Promise<PoolStatsResponse> {
    try {
      const params = new URLSearchParams();
      if (gameMode) params.set('game_mode', gameMode);
      if (region) params.set('region', region);

      const url = `${this.baseURL}/matchmaking/pools/${gameId}?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to get pool stats: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      this.logger.error({ error }, 'Error getting pool stats');
      throw error;
    }
  }

  /**
   * Start polling for session updates with exponential backoff
   */
  startPolling(
    sessionId: string,
    callback: (status: SessionStatusResponse) => void,
    onError?: (error: Error, retryCount: number) => void,
    initialIntervalMs: number = 2000,
    maxIntervalMs: number = 30000
  ): void {
    this.stopPolling(); // Stop any existing polling

    let currentInterval = initialIntervalMs;
    let retryCount = 0;
    const maxRetries = 5;

    const poll = async () => {
      try {
        const status = await this.getSessionStatus(sessionId);
        callback(status);

        // Reset interval on successful poll
        currentInterval = initialIntervalMs;
        retryCount = 0;

        // Stop polling if matched or cancelled
        if (status.status === 'matched' || status.status === 'cancelled' || status.status === 'expired') {
          this.stopPolling();
        } else {
          // Schedule next poll
          this.pollInterval = setTimeout(poll, currentInterval) as unknown as NodeJS.Timeout;
        }
      } catch (error) {
        retryCount++;
        this.logger.error({ error, retry_count: retryCount }, 'Error during polling');

        if (onError) {
          onError(error as Error, retryCount);
        }

        if (retryCount >= maxRetries) {
          this.logger.error({ retry_count: retryCount }, 'Max retries reached, stopping polling');
          this.stopPolling();
          return;
        }

        // Exponential backoff: double interval, cap at max
        currentInterval = Math.min(currentInterval * 2, maxIntervalMs);
        this.logger.info({ next_interval_ms: currentInterval, retry_count: retryCount }, 'Retrying with backoff');

        // Schedule retry
        this.pollInterval = setTimeout(poll, currentInterval) as unknown as NodeJS.Timeout;
      }
    };

    // Start first poll
    this.pollInterval = setTimeout(poll, currentInterval) as unknown as NodeJS.Timeout;
    this.logger.info({ session_id: sessionId, initial_interval_ms: initialIntervalMs, max_interval_ms: maxIntervalMs }, 'Started polling with exponential backoff');
  }

  /**
   * Stop polling
   */
  stopPolling(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
      this.logger.info('Stopped polling');
    }
  }

  /**
   * Subscribe to pool stats updates (for real-time display)
   */
  subscribeToPoolUpdates(
    gameId: string,
    gameMode: string,
    region: string,
    callback: (stats: PoolStatsResponse) => void,
    intervalMs: number = 5000
  ): () => void {
    const pollPool = async () => {
      try {
        const stats = await this.getPoolStats(gameId, gameMode, region);
        callback(stats);
      } catch (error) {
        this.logger.error({ error }, 'Error fetching pool updates');
      }
    };

    // Initial fetch
    pollPool();

    // Set up polling
    const interval = setInterval(pollPool, intervalMs);

    // Return cleanup function
    return () => {
      clearInterval(interval);
      this.logger.info('Unsubscribed from pool updates');
    };
  }
}
