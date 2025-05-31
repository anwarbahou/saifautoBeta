import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[BOOKING API] Received booking request:', body);
    const {
      first_name,
      last_name,
      email,
      phone,
      pickup_location,
      dropoff_location,
      start_date,
      end_date,
      car_id
    } = body;

    // 1. Find or create client
    let { data: client, error: clientError } = await supabase
      .from('clients')
      .upsert([
        {
          email,
          first_name,
          last_name,
          phone,
        },
      ], { onConflict: 'email' })
      .select()
      .single();

    if (clientError || !client) {
      console.error('[BOOKING API] Client upsert error:', clientError);
      return NextResponse.json({ error: clientError?.message || 'Failed to create/find client.' }, { status: 500 });
    }
    console.log('[BOOKING API] Client upserted/found:', client);

    // 2. Insert booking
    const { error: bookingError } = await supabase
      .from('bookings')
      .insert([
        {
          car_id,
          client_id: client.id,
          start_date,
          end_date,
          pickup_location,
          dropoff_location,
          status: 'Confirmed',
          first_name,
          last_name,
          email,
          phone,
        },
      ]);

    if (bookingError) {
      console.error('[BOOKING API] Booking insert error:', bookingError);
      return NextResponse.json({ error: bookingError.message }, { status: 500 });
    }
    console.log('[BOOKING API] Booking inserted for client:', client.id);

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('[BOOKING API] Unexpected error:', e);
    return NextResponse.json({ error: e.message || 'Unknown error' }, { status: 500 });
  }
} 