/**
 * Get Matchmaking Session Status API Route
 * GET - Get the current status of a matchmaking session
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { session_id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
      }, { status: 401 });
    }

    const { session_id } = params;

    // TODO: Replace with actual backend API call when available
    // For now, return mock response
    const mockResponse = {
      session_id,
      status: 'searching',
      estimated_wait_time_seconds: 25,
      queue_position: 1,
      players_in_queue: 7,
      match_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    logger.info('[API /api/matchmaking/session/:session_id] Retrieved session status', { session_id });

    return NextResponse.json({
      success: true,
      data: mockResponse,
    });
  } catch (error: any) {
    logger.error(`[API /api/matchmaking/session/${params.session_id}] Error getting session status`, error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to get session status',
    }, { status: 500 });
  }
}
