import { Iuser } from "../interface/user.interface"
import { AbstractRepository } from "../../../db/models/apstracted.repository"
import { User } from "../model/user.model"
import { HydratedDocument } from "mongoose"

export class UserRepository extends AbstractRepository<Iuser>{

constructor(){
    super(User)
}
 async findbyEmail (email: String): Promise< HydratedDocument<Iuser> | null> {
    return User.findOne({email: email.toLowerCase()})
 

 
} }
export default new UserRepository()