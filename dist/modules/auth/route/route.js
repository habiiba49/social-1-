"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controller/auth.controller"));
exports.authRouter = (0, express_1.Router)();
exports.authRouter.use('/register', auth_controller_1.default.register);
exports.authRouter.use('/login', auth_controller_1.default.login);
exports.authRouter.use('/refrsh-token', auth_controller_1.default.refreshToken);
exports.authRouter.use('/login-with-google', auth_controller_1.default.loginWithGoogle);
exports.authRouter.use('/verifiy-account', auth_controller_1.default.verifyAccount);
exports.authRouter.use('/send-otp', auth_controller_1.default.sendOtp);
