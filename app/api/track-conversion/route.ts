// app/api/track-conversion/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Remplacer ces valeurs par vos identifiants Meta réels
const ACCESS_TOKEN = process.env.META_API_ACCESS_TOKEN || 'votre_token_acces_meta';
const PIXEL_ID = '601446776036363';
const API_VERSION = 'v18.0'; // Utilisez la version la plus récente de l'API

/**
 * Endpoint API pour envoyer des événements via l'API Conversions Meta
 * Cette approche améliore la précision du tracking en contournant les bloqueurs de publicités
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventName, eventId, userData, customData } = body;

    if (!eventName) {
      return NextResponse.json({ error: 'Nom d\'événement requis' }, { status: 400 });
    }

    // Obtenir les données utilisateur et IP pour un meilleur matching
    const userIp = request.headers.get('x-forwarded-for') || request.ip || '';
    const userAgent = request.headers.get('user-agent') || '';

    // Créer un hash des données utilisateur pour la confidentialité
    const normalizedUserData = normalizeUserData(userData, userIp, userAgent);

    // Préparer les données pour l'API Conversions
    const eventData = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId || `event_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
          event_source_url: customData?.page_url || '',
          action_source: 'website',
          user_data: normalizedUserData,
          custom_data: customData || {},
        },
      ],
    };

    // Envoyer les données à l'API Conversions Meta
    const response = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('Erreur API Conversions Meta:', result);
      return NextResponse.json({ error: 'Erreur lors de l\'envoi à l\'API Conversions' }, { status: 500 });
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

/**
 * Normalise et hache les données utilisateur pour la confidentialité
 * et pour améliorer le matching dans l'API Conversions
 */
function normalizeUserData(
  userData: any = {},
  ip: string,
  userAgent: string
) {
  const { email, phone, firstName, lastName, city, country } = userData || {};

  // Fonction pour hacher les données utilisateur avec SHA-256
  const hashData = (data: string) => {
    if (!data) return '';
    return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex');
  };

  return {
    em: email ? hashData(email) : undefined,
    ph: phone ? hashData(phone.replace(/[^0-9]/g, '')) : undefined,
    fn: firstName ? hashData(firstName) : undefined,
    ln: lastName ? hashData(lastName) : undefined,
    ct: city ? hashData(city) : undefined,
    country: country ? country.toLowerCase() : undefined,
    client_ip_address: ip,
    client_user_agent: userAgent,
    fbc: getFbcCookie(),
    fbp: getFbpCookie(),
  };
}

/**
 * Récupère le cookie fbc (click ID Facebook)
 */
function getFbcCookie() {
  if (typeof document === 'undefined') return '';
  
  const cookies = document.cookie.split(';');
  const fbcCookie = cookies.find(cookie => cookie.trim().startsWith('_fbc='));
  
  return fbcCookie ? fbcCookie.split('=')[1] : '';
}

/**
 * Récupère le cookie fbp (browser ID Facebook)
 */
function getFbpCookie() {
  if (typeof document === 'undefined') return '';
  
  const cookies = document.cookie.split(';');
  const fbpCookie = cookies.find(cookie => cookie.trim().startsWith('_fbp='));
  
  return fbpCookie ? fbpCookie.split('=')[1] : '';
}