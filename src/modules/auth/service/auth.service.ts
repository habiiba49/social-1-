import { UserRepository } from "../../user/repo/user.repo";
import { LoginDto, SendOtpDto, VerfyAccountDto , RegisterDto} from "../dto/auth.dto";
import { AppError } from "../../../lib/error/error";
import {comparePassword, hashPassword} from "../utlis"; 
import { cacheProvider } from "../../../lib/cache/init";
import { toSeconds } from "../../../pkg/utils/time";
import { mailjetProvider } from "../../../lib/email/init";
import { MailProvider } from "../../../pkg/email/mail.interface";
import { generateOTPCode } from "../../../lib/utils/otp.utils";
import { generateAccessToken } from "../utlis";
import { generateRefreshToken } from "../utlis";
import { verifiyGoogleToken } from "../../../lib/utils/google.auth";
import { Provider } from "../../../lib/enum";
import  jwt  from "jsonwebtoken"
import { env } from "../../../lib/config/env";




export class AuthService {
private twoStepVerification = '2-step-verification:'
private senOtpKey = 'otp:';
private readonly mailProvider : MailProvider
    private  readonly userRepository : UserRepository
    constructor(){
       this.userRepository = new UserRepository, 
       this.mailProvider = mailjetProvider
      }


login = async (loginDto : LoginDto) => {
const cachedAttempt = await cacheProvider.get(`${loginDto.email}:login`)
const user = await this.userRepository.findbyEmail(loginDto.email)
if(!user) {throw new AppError("user not found", 404)}; 
if (!user.password) throw new AppError("use google sign-in for this account", 400);
const match = await comparePassword(String(loginDto.password), user.password);
if(!match) throw new AppError("wrong password", 403 )


const accessToken: string = generateAccessToken({id: user._id, name: user.userName});
const refreshToken: string = generateRefreshToken({id: user._id, name: user.userName});

const ttlRemaining: number = await cacheProvider.ttl(`${loginDto.email}:login`);
const attempts: string | 5 = cachedAttempt ?? 5;
const ttl: number = ttlRemaining === -2 ? toSeconds( 3,  'minutes') : ttlRemaining;
await cacheProvider.set(` ${loginDto.email}:login`, String(+attempts - 1), ttl);

return {
accessToken,
refreshToken
}
}

register= async (registerDto : RegisterDto) => {
   const userExist  =  await this.userRepository.findbyEmail(registerDto.email)
if(userExist) throw new AppError("user already exists", 404)
registerDto.password = await hashPassword(registerDto.password); 
const createdUser = await this.userRepository.create(registerDto)
const otp = generateOTPCode()
await cacheProvider.set (`${this.sendOtp}${createdUser._id.toString()}`, otp , toSeconds(3,'minutes')); 
await this.mailProvider.SendMail(registerDto.email, 'verification code ', `<h1> your verification code is $ {otp} </h1>`)
return createdUser;
}



 verfyAccount= async (verfyAccountDto: VerfyAccountDto) => {
const user = await this.userRepository.findbyEmail(verfyAccountDto.email)
if(!user){ throw new AppError("user not found", 404 )}
if (user.isVerified === true) throw new AppError("account is already vereified", 404)
   const cacheCode = await cacheProvider.get (`${this.sendOtp}${user._id.toString()}`) 
      if (!cacheCode) throw new AppError ("otp is expired", 403 )
      if (cacheCode !== verfyAccountDto.code ) throw new AppError ("invalid code", 404 );
      const updatedUser = await this.userRepository.update({email:verfyAccountDto.email}, {isVerified: true})
      await cacheProvider.del (`${this.sendOtp}${user._id.toString()}`); 
      return updatedUser; 
       
}

sendOtp = async (sendOtpDto: SendOtpDto) => {
const {email} = sendOtpDto
   const user = await this.userRepository.findbyEmail(sendOtpDto.email)
   if(!user) {throw new AppError("user not found , please login first", 404)}
   const otp = generateOTPCode(); 
   await cacheProvider.set(`${this.senOtpKey}${user._id.toString()}`, otp , toSeconds(3,'minutes')); 
   await this.mailProvider.SendMail(sendOtpDto.email, 'new otp', `<p>your new otp is ${otp}</p>`)

}

loginWithGoogle= async (idToken: string) => {
  const payload = await verifiyGoogleToken(idToken);
  if (!payload) throw new AppError('no payload provided', 400);
  const user = await this.userRepository.findbyEmail(payload.email as string);

  if (user) {
    return generateAccessToken({
      id: user._id,
      email: user.email,
    });
  }

  const createdUser = await this.userRepository.create({
    userName: payload.name,
    email: payload.email,
    provider: Provider.GOOGLE,
    isVerified: true,
  });

  return generateAccessToken({
    id: createdUser._id,
    email: createdUser.email,
  });
}


refreshTokenFn = async (token: string) => {
  const payload = jwt.verify(token, env.jwt.refreshSecret) as any ;
  const accessToken: string = generateAccessToken({ sub: payload.sub, userName: payload.userName });
  const refreshToken: string = generateRefreshToken({ sub: payload.sub, name: payload.userName });

  return {
    accessToken,
    refreshToken,
  }
}
}


export  default new AuthService();





