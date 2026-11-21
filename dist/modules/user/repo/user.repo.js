"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const apstracted_repository_1 = require("../../../db/models/apstracted.repository");
const user_model_1 = require("../model/user.model");
class UserRepository extends apstracted_repository_1.AbstractRepository {
    constructor() {
        super(user_model_1.User);
    }
    async findbyEmail(email) {
        return user_model_1.User.findOne({ email: email.toLowerCase() });
    }
}
exports.UserRepository = UserRepository;
exports.default = new UserRepository();
