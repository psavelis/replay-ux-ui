/**
 * Get Matchmaking Pool Stats API Route
 * GET - Get statistics for a matchmaking pool
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { game_id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const { game_id } = params;
    const game_mode = searchParams.get('game_mode');
    const region = searchParams.get('region');

    // TODO: Replace with actual backend API call when available
    // For now, return mock response
    const mockResponse = {
      game_id,
      game_mode: game_mode || 'all',
      region: region || 'all',
      active_players: 42,
      active_sessions: 12,
      avg_wait_time_seconds: 25,
      pools: [
        {
          game_mode: game_mode || 'competitive',
          region: region || 'us-east',
          players_searching: 15,
          estimated_wait_seconds: 20,
        },
      ],
      last_updated: new Date().toISOString(),
    };

    logger.info('[API /api/matchmaking/pools/:game_id] Retrieved pool stats', { game_id, game_mode, region });

    return NextResponse.json({
      success: true,
      data: mockResponse,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=10',
      },
    });
  } catch (error: any) {
    logger.error(`[API /api/matchmaking/pools/${params.game_id}] Error getting pool stats`, error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to get pool stats',
    }, { status: 500 });
  }
}
