//PF\src\routes\users.router.js
import { Router } from "express";
import passport from 'passport';

const router = Router()

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/register', (req,res) => {
    res.render("register")
})

router.get('/profile',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.render('profile', { user: req.user });
    }
);

router.get('/crearProducto',(req, res) => {
    res.render('newProduct')
})

export default router