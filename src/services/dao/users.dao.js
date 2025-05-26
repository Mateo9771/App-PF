import usersModel from "../models/user.model.js";

class UsersDAO {
    async findByEmail(email) {
        return await usersModel.findOne({ email });
    }

    async create(userData) {
        const user = new usersModel(userData);
        return await user.save();
    }

    async findAll() {
    return await usersModel.find().lean();
  }
}

export default new UsersDAO();
