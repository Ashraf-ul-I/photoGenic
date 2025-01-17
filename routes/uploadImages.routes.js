import express from 'express';

import { uploadImage } from '../controller/imageUpload.controller.js';
import upload from '../multer/handlingCloudinary.multer.js';
const router=express.Router();

router.post('/upload-image',upload.single("image"),uploadImage);
export default router;