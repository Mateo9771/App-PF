//PF\src\routes\session.router.js
import { Router } from "express";
import passport from "passport";
import {
    registerSuccess,
    failRegister,
    login,
    logout,
    getCurrent
} from "../controllers/session.controller.js";
import { passportCall } from "../utils.js";

const router = Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.post(
    '/register',
    passport.authenticate('register', { failureRedirect: '/api/sessions/fail-register' }),
    registerSuccess
);

router.get("/fail-register", failRegister);

router.post('/login', login);

router.get("/logout", logout);

router.get('/current', passportCall('jwt'), getCurrent);

export default router;
