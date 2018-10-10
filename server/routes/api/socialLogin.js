import passport from 'passport';
import express from 'express';
import SocialLoginController from '../../controllers/socialLoginController';

const router = express.Router();

router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get(
  '/login/facebook/return',
  passport.authenticate('facebook', { session: false }), SocialLoginController.response
);

router.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/login/google/return',
  passport.authenticate('google', { session: false }), SocialLoginController.response
);

// I added this route to test the response method in the SocialLoginController
router.post('/login/response', (req, res, next) => {
  req.user = req.body;
  next();
}, SocialLoginController.response);

export default router;
