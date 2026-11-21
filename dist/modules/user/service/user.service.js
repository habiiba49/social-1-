"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("../../../lib/cloud/init");
const user_repo_1 = __importDefault(require("../repo/user.repo"));
const error_1 = require("../../../lib/error/error");
class UserService {
    cloudProvider = init_1.s3CloudProvider;
    userRepo = user_repo_1.default;
    uploadProfilePicture = async (file, userId) => {
        const key = await this.cloudProvider.uploadFile(file, `users/${userId}`);
        await this.userRepo.update({ _id: userId }, { profilePicturePath: key });
    };
    generatPresignedUrl = async (file, userId) => {
        return await this.cloudProvider.generatePresignedUrl(file, `users/${userId}`);
    };
    deleteProfilePicture = async (userId) => {
        const user = await user_repo_1.default.getOne({ _id: userId });
        if (!user?.profilePicturePath) {
            throw new error_1.AppError('Profile Pic not found', 404);
        }
        await this.cloudProvider.deleteFile(user?.profilePicturePath);
        await this.userRepo.update({ _id: userId }, { $unset: { profilePicPath: 1 } });
    };
}
exports.default = new UserService();
