import { Router } from "express"; 
import{userRouter} from "../src/modules/user/route/route"
import {authRouter} from "../src/modules/auth/route/route"; 
import { authGuard } from "./lib/auth/guard";
 
export const router = Router();

router.use('/auth', authRouter);
router.use('/user', authGuard ,userRouter);





