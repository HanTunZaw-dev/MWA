import { RequestHandler } from "express";
import { IResponse } from "../types/IResponse";
import { BodyWithTonken } from "../types/BodyWithTonken";
import { IDesire } from "../models/desires.model";
import Desire from "../models/desires.model"
import { Types } from "mongoose";

export const get_created_desires_by_logged_user : RequestHandler<unknown, IResponse<IDesire[]>, BodyWithTonken> = async (req, res, next) => {
    try{
        const results = await Desire.aggregate([
            {$match: {"createdBy.userId": new Types.ObjectId(req.body.token_data._id)}},

            {$project: { volunteers: 0, contactInfo: 0}},
            {$sort: {'_id': -1}},
        ])

        res.json({success: true, data: results})        
    }
    catch(error){
        console.log(error);
        next(error);
    }
}

export const get_registered_desires_by_logged_user : RequestHandler<unknown, IResponse<IDesire[]>, BodyWithTonken> = async (req, res, next) => {
    try{
        const page_size = 10;
        const results = await Desire.aggregate([
            {$match: {"volunteers.userId": new Types.ObjectId(req.body.token_data._id)}},
            {$project: { volunteers: 0, contactInfo: 0}},
            {$sort: {'_id': -1}},
            {$limit: page_size}
        ]);

        res.json({success: true, data: results})        
    }
    catch(error){
        console.log(error);
        next(error);
    }
}

