import { Router } from "express";
import userController from "../controller/user.controller";
import {multerUploadSingle} from "../../../lib/media/multer";

export const userRouter: Router = Router();

userRouter.post('/upload-profile-pic', multerUploadSingle('pp'), userController.uploadProfilePicture);
userRouter.delete('/delete-profile-pic', userController.deleteProfilePic);
userRouter.post('/get-presigned-url', userController.genaratePresignedUrl);

