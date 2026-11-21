import { AppError } from "../error/error.js";
import jwt from "jsonwebtoken"
import { env } from "../config/env";
import { NextFunction, Request, Response } from "express";

export interface JwtPayload{
  sub: string , 
  email: string ,
  role: string , 
  id : string 
}


export function authGuard(req: Request, res:Response, next: NextFunction) {
  try {
    const token = req.cookies?.accessToken;
    if (!token) throw new AppError("no token provided", 401);
    req.user = jwt.verify(token , env.jwt.secret) as JwtPayload;
    next ();
  } catch (error) {
    next(error instanceof AppError ? error : new AppError("invalid or expired token", 401));
  }
}