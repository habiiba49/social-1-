"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const user_repo_1 = require("../../user/repo/user.repo");
const error_1 = require("../../../lib/error/error");
const utlis_1 = require("../utlis");
const init_1 = require("../../../lib/cache/init");
const time_1 = require("../../../pkg/utils/time");
const init_2 = require("../../../lib/email/init");
const otp_utils_1 = require("../../../lib/utils/otp.utils");
const utlis_2 = require("../utlis");
const utlis_3 = require("../utlis");
const google_auth_1 = require("../../../lib/utils/google.auth");
const enum_1 = require("../../../lib/enum");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../../lib/config/env");
class AuthService {
    twoStepVerification = '2-step-verification:';
    senOtpKey = 'otp:';
    mailProvider;
    userRepository;
    constructor() {
        this.userRepository = new user_repo_1.UserRepository,
            this.mailProvider = init_2.mailjetProvider;
    }
    login = async (loginDto) => {
        const cachedAttempt = await init_1.cacheProvider.get(`${loginDto.email}:login`);
        const user = await this.userRepository.findbyEmail(loginDto.email);
        if (!user) {
            throw new error_1.AppError("user not found", 404);
        }
        ;
        if (!user.password)
            throw new error_1.AppError("use google sign-in for this account", 400);
        const match = await (0, utlis_1.comparePassword)(String(loginDto.password), user.password);
        if (!match)
            throw new error_1.AppError("wrong password", 403);
        const accessToken = (0, utlis_2.generateAccessToken)({ id: user._id, name: user.userName });
        const refreshToken = (0, utlis_3.generateRefreshToken)({ id: user._id, name: user.userName });
        const ttlRemaining = await init_1.cacheProvider.ttl(`${loginDto.email}:login`);
        const attempts = cachedAttempt ?? 5;
        const ttl = ttlRemaining === -2 ? (0, time_1.toSeconds)(3, 'minutes') : ttlRemaining;
        await init_1.cacheProvider.set(` ${loginDto.email}:login`, String(+attempts - 1), ttl);
        return {
            accessToken,
            refreshToken
        };
    };
    register = async (registerDto) => {
        const userExist = await this.userRepository.findbyEmail(registerDto.email);
        if (userExist)
            throw new error_1.AppError("user already exists", 404);
        registerDto.password = await (0, utlis_1.hashPassword)(registerDto.password);
        const createdUser = await this.userRepository.create(registerDto);
        const otp = (0, otp_utils_1.generateOTPCode)();
        await init_1.cacheProvider.set(`${this.sendOtp}${createdUser._id.toString()}`, otp, (0, time_1.toSeconds)(3, 'minutes'));
        await this.mailProvider.SendMail(registerDto.email, 'verification code ', `<h1> your verification code is $ {otp} </h1>`);
        return createdUser;
    };
    verfyAccount = async (verfyAccountDto) => {
        const user = await this.userRepository.findbyEmail(verfyAccountDto.email);
        if (!user) {
            throw new error_1.AppError("user not found", 404);
        }
        if (user.isVerified === true)
            throw new error_1.AppError("account is already vereified", 404);
        const cacheCode = await init_1.cacheProvider.get(`${this.sendOtp}${user._id.toString()}`);
        if (!cacheCode)
            throw new error_1.AppError("otp is expired", 403);
        if (cacheCode !== verfyAccountDto.code)
            throw new error_1.AppError("invalid code", 404);
        const updatedUser = await this.userRepository.update({ email: verfyAccountDto.email }, { isVerified: true });
        await init_1.cacheProvider.del(`${this.sendOtp}${user._id.toString()}`);
        return updatedUser;
    };
    sendOtp = async (sendOtpDto) => {
        const { email } = sendOtpDto;
        const user = await this.userRepository.findbyEmail(sendOtpDto.email);
        if (!user) {
            throw new error_1.AppError("user not found , please login first", 404);
        }
        const otp = (0, otp_utils_1.generateOTPCode)();
        await init_1.cacheProvider.set(`${this.senOtpKey}${user._id.toString()}`, otp, (0, time_1.toSeconds)(3, 'minutes'));
        await this.mailProvider.SendMail(sendOtpDto.email, 'new otp', `<p>your new otp is ${otp}</p>`);
    };
    loginWithGoogle = async (idToken) => {
        const payload = await (0, google_auth_1.verifiyGoogleToken)(idToken);
        if (!payload)
            throw new error_1.AppError('no payload provided', 400);
        const user = await this.userRepository.findbyEmail(payload.email);
        if (user) {
            return (0, utlis_2.generateAccessToken)({
                id: user._id,
                email: user.email,
            });
        }
        const createdUser = await this.userRepository.create({
            userName: payload.name,
            email: payload.email,
            provider: enum_1.Provider.GOOGLE,
            isVerified: true,
        });
        return (0, utlis_2.generateAccessToken)({
            id: createdUser._id,
            email: createdUser.email,
        });
    };
    refreshTokenFn = async (token) => {
        const payload = jsonwebtoken_1.default.verify(token, env_1.env.jwt.refreshSecret);
        const accessToken = (0, utlis_2.generateAccessToken)({ sub: payload.sub, userName: payload.userName });
        const refreshToken = (0, utlis_3.generateRefreshToken)({ sub: payload.sub, name: payload.userName });
        return {
            accessToken,
            refreshToken,
        };
    };
}
exports.AuthService = AuthService;
exports.default = new AuthService();
