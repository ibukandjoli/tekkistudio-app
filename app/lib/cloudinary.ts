// app/lib/cloudinary.ts

import { v2 as cloudinary } from 'cloudinary';

// Configuration de Cloudinary avec vos identifiants
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;