import express from 'express';
import { afterEmailRegisterQuestions, login, logout, register, updateImportantProfileDetails, updateNonImportantFields, updatePassword, updateProfilePhoto } from '../controllers/user.controller.js';
import { userVerify } from '../middlewares/protect.js';
import upload from '../middlewares/multer.js';


const router = express.Router();

router.post("/register",register);
router.put('/add-details',userVerify,upload.single('profilePhoto'),afterEmailRegisterQuestions);
router.post('/login',login);
router.get('/logout',logout);
router.put('/update-important',userVerify,updateImportantProfileDetails);
router.put('/update-nonImp',userVerify,updateNonImportantFields);
router.put('/update-profilePhoto',userVerify,upload.single('profilePhoto'),updateProfilePhoto);
router.put('/update-password',userVerify,updatePassword);
export default router;