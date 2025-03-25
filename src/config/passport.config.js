//PF/src/config/passport.config.js
import passport from 'passport';
import passportLocal from 'passport-local';
import passportJwt from 'passport-jwt';


import userModel from '../models/user.model.js';
import { createHash, PRIVATE_KEY, cookieExtractor } from '../utils.js'


//Declaramos nuestra estrategia:
const localStrategy = passportLocal.Strategy;

const JWTStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;


const initializePassport = () => {

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: cookieExtractor,
        secretOrKey: 'tu_secreto'
    }, async (jwt_payload, done) => {
        try {
            const user = await userModel.findById(jwt_payload.id);
            if (!user) return done(null, false);
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    }
    ));

    //Estrategia de registro de usuario
    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {

            console.log("userModel", username);

            const { first_name, last_name, email, age } = req.body;
            try {
                const exists = await userModel.findOne({ email: username });
                if (exists) {
                    console.log("El usuario ya existe.");
                    return done(null, false);
                }
                const user = {
                    first_name,
                    last_name,
                    username,
                    age,
                    password: createHash(password),
                    loggedBy: "App"
                };
                const result = await userModel.create(user);
                return done(null, result);
            } catch (error) {
                return done("Error registrando el usuario: " + error);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            console.error("Error deserializando el usuario: " + error);
        }
    });

}



export default initializePassport;