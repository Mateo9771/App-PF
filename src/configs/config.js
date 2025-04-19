//PF\src\configs\config.js
import dotenv from 'dotenv';

dotenv.config({ path: './configs/.env' });

export default {
    port: process.env.PORT,
    mongoUrl: process.env.URL_MONGO
}