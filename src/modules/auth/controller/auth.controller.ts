import { NextFunction, Request, Response, Router } from "express";
import authService, { AuthService } from "../service/auth.service";
const router = Router()


export class AuthController {
    private authService: AuthService = authService;

    constructor(){

    }

 register = async  (req : Request,res: Response,next: NextFunction) => {
 try {
    const user =  await this.authService.register(req.body)
    return res.status(200).json({
    message : "created successfully ",
    success : true , data : user})
}
    catch (error){
        next (error)
    }
}
  
  verifyAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.authService.verfyAccount(req.body);
      return res.status(200).json({
        message: "account verified successfully",
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  sendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.sendOtp(req.body);
      return res.status(200).json({
        message: "otp sent successfully",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokens = await this.authService.login(req.body);
      return res.status(200).json({
        message: "logged in successfully",
        success: true,
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  };

  loginWithGoogle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = await this.authService.loginWithGoogle(req.body.idToken);
      return res.status(200).json({
        message: "logged in with google successfully",
        success: true,
        data: { accessToken },
      });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokens = await this.authService.refreshTokenFn(req.body.refreshToken);
      return res.status(200).json({
        message: "token refreshed successfully",
        success: true,
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new AuthController();