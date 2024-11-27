import express from 'express';
import { sendMessage } from '../controllers/message.controller.js';
import { userVerify } from '../middlewares/protect.js';

const router = express.Router();

router.post('/message/:id',userVerify,sendMessage);
export default router;