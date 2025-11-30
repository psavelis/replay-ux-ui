/**
 * Replay Detail API Route
 * Get specific replay by ID
 */

import { NextRequest, NextResponse } from 'next/server';
import { ReplayAPISDK } from '@/types/replay-api/sdk';
import { ReplayApiSettingsMock } from '@/types/replay-api/settings';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('gameId') || 'cs2';
    
    const sdk = new ReplayAPISDK(ReplayApiSettingsMock, logger);
    
    // Fetch replay file details
    const replay = await sdk.replayFiles.getReplayFile(gameId, id);
    
    if (!replay) {
      return NextResponse.json({
        success: false,
        error: 'Replay not found',
      }, {
        status: 404,
      });
    }
    
    return NextResponse.json({
      success: true,
      data: replay,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
    
  } catch (error: any) {
    logger.error('[API /api/replays/[id]] Error fetching replay', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch replay',
    }, {
      status: 500,
    });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('gameId') || 'cs2';
    
    const sdk = new ReplayAPISDK(ReplayApiSettingsMock, logger);
    
    // Delete replay file
    const success = await sdk.replayFiles.deleteReplayFile(gameId, id);
    
    if (!success) {
      return NextResponse.json({
        success: false,
        error: 'Failed to delete replay',
      }, {
        status: 500,
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Replay deleted successfully',
    });
    
  } catch (error: any) {
    logger.error('[API /api/replays/[id]] Error deleting replay', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to delete replay',
    }, {
      status: 500,
    });
  }
}
