// app/lib/cloudinary-actions.ts
'use server';

import cloudinary from './cloudinary';

export async function deleteImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return { success: result.result === 'ok' };
  } catch (error: any) {
    console.error('Error deleting image:', error);
    return { success: false, error: error.message };
  }
}

export async function uploadImage(base64Image: string, folder: string) {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: folder,
      resource_type: 'image',
      quality: 'auto',
    });
    return { success: true, url: result.secure_url };
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return { success: false, error: error.message };
  }
}