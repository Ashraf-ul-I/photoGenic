import express from 'express';
import { login, logout, resetPassword, signUp } from '../controller/userAuthentication.controller.js';

const router=express.Router();

router.post('/signup',signUp);
router.post('/login',login);
router.post('/reset-password',resetPassword);
router.post('/logout',logout);
export default router;