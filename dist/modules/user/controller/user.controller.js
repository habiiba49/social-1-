"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("../service/user.service"));
class UserController {
    userService = user_service_1.default;
    uploadProfilePicture = async (req, res, next) => {
        try {
            await this.userService.uploadProfilePicture(req.file, 'habiba');
            res.json({ message: "profilepic uploaded successfully", success: true });
        }
        catch (error) {
            next(error);
        }
    };
    genaratePresignedUrl = async (req, res, next) => {
        try {
            const { fileName, ContentType } = req.body;
            const url = await this.userService.generatPresignedUrl({
                mimetype: ContentType,
                originalname: fileName
            }, 'habiba');
            res.json({
                message: "link created successfully",
                success: true,
                data: { url }
            });
        }
        catch (error) {
            next(error);
        }
    };
    deleteProfilePic = async (req, res, next) => {
        try {
            await this.userService.deleteProfilePicture("habiba");
            res.json({ message: "pic deleted successfully ", success: true });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = new UserController();
