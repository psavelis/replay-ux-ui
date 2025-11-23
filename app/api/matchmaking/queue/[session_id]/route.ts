/**
 * Leave Matchmaking Queue API Route
 * DELETE - Leave the matchmaking queue
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function DELETE(
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
    logger.info('[API /api/matchmaking/queue/:session_id] Player left queue', { session_id });

    return NextResponse.json({
      success: true,
      message: 'Successfully left queue',
    });
  } catch (error: any) {
    logger.error(`[API /api/matchmaking/queue/${params.session_id}] Error leaving queue`, error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to leave queue',
    }, { status: 500 });
  }
}
