import { RequestHandler } from "express";
import { ErrorResponse } from "../types/ErrorResponse";
import { IResponse } from "../types/IResponse";
import User, { IUser } from "../models/auth.model";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const signup : RequestHandler<unknown, IResponse<string>, {email: string, password: string}> = async (req, res, next) => {  
    try{
        const {email, password} = req.body;
        if(!email || !password) throw new ErrorResponse(`Email and Password cannot be empty`, 400);
        
        const existingUser = await User.findOne({ email: email }).collation({locale: "en", strength: 2});
        if (existingUser) throw new ErrorResponse('Account Already Exist!', 400);

        const hashedPassword  = await bcrypt.hash(password, 10);
        const results =await  User.create({
            ...req.body,
            password: hashedPassword 
        });

        res.json({success: true, data: results._id.toString()})
    }
    catch(error){
        next(error);
    }
}

export const signin : RequestHandler<unknown, IResponse<string>, IUser> = async (req, res, next) => {
    try{
        const {email, password} = req.body;
        if(!email || !password) throw new ErrorResponse(`Email and Password cannot be empty`, 400);

        const user = await User.findOne({ email }).collation({locale: "en", strength: 2});
        if(!user) throw new ErrorResponse('User not found', 404);
        
        const compared = await bcrypt.compare(password, user.password!);
        if(!compared) throw new ErrorResponse("Invalid password", 403);

        if (!process.env.JWT_PK) throw new ErrorResponse('Key Not Found', 500);

        const token = jwt.sign({
                                    _id: user._id.toString(), 
                                    email: user.email,
                                    fullname: user.name?.first + ' ' + user.name?.last
                                }, process.env.JWT_PK)
        
        res.json({success: true, data: token})
    }
    catch(error){
        next(error);
    }
}

export const change_password : RequestHandler<unknown, IResponse<number>, {email: string, old_password: string, new_password: string}> = async (req, res, next) => {
    try{
        const {email, old_password, new_password} = req.body;
        if(!email || !old_password || !new_password) throw new ErrorResponse(`Email and Password cannot be empty`, 400);

        const user = await User.findOne({ email }).collation({locale: "en", strength: 2});
        if(!user) throw new ErrorResponse('User not found', 404);
        
        const compared = await bcrypt.compare(old_password, user.password!);
        if(!compared) throw new ErrorResponse("Current password is incorrect", 403);
                       
        const hashedNewPassword  = await bcrypt.hash(new_password, 10);
        const result = await User.updateOne(
                                {email: email}, 
                                {$set:
                                    {password: hashedNewPassword }
                            });
        
        res.json({success: true, data: result.modifiedCount})

    }
    catch(error){
        next(error);
    }
}

