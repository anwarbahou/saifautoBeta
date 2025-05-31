import { NextResponse } from 'next/server';
import twilio from 'twilio';
import { createClient } from '@supabase/supabase-js';

export async function POST(req) {
  console.log('API Route POST /api/sendBooking invoked.');
  console.log('Attempting to read NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Attempting to read NEXT_PUBLIC_SUPABASE_ANON_KEY provided:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  console.log('Attempting to read TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID);
  console.log('Attempting to read TWILIO_AUTH_TOKEN provided:', !!process.env.TWILIO_AUTH_TOKEN);
  console.log('Attempting to read TWILIO_WHATSAPP_FROM:', process.env.TWILIO_WHATSAPP_FROM);
  console.log('Attempting to read TWILIO_TO_NUMBER:', process.env.TWILIO_TO_NUMBER);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;

  if (!supabaseUrl || !supabaseAnonKey || !twilioAccountSid || !twilioAuthToken) {
    console.error('Missing one or more critical environment variables.');
    let missingVars = [];
    if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
    if (!supabaseAnonKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    if (!twilioAccountSid) missingVars.push('TWILIO_ACCOUNT_SID');
    if (!twilioAuthToken) missingVars.push('TWILIO_AUTH_TOKEN');
    return NextResponse.json({ error: `Server configuration error: Missing environment variables: ${missingVars.join(', ')}` }, { status: 500 });
  }

  const twilioClient = twilio(twilioAccountSid, twilioAuthToken);
  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

  try {
    const { name, phone, bookingDate, returnDate, serviceType } = await req.json();

    if (!name || !phone || !bookingDate || !returnDate || !serviceType) {
      return NextResponse.json({ error: 'Missing required fields for the booking message' }, { status: 400 });
    }

    const messageBody = `
📝 New Booking Request:
👤 Name: ${name}
📞 Phone: ${phone}
📅 Date: ${bookingDate}
🔧 Service: ${serviceType}
`;

    const result = await twilioClient.messages.create({
      body: messageBody,
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: process.env.TWILIO_TO_NUMBER,
    });

    const { data: supabaseData, error: supabaseError } = await supabaseClient.from('bookings').insert([
      { first_name: name, phone: phone, start_date: bookingDate, end_date: returnDate }
    ]);

    if (supabaseError) {
      console.error('Supabase Error during insert:', supabaseError);
      // Return a more specific error if Supabase fails but Twilio succeeded
      return NextResponse.json({ success: false, message: 'Message sent, but failed to save booking.', error: supabaseError.message, sid: result.sid }, { status: 500 });
    }

    return NextResponse.json({ success: true, sid: result.sid });

  } catch (error) {
    console.error('API Route Error (sendBooking):', error);
    let errorMessage = 'Failed to send message or save booking';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage, details: error instanceof Error ? error.stack : undefined }, { status: 500 });
  }
} 