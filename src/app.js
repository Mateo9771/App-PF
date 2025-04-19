//PF/src/app.js
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

//import routers
import usersViewsRouters from './routes/users.view.router.js';
import ordersRouter from './routes/order.router.js';
import businessRouter from './routes/business.router.js';
import sessionRouter from './routes/session.router.js';
import cartRouter from './routes/cart.router.js';
import productRouter from './routes/product.router.js'

//config Express y dotenv
const app = express()
const PORT = config.port;
const URLMongoDB = config.mongoUrl;

//Config Motor de plantillas
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

//Config Json
app.use(express.json());
app.use(express.urlencoded({extended:true}))

//Config Cookies
app.use(cookieParser("CoderS3cr3tC0d3"));

//Config passport
initializePassport()
app.use(passport.initialize())

app.use(session(
    {
        store: MongoStore.create({
            mongoUrl: URLMongoDB,
            ttl:3600,
        }),
        secret:'your-secret-key',
        resave: true,
        saveUninitialized: true,
    }
))

//Config routers
app.use('/api/usersViews', usersViewsRouters);
app.use('/api/business', businessRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/sessions', sessionRouter)
app.use('/api/carts', cartRouter);
app.use('/api/products', productRouter)

//config Public
app.use(express.static(__dirname + '/public'))

//Config server conection
const server = app.listen(PORT, () => {console.log(`Listening on PORT ${PORT}`)});
mongoose.connect(URLMongoDB)
    .then(() => console.log("Conexion realizada con exito"))
    .catch((error) => console.error("Error al conectar a la base de datos", error))
