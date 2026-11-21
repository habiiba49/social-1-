import { Request, Response, NextFunction, response } from "express";
import userService from "../service/user.service";
import { BodyResponseCallback } from "google-auth-library/build/src/auth/authclient";




class UserController {
    private readonly  userService = userService;

    uploadProfilePicture = async (req: Request , res: Response, next:NextFunction ) => {
        try {
            await this.userService.uploadProfilePicture
            (req.file as Express.Multer.File , 'habiba'); 
            res.json({message: "profilepic uploaded successfully", success : true })

        } catch(error){
            next (error)
        }
    }



    genaratePresignedUrl= async (req: Request , res : Response , next : NextFunction)=> {
        try{
            const {fileName, ContentType}= req.body ;
             const url = await this.userService.generatPresignedUrl({
                mimetype:ContentType,
               originalname: fileName}, 
                'habiba');

            res.json({
                message: "link created successfully", 
                success: true , 
                data: {url}
            });

        }  catch(error){
            next(error)
        }
    }


    deleteProfilePic = async(req: Request, res : Response , next: NextFunction) => {
        try{
            await this.userService.deleteProfilePicture("habiba");
            res.json({message: "pic deleted successfully ", success: true })

        }  catch(error){ 
            next(error)

        }

    }
} 

export default new UserController();