import { RequestHandler } from "express";
import jwt from 'jsonwebtoken';
import { ErrorResponse } from "../types/ErrorResponse";
import { IToken } from "../types/IToken";
export const parseToken: RequestHandler = (req, res, next) =>{
    try{
        const header = req.headers['authorization'];
        if(header){
            const token = header.split(' ')[1];
            const plain_token = jwt.verify(token, process.env.jwt_pk!) as IToken;
            req.body['token_data'] = plain_token;   
        } 
        next();
    }
    catch(error){
        next(error);
    }
}

export const verifyRequireToken: RequestHandler = (req, res, next) =>{
    try{
        if(!req.body['token_data'])
            throw new ErrorResponse('Token is required', 403);

        next();
    }
    catch(error){
        next(error);
    }
}
