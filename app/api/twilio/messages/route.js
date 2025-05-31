import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function GET(req) {
  console.log('API Route GET /api/twilio/messages invoked.');

  const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioWhatsAppFromNumber = process.env.TWILIO_WHATSAPP_FROM; // e.g., whatsapp:+14155238886

  if (!twilioAccountSid || !twilioAuthToken || !twilioWhatsAppFromNumber) {
    console.error('Missing Twilio environment variables.');
    return NextResponse.json({ error: 'Server configuration error: Missing Twilio credentials or WhatsApp number.' }, { status: 500 });
  }

  const twilioClient = twilio(twilioAccountSid, twilioAuthToken);

  try {
    const messages = await twilioClient.messages.list({ limit: 50 }); // Fetch last 50 messages

    const whatsAppMessages = messages.filter(msg => 
      msg.from === twilioWhatsAppFromNumber || msg.to === twilioWhatsAppFromNumber
    ).map(msg => ({
      sid: msg.sid,
      body: msg.body,
      status: msg.status,
      dateSent: msg.dateSent,
      direction: msg.direction,
      from: msg.from,
      to: msg.to,
      errorCode: msg.errorCode,
      errorMessage: msg.errorMessage,
    }));

    return NextResponse.json({ success: true, messages: whatsAppMessages });

  } catch (error) {
    console.error('Error fetching Twilio messages:', error);
    let errorMessage = 'Failed to fetch Twilio messages.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage, details: error instanceof Error ? error.stack : undefined }, { status: 500 });
  }
} 