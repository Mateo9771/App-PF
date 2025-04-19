//PF/src/models/user.model.js
import mongoose from 'mongoose';

const collection = 'users';

const schema = new mongoose.Schema({
    first_name: {type: String, require: true},
    last_name: {type: String, require: true},
    email: {type: String, require: true, unique: true},
    age: {type: Number, require:true},
    password: {type: String, require: true},
    role:{type: String, default:'user'}
})

const usersModel = mongoose.model(collection, schema);
export default usersModel;