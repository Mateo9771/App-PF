// PF/src/app.js
import express from 'express';
import mongoose from 'mongoose';
import config from './configs/config.js';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import initializePassport from './configs/passport.config.js';
import passport from 'passport';
import usersViewsRouters from './routes/users.view.router.js';
import sessionRouter from './routes/session.router.js';
import cartRouter from './routes/cart.router.js';
import productRouter from './routes/product.router.js';

const app = express();
const PORT = config.port;
const URLMongoDB = config.mongoUrl;

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser('CoderS3cr3tC0d3'));

app.use(
    session({
        store: MongoStore.create({
            mongoUrl: URLMongoDB,
            ttl: 3600,
        }),
        secret: 'your-secret-key',
        resave: true,
        saveUninitialized: true,
    })
);

initializePassport();
app.use(passport.initialize());

app.use('/api/usersViews', usersViewsRouters);
app.use('/api/sessions', sessionRouter);
app.use('/api/carts', cartRouter);
app.use('/api/products', productRouter);

app.use(express.static(__dirname + '/public'));

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({ message: `Ruta no encontrada: ${req.originalUrl}` });
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error interno del servidor', error: err.message });
});

const server = app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});

mongoose
    .connect(URLMongoDB)
    .then(() => console.log('Conexión realizada con éxito'))
    .catch((error) => console.error('Error al conectar a la base de datos', error));