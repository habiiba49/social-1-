"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const express_1 = require("express");
const auth_service_1 = __importDefault(require("../service/auth.service"));
const router = (0, express_1.Router)();
class AuthController {
    authService = auth_service_1.default;
    constructor() {
    }
    register = async (req, res, next) => {
        try {
            const user = await this.authService.register(req.body);
            return res.status(200).json({
                message: "created successfully ",
                success: true, data: user
            });
        }
        catch (error) {
            next(error);
        }
    };
    verifyAccount = async (req, res, next) => {
        try {
            const user = await this.authService.verfyAccount(req.body);
            return res.status(200).json({
                message: "account verified successfully",
                success: true,
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    };
    sendOtp = async (req, res, next) => {
        try {
            await this.authService.sendOtp(req.body);
            return res.status(200).json({
                message: "otp sent successfully",
                success: true,
            });
        }
        catch (error) {
            next(error);
        }
    };
    login = async (req, res, next) => {
        try {
            const tokens = await this.authService.login(req.body);
            return res.status(200).json({
                message: "logged in successfully",
                success: true,
                data: tokens,
            });
        }
        catch (error) {
            next(error);
        }
    };
    loginWithGoogle = async (req, res, next) => {
        try {
            const accessToken = await this.authService.loginWithGoogle(req.body.idToken);
            return res.status(200).json({
                message: "logged in with google successfully",
                success: true,
                data: { accessToken },
            });
        }
        catch (error) {
            next(error);
        }
    };
    refreshToken = async (req, res, next) => {
        try {
            const tokens = await this.authService.refreshTokenFn(req.body.refreshToken);
            return res.status(200).json({
                message: "token refreshed successfully",
                success: true,
                data: tokens,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AuthController = AuthController;
exports.default = new AuthController();
