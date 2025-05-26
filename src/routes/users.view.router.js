//PF\src\routes\users.router.js
import { Router } from "express";
import passport from 'passport';
import UsersDAO from '../services/dao/users.dao.js';
import UserDTO from '../services/dto/users.dto.js';

const router = Router()

router.get('/profile',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.render('profile', { user: req.user });
    }
);

router.get('/', async (req, res) => {
  try {
    const users = await UsersDAO.findAll(); // Necesitas agregar este método en UsersDAO
    const usersDTO = users.map(user => new UserDTO(user));
    res.status(200).json({
      status: 'success',
      payload: usersDTO,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener usuarios',
      error: error.message,
    });
  }
});

export default router