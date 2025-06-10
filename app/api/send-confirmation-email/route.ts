import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const {
      customerName,
      carDetails,
      bookingDetails,
      customerDetails
    } = await req.json();

    const { data, error } = await resend.emails.send({
      from: 'Saifauto <reservations@saifauto.ma>',
      to: customerDetails.email,
      subject: 'Confirmation de Réservation - Saifauto',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a; text-align: center; margin-bottom: 30px;">Confirmation de Réservation</h1>
          
          <p style="color: #333;">Cher/Chère ${customerName},</p>
          
          <p style="color: #333;">Nous vous remercions d'avoir choisi Saifauto. Votre réservation a été confirmée avec succès.</p>
          
          <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1a1a1a; font-size: 18px; margin-bottom: 15px;">Détails de la Voiture</h2>
            <p style="margin: 5px 0;">Véhicule: ${carDetails.make} ${carDetails.model} ${carDetails.year || ''}</p>
            ${carDetails.licensePlate ? `<p style="margin: 5px 0;">Plaque d'immatriculation: ${carDetails.licensePlate}</p>` : ''}
          </div>
          
          <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1a1a1a; font-size: 18px; margin-bottom: 15px;">Détails de la Réservation</h2>
            <p style="margin: 5px 0;">Date de prise en charge: ${new Date(bookingDetails.pickupDate).toLocaleDateString('fr-FR', { dateStyle: 'long' })}</p>
            <p style="margin: 5px 0;">Date de retour: ${new Date(bookingDetails.returnDate).toLocaleDateString('fr-FR', { dateStyle: 'long' })}</p>
            <p style="margin: 5px 0;">Lieu de prise en charge: ${bookingDetails.pickupLocation}</p>
            ${bookingDetails.totalPrice ? `<p style="margin: 5px 0;">Prix total: ${bookingDetails.totalPrice} MAD</p>` : ''}
          </div>
          
          <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1a1a1a; font-size: 18px; margin-bottom: 15px;">Vos Coordonnées</h2>
            <p style="margin: 5px 0;">Email: ${customerDetails.email}</p>
            <p style="margin: 5px 0;">Téléphone: ${customerDetails.phone}</p>
          </div>
          
          <p style="color: #333; margin-top: 30px;">Pour toute question ou modification de votre réservation, n'hésitez pas à nous contacter :</p>
          <ul style="color: #333;">
            <li>Téléphone: +212 660-513878</li>
            <li>Email: contact@saifauto.ma</li>
          </ul>
          
          <p style="color: #666; font-size: 12px; margin-top: 40px; text-align: center;">
            Ceci est un email automatique, merci de ne pas y répondre directement.
          </p>
        </div>
      `
    });

    if (error) {
      console.error('Failed to send email:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in email API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 