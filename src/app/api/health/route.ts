import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const startTime = Date.now();

  try {
    const supabase = await createClient();
    
    // Quick, light query to check database responsiveness
    const { error } = await supabase
      .from('categories')
      .select('id')
      .limit(1);

    if (error) {
      return NextResponse.json(
        {
          status: 'degraded',
          timestamp: new Date().toISOString(),
          latencyMs: Date.now() - startTime,
          database: 'error',
          error: error.message,
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        status: 'ok',
        timestamp: new Date().toISOString(),
        latencyMs: Date.now() - startTime,
        database: 'connected',
        service: 'hotel-qr-ordering',
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown health check error';
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        latencyMs: Date.now() - startTime,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
