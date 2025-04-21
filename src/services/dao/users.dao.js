import usersModel from "../models/user.model.js";

class UsersDAO {
    async findByEmail(email) {
        return await usersModel.findOne({ email });
    }

    async create(userData) {
        const user = new usersModel(userData);
        return await user.save();
    }
}

export default new UsersDAO();
