// app/api/delete-image/route.ts

import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/app/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const { publicId } = await request.json();
    
    if (!publicId) {
      return NextResponse.json(
        { success: false, error: 'Public ID is required' },
        { status: 400 }
      );
    }
    
    // Utiliser le SDK Cloudinary côté serveur
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: result.result },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}