import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
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
          name: `${first_name} ${last_name}`,
          phone,
        },
      ], { onConflict: 'email' })
      .select()
      .single();

    if (clientError || !client) {
      return NextResponse.json({ error: clientError?.message || 'Failed to create/find client.' }, { status: 500 });
    }

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
        },
      ]);

    if (bookingError) {
      return NextResponse.json({ error: bookingError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Unknown error' }, { status: 500 });
  }
} 