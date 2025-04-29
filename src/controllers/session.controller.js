//PF\src\controllers\session.controller.js
import usersDAO from '../services/dao/users.dao.js';
import UserDTO from "../services/dto/users.dto.js";
import { isValidPassword, generateJWToken } from "../utils.js";

export const registerSuccess = async (req, res) => {
    if (role && req.user.role !== 'admin') {
        return res.status(403).send({ status: "error", message: "Solo un administrador puede crear usuarios con rol de admin." });
    }
    res.status(201).send({ status: "success", message: "Usuario creado con éxito." });
};

export const failRegister = (req, res) => {
    res.status(401).send({ error: "Failed to process register!" });
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await usersDAO.findByEmail(email);
        if (!user) return res.status(401).json({ message: 'Usuario no encontrado' });

        if (!isValidPassword(user, password)) {
            console.warn('Credenciales inválidas para: ' + email);
            return res.status(401).json({ status: 'error', error: 'Credenciales inválidas' });
        }

        const tokenUser = new UserDTO(user);
        const access_token = generateJWToken(tokenUser);

        // Opcional: Mantener la cookie si quieres usar ambos métodos
        res.cookie('jwtCookieToken', access_token, {
            maxAge: 60000, // 60 segundos
            httpOnly: true,
        });

        // Devolver el token y la redirección en la respuesta JSON
        if (user.role === 'admin') {
            return res.status(200).json({
                token: access_token,
                redirect: '/admin', // Ajusta según tus rutas en el frontend
            });
        } else {
            return res.status(200).json({
                token: access_token,
                redirect: '/api/products', // Ajusta según tus rutas en el frontend
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
}

export const logout = (req, res) => {
    res.clearCookie("jwtCookieToken");
    res.redirect("/api/usersViews/login");
};

export const getCurrent = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "No autenticado" });
    }

    const safeUser = new UserDTO(req.user);
    res.status(200).json(safeUser);
}