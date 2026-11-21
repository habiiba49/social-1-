"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = authGuard;
const error_js_1 = require("../error/error.js");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
function authGuard(req, res, next) {
    try {
        const token = req.cookies?.accessToken;
        if (!token)
            throw new error_js_1.AppError("no token provided", 401);
        req.user = jsonwebtoken_1.default.verify(token, env_1.env.jwt.secret);
        next();
    }
    catch (error) {
        next(error instanceof error_js_1.AppError ? error : new error_js_1.AppError("invalid or expired token", 401));
    }
}
