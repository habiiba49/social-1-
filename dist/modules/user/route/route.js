"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controller/user.controller"));
const multer_1 = require("../../../lib/media/multer");
exports.userRouter = (0, express_1.Router)();
exports.userRouter.post('/upload-profile-pic', (0, multer_1.multerUploadSingle)('pp'), user_controller_1.default.uploadProfilePicture);
exports.userRouter.delete('/delete-profile-pic', user_controller_1.default.deleteProfilePic);
exports.userRouter.post('/get-presigned-url', user_controller_1.default.genaratePresignedUrl);
