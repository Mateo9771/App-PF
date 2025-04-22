//PF\src\routes\users.router.js
import { Router } from "express";
import passport from 'passport';

const router = Router()

router.get('/profile',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.render('profile', { user: req.user });
    }
);

export default router