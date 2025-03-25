//PF/src/app.js
import express from 'express';
import dotenv from 'dotenv';
import __dirname from './utils.js';
import { MongoClient, ServerApiVersion } from 'mongodb';
import handlebars from 'express-handlebars'
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import initializePassaport from './config/passport.config.js'

//import routers
import sessionsRouter from './routes/sessions.router.js';
import userViewRouter from './routes/users.views.router.js';


//config Express
const app = express();

//Config dotenv
dotenv.config();
const PORT = process.env.PORT;

//Config Motor de plantillas
app.engine('handlebars', handlebars.engine());
app.set('view', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'))

//Config Json
app.use(express.json());
app.use(express.urlencoded({extended:true}))

//Config Cookies
app.use(cookieParser("CoderS3cr3tC0d3"));

//Config passport
initializePassaport()
app.use(passport.initialize())

//Config routers
app.use('/users', userViewRouter);
app.use('/api/sessions', sessionsRouter)

//Config Mongo DB
const uri = process.env.URL_MONGO;

const client = new MongoClient(uri, {
    ServerApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
})

async function run() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You succesfully connected to MongoDB!")
    } finally {
        await client.close()
    }
}
run().catch(console.dir)

//config Public
app.use(express.static(__dirname + '/public'))

//Config server conection
const server = app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})