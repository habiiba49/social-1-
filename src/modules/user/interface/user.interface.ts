import {Provider, Gender} from "../../../lib/enum";
import { Types } from "mongoose";

export interface Iuser{
    _id :Types.ObjectId;
    userName : string;
    email: string;
    password?: string;
    provider: Provider;
    gender?: Gender;
    profilepic: string;
    isVerified?: boolean; 
    isDeleted?: boolean ;
    profilePicturePath?: string; 
   
}