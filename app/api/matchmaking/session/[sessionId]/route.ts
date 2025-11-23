/**
 * Matchmaking Session Status API Route
 * GET - Get session status and queue position
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { logger } from '@/lib/logger';
import { ReplayApiSettingsMock } from '@/types/replay-api/settings';

export const dynamic = 'force-dynamic';

/**
 * GET /api/matchmaking/session/[sessionId] - Get session status
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
      }, { status: 401 });
    }

    const { sessionId } = params;

    if (!sessionId) {
      return NextResponse.json({
        success: false,
        error: 'sessionId is required',
      }, { status: 400 });
    }

    // Forward request to replay-api backend
    const response = await fetch(`${ReplayApiSettingsMock.baseUrl}/matchmaking/session/${sessionId}`, {
      method: 'GET',
      headers: {
        // TODO: Add authentication token when available
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to get session status' }));
      logger.error('[API /api/matchmaking/session] Backend error', { status: response.status, error, session_id: sessionId });
      return NextResponse.json({
        success: false,
        error: error.message || 'Failed to get session status',
      }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data,
    }, { status: 200 });
  } catch (error: any) {
    logger.error('[API /api/matchmaking/session] Error getting session status', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to get session status',
    }, { status: 500 });
  }
}
