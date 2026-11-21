import { NextFunction, Request, Response } from 'express';
import { AppError } from "./error";


export function globalErrorHandeler (err: AppError ,req: Request,res: Response,_next: NextFunction) {
    
     if (err.isOperatioinal
     ){
    return res.status(err.statusCode).json({
        message: err.message,
        success: false ,
    })
   }
   

   return res.status(500).json({
    err:'something went wrong',
    success: false
   })
};
