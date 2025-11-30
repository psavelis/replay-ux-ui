/**
 * Global Search API Route
 * GET /api/search - Search across all entities
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.REPLAY_API_URL || 'http://localhost:30800';

/**
 * GET /api/search
 * Global search across players, teams, replays, tournaments
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const limit = parseInt(searchParams.get('limit') || '5', 10);

    if (query.length < 2) {
      return NextResponse.json({
        success: true,
        data: { groups: [], total: 0 },
      });
    }

    // Build query params for backend
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
    });

    if (category) {
      params.append('category', category);
    }

    const response = await fetch(`${BACKEND_URL}/search?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Return empty results if backend search is not available
      return NextResponse.json({
        success: true,
        data: { groups: [], total: 0 },
      });
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: {
        groups: data.groups || [],
        total: data.total || 0,
      },
    });
  } catch (error) {
    console.error('[API] Search error:', error);
    // Return empty results on error (frontend will use mock data)
    return NextResponse.json({
      success: true,
      data: { groups: [], total: 0 },
    });
  }
}
