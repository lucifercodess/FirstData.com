import express from 'express';
import { userVerify } from '../middlewares/protect.js';
import { getAllLikedUsers, getMatchedUsers, likeAUser, matchBasedOnHeight, showFemaleMatches, showMaleMatches, showMatchesOnAge, showPotentialMatches, unMatchUser } from '../controllers/match.controller.js';

const router = express.Router();

router.post('/like-user/:id',userVerify,likeAUser);
router.get('/get-matches',userVerify,getMatchedUsers);
router.get('/get-like',userVerify,getAllLikedUsers);
router.put('/un-match/:id',userVerify,unMatchUser);
router.get('/show-all-profiles',userVerify,showPotentialMatches);
router.get('/show-all-males',userVerify,showMaleMatches);
router.get('/show-all-females',userVerify,showFemaleMatches);
router.get('/show-all-females',userVerify,showFemaleMatches);
router.get('/show-on-age',userVerify,showMatchesOnAge); // have tp change this and filter it out on age and gender
router.get('/show-on-height',userVerify,matchBasedOnHeight); // have tp change this and filter it out on height and gender
export default router;