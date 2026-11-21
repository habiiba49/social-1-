
import express from "express" ;
import {router} from './route'; 
import cookieParser from "cookie-parser";


export function createApp (){
    const app = express();
    app.use(express.json());
    app.use('/api', router); 
    app.use(cookieParser());

    return app ;

}