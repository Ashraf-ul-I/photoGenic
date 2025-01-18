import express from 'express';

import { uploadImage } from '../controller/imageUpload.controller.js';
import upload from '../multer/handlingCloudinary.multer.js';
import { userFavourite } from '../controller/favourite.controller.js';
const router=express.Router();

router.post('/upload-image',upload.single("image"),uploadImage);
router.post('/favourites',userFavourite);
export default router;