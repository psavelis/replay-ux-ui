/**
 * Matchmaking Types for LeetGaming.PRO
 * Comprehensive types for real-time competitive matchmaking
 */

export type MatchmakingTier = 'free' | 'premium' | 'pro' | 'elite';

export type SessionStatus =
  | 'queued'
  | 'searching'
  | 'matched'
  | 'ready'
  | 'cancelled'
  | 'expired';

export type QueueHealth = 'healthy' | 'moderate' | 'slow' | 'degraded';

export interface SkillRange {
  min_mmr: number;
  max_mmr: number;
}

export interface MatchPreferences {
  game_id: string;
  game_mode: string;
  region: string;
  map_preferences?: string[];
  skill_range: SkillRange;
  max_ping: number;
  allow_cross_platform: boolean;
  tier: MatchmakingTier;
  priority_boost: boolean;
}

export interface JoinQueueRequest {
  player_id: string;
  squad_id?: string;
  preferences: MatchPreferences;
  player_mmr: number;
}

export interface JoinQueueResponse {
  session_id: string;
  status: SessionStatus;
  estimated_wait_seconds: number;
  queue_position: number;
  queued_at: string;
}

export interface SessionStatusResponse {
  session_id: string;
  status: SessionStatus;
  elapsed_time: number;
  estimated_wait: number;
  queue_position?: number;
  match_id?: string;
}

export interface PoolStatsResponse {
  pool_id: string;
  game_id: string;
  game_mode: string;
  region: string;
  total_players: number;
  average_wait_time_seconds: number;
  players_by_tier: Record<MatchmakingTier, number>;
  estimated_match_time_seconds: number;
  queue_health: QueueHealth;
  timestamp: string;
}

// UI-specific types
export interface MatchmakingUIState {
  isSearching: boolean;
  sessionId: string | null;
  queuePosition: number;
  estimatedWait: number;
  elapsedTime: number;
  poolStats: PoolStatsResponse | null;
  error: string | null;
}

// Tier benefits for display
export interface TierBenefits {
  tier: MatchmakingTier;
  name: string;
  price: number;
  features: string[];
  waitTimeReduction: number;
  priorityMultiplier: number;
  color: string;
  icon: string;
}

export const TIER_BENEFITS: Record<MatchmakingTier, TierBenefits> = {
  free: {
    tier: 'free',
    name: 'Free',
    price: 0,
    features: [
      'Standard matchmaking',
      'Basic region selection',
      'Community servers',
    ],
    waitTimeReduction: 0,
    priorityMultiplier: 1,
    color: 'default',
    icon: 'solar:user-linear',
  },
  premium: {
    tier: 'premium',
    name: 'Premium',
    price: 4.99,
    features: [
      'Priority queue (2x faster)',
      'Advanced map selection',
      'Server location choice',
      'Ad-free experience',
    ],
    waitTimeReduction: 50,
    priorityMultiplier: 2,
    color: 'primary',
    icon: 'solar:star-bold',
  },
  pro: {
    tier: 'pro',
    name: 'Pro',
    price: 9.99,
    features: [
      'Ultra-priority queue (3x faster)',
      'Custom game modes',
      'Premium servers',
      'Stats & analytics',
      'Replay analysis',
    ],
    waitTimeReduction: 66,
    priorityMultiplier: 3,
    color: 'secondary',
    icon: 'solar:cup-star-bold',
  },
  elite: {
    tier: 'elite',
    name: 'Elite',
    price: 19.99,
    features: [
      'Instant priority (4x faster)',
      'Exclusive tournaments',
      'Premium-only servers',
      'Advanced analytics',
      'Coach matching',
      'VIP support',
    ],
    waitTimeReduction: 75,
    priorityMultiplier: 4,
    color: 'warning',
    icon: 'solar:crown-star-bold',
  },
};

// Game modes and regions
export interface GameModeOption {
  id: string;
  name: string;
  description: string;
  playerCount: string;
  icon: string;
}

export interface RegionOption {
  id: string;
  name: string;
  location: string;
  avgPing: number;
  icon: string;
}

export const GAME_MODES: Record<string, GameModeOption> = {
  competitive: {
    id: 'competitive',
    name: 'Competitive',
    description: 'Ranked 5v5 matches',
    playerCount: '5v5',
    icon: 'solar:ranking-bold',
  },
  casual: {
    id: 'casual',
    name: 'Casual',
    description: 'Unranked 5v5 matches',
    playerCount: '5v5',
    icon: 'solar:gameboy-bold',
  },
  wingman: {
    id: 'wingman',
    name: 'Wingman',
    description: '2v2 tactical matches',
    playerCount: '2v2',
    icon: 'solar:user-hands-bold',
  },
  deathmatch: {
    id: 'deathmatch',
    name: 'Deathmatch',
    description: 'Free-for-all combat',
    playerCount: 'FFA',
    icon: 'solar:target-bold',
  },
};

export const REGIONS: Record<string, RegionOption> = {
  'na-east': {
    id: 'na-east',
    name: 'North America East',
    location: 'Virginia, USA',
    avgPing: 15,
    icon: '🇺🇸',
  },
  'na-west': {
    id: 'na-west',
    name: 'North America West',
    location: 'Oregon, USA',
    avgPing: 25,
    icon: '🇺🇸',
  },
  'eu-west': {
    id: 'eu-west',
    name: 'Europe West',
    location: 'Dublin, Ireland',
    avgPing: 35,
    icon: '🇪🇺',
  },
  'eu-east': {
    id: 'eu-east',
    name: 'Europe East',
    location: 'Frankfurt, Germany',
    avgPing: 30,
    icon: '🇪🇺',
  },
  'asia-pacific': {
    id: 'asia-pacific',
    name: 'Asia Pacific',
    location: 'Singapore',
    avgPing: 45,
    icon: '🌏',
  },
  'south-america': {
    id: 'south-america',
    name: 'South America',
    location: 'São Paulo, Brazil',
    avgPing: 50,
    icon: '🇧🇷',
  },
};
