//PF\src\configs\passport.config.js
import passport from 'passport';
import passportLocal from 'passport-local';
import jwtStrategy from 'passport-jwt';
import usersModel from '../services/models/user.model.js';
import { createHash, PRIVATE_KEY, cookieExtractor } from '../utils.js'

//Declaramos nuestra estrategia:
const localStrategy = passportLocal.Strategy;
const JwtStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;


const initializePassport = () => {
    /*=============================================
    =                JWTStrategy                  =
    =============================================*/
    passport.use('jwt', new JwtStrategy(
        {
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: PRIVATE_KEY
        }, async (jwt_payload, done) => {
            console.log("Entrando a passport Strategy con JWT.");
            try {
                console.log("JWT obtenido del payload");
                console.log(jwt_payload);
                return done(null, jwt_payload.user);
            } catch (error) {
                console.error(error);
                return done(error);
            }
        }
    ));

    /*=============================================
    =                localStrategy                =
    =============================================*/
    //Estrategia de registro de usuario
    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {

            console.log("userModel", username);

            const { first_name, last_name, email, age, role } = req.body;

            const isAdmin = req.user && req.user.role === 'admin';
            const userRole = isAdmin ? role || 'admin' : 'user'; 

            try {
                const exists = await usersModel.findOne({ email: username });
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
                    role: userRole,
                    loggedBy: "App"
                };
                const result = await usersModel.create(user);
                //Todo sale OK
                return done(null, result);
            } catch (error) {
                return done("Error registrando el usuario: " + error);
            }
        }
    ));

    /*=============================================
    = Funciones de Serializacion y Desserializacion =
    =============================================*/
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await usersModel.findById(id);
            done(null, user);
        } catch (error) {
            console.error("Error deserializando el usuario: " + error);
        }
    });

}

export default initializePassport;
