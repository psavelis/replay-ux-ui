/**
 * Players API Route Handler
 * GET /api/players - Search players
 * POST /api/players - Create player profile
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import { forwardAuthenticatedRequest } from '@/lib/auth/server-auth';

const BACKEND_URL = process.env.REPLAY_API_URL || 'http://localhost:30800';

/**
 * GET /api/players
 * Search/list players with filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    const response = await fetch(
      `${BACKEND_URL}/players${queryString ? `?${queryString}` : ''}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    return NextResponse.json(
      { success: response.ok, data: data },
      { status: response.status }
    );
  } catch (error: any) {
    console.error('[API] Players search error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search players' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/players
 * Create a new player profile (requires authentication)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await forwardAuthenticatedRequest(
      `${BACKEND_URL}/players`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      session
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error || data.message || 'Failed to create player profile' },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { success: true, data },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[API] Create player error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create player profile' },
      { status: 500 }
    );
  }
}
