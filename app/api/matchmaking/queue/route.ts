/**
 * Join Matchmaking Queue API Route
 * POST - Join the matchmaking queue
 * DELETE - Leave the matchmaking queue
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { logger } from '@/lib/logger';
import { ReplayApiSettingsMock } from '@/types/replay-api/settings';

export const dynamic = 'force-dynamic';

/**
 * POST /api/matchmaking/queue - Join matchmaking queue
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
      }, { status: 401 });
    }

    const body = await request.json();

    // Forward request to replay-api backend
    const response = await fetch(`${ReplayApiSettingsMock.baseUrl}/matchmaking/queue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // TODO: Add authentication token when available
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to join queue' }));
      logger.error('[API /api/matchmaking/queue] Backend error', { status: response.status, error });
      return NextResponse.json({
        success: false,
        error: error.message || 'Failed to join queue',
      }, { status: response.status });
    }

    const data = await response.json();
    logger.info('[API /api/matchmaking/queue] Player joined queue', { session_id: data.session_id });

    return NextResponse.json({
      success: true,
      data,
    }, { status: 201 });
  } catch (error: any) {
    logger.error('[API /api/matchmaking/queue] Error joining queue', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to join queue',
    }, { status: 500 });
  }
}

/**
 * DELETE /api/matchmaking/queue?session_id=xxx - Leave matchmaking queue
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
      }, { status: 401 });
    }

    const sessionId = request.nextUrl.searchParams.get('session_id');
    if (!sessionId) {
      return NextResponse.json({
        success: false,
        error: 'session_id is required',
      }, { status: 400 });
    }

    // Forward request to replay-api backend
    const response = await fetch(`${ReplayApiSettingsMock.baseUrl}/matchmaking/queue/${sessionId}`, {
      method: 'DELETE',
      headers: {
        // TODO: Add authentication token when available
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to leave queue' }));
      logger.error('[API /api/matchmaking/queue] Backend error', { status: response.status, error, session_id: sessionId });
      return NextResponse.json({
        success: false,
        error: error.message || 'Failed to leave queue',
      }, { status: response.status });
    }

    logger.info('[API /api/matchmaking/queue] Player left queue', { session_id: sessionId });

    return NextResponse.json({
      success: true,
      message: 'Left queue successfully',
    }, { status: 200 });
  } catch (error: any) {
    logger.error('[API /api/matchmaking/queue] Error leaving queue', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to leave queue',
    }, { status: 500 });
  }
}
