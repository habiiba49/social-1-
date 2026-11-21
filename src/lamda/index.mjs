import {MongoClient} from 'mongodb'

const client = new MongoClient ('mongodb+srv://nhabiba173_db_user:gFmT3e8f2mf3giWa@cluster0.dcgqlwl.mongodb.net/')
const Db = client.db('social-app'); 
const users = Db.collection('users'); 



export const handler = async(event) =>{
    
    
}