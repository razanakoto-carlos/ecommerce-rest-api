import { Router } from "express";
import { googleAuth, login, register } from "../controllers/auth.js";
import passport from "passport";

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }))
router.get('/google/callback', passport
    .authenticate('google', { session: false, failureRedirect: '/auth/login' }), googleAuth);

export default router;