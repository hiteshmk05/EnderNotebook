import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true                           
});


const storage = new CloudinaryStorage({
	cloudinary,
	params: (req, file) => ({
		folder: 'endernotebook',               
		format: file.mimetype.split('/')[1],   
		public_id: `${Date.now()}-${file.originalname}` 
	})
});

export const upload = multer({ storage });
