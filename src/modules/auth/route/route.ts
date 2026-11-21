import { Router} from "express";
import authController from "../controller/auth.controller";
export const authRouter =Router(); 

authRouter.use('/register', authController.register ); 
authRouter.use('/login', authController.login); 
authRouter.use('/refrsh-token', authController.refreshToken); 
authRouter.use('/login-with-google', authController.loginWithGoogle); 
authRouter.use('/verifiy-account', authController.verifyAccount); 
authRouter.use('/send-otp', authController.sendOtp);

