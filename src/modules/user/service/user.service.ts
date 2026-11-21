import { s3CloudProvider } from "../../../lib/cloud/init";
import { ICloudProvider } from "../../../pkg/cloud/cloud.interface"; 
import userRepo from "../repo/user.repo";
import {AppError} from "../../../lib/error/error"

class UserService {
    private readonly cloudProvider: ICloudProvider= s3CloudProvider; 
    private readonly userRepo = userRepo; 

    uploadProfilePicture = async (file: Express.Multer.File, userId : string ) => {
       const key = await this.cloudProvider.uploadFile(file, `users/${userId}`); 
       await this.userRepo.update(
        {_id: userId}, 
        {profilePicturePath: key}
    );
            
    }


    generatPresignedUrl = async(file: Partial<Express.Multer.File>, userId: string ) => {
      return await this.cloudProvider.generatePresignedUrl(file, `users/${userId}`)
    }


    deleteProfilePicture = async (userId: string): Promise<void> => {
    const user = await userRepo.getOne({ _id: userId });
    if (!user?.profilePicturePath) {
      throw new AppError('Profile Pic not found', 404);
    }
    await this.cloudProvider.deleteFile(user?.profilePicturePath);
    await this.userRepo.update({ _id: userId }, { $unset: { profilePicPath: 1 } });
  };
}


export default new UserService(); 