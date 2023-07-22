import { RequestHandler } from "express";
import { IResponse } from "../types/IResponse";
import { BodyWithTonken } from "../types/BodyWithTonken";
import { IDesire } from "../models/desires.model";
import Desire from "../models/desires.model"
import { ErrorResponse } from "../types/ErrorResponse";
import { BodyWithOperator } from "../types/BodyWithOperator";
import { PipelineStage, Types } from "mongoose";
export const add_desire : RequestHandler<unknown, IResponse<string>, IDesire & BodyWithTonken> = async (req, res, next) => {  
    try{
        const {_id: userId, fullname, email} = req.body.token_data;
        const results = await Desire.create({
            ...req.body,
            createdBy: {userId, fullname, email},     
            status: "Open",
            volunteers: []
        });
        res.json({success: true, data: results._id.toString()});
    }
    catch(error){
        next(error);
    }
}

export const get_desires : RequestHandler<unknown, IResponse<IDesire[]>, IDesire & BodyWithTonken, {page: number, status: string}> = async (req, res, next)  => {
    try{
        const page_number: number = req.query.page || 1;
        const page_size = 10;
        const {token_data} = req.body;
        const stages: PipelineStage[] = [];
        if(!token_data){
            stages.push({$match: {status: "Open"}})
        }
        else{
            const {status: queryStatus } = req.query; 
            if(queryStatus === "CreatedByUser"){
                stages.push({$match: {"createdBy.userId": new Types.ObjectId(token_data._id)}})               
            }
            else if(queryStatus === "RegisteredByUser"){
                stages.push({$match: {"volunteers.userId": new Types.ObjectId(token_data._id)}})               
            }
            else if(queryStatus){
                stages.push({$match: {status: queryStatus}})               
            }
        }
        stages.push({$project: {contactInfo: 0}});
        stages.push({$sort: {'_id': -1}});
        stages.push({$skip: page_size * ( page_number -1)});
        stages.push({$limit: page_size});
        const results = await Desire.aggregate(stages);

        res.json({success: true, data: results})        
    }
    catch(error){
        next(error);
    }
}

export const get_desire_by_id : RequestHandler<{desire_id: string}, IResponse<IDesire>, BodyWithTonken > = async (req, res, next) => {
    try{
        const desire =  await Desire.findOne({_id: req.params.desire_id}, {});
        if(!desire) throw new ErrorResponse('Desire not found', 404);
        res.json({success: true, data: desire});      
    }
    catch(error){
        next(error);
    }
}

export const update_desire_by_id : RequestHandler<{desire_id: string}, IResponse<number>, IDesire & BodyWithOperator & BodyWithTonken> = async (req, res, next) => {
    try{
        const {desire_id} = req.params;
        const {token_data: {_id: userId}} = req.body;
        const {operator} = req.body;
        if(operator === "Cancel"){
            const results = await Desire.updateOne({_id: desire_id, 'createdBy.userId': userId},
            {$set: {status: "Cancelled"}})
            res.json({success: true, data: results.modifiedCount});
        }
        else if(operator === "Close"){
            const results = await Desire.updateOne({_id: desire_id, 'createdBy.userId': userId},
            {$set: {status: "Closed"}})
            res.json({success: true, data: results.modifiedCount});
        }
        else{
            const results = await Desire.updateOne({_id: desire_id, 'createdBy.userId': userId},
            {$set: {
                    description: req.body.description,
                    category: req.body.category,
                    title: req.body.title,
                    requestTime: req.body.requestTime,
                    location: req.body.location,
                    address: req.body.address,
                    contactInfo: req.body.contactInfo,
                    estimateInHours: req.body.estimateInHours,
                    numberOfVolunteerNeeded: req.body.numberOfVolunteerNeeded,
                }
            })
            res.json({success: results.modifiedCount? true : false, data: results.modifiedCount});
        }
       
    }
    catch(error){
        next(error);
    }
}


export const delete_desire_by_id : RequestHandler<{desire_id: string}, IResponse<number>, BodyWithTonken> = async (req, res, next) => {
    try{
        
        const {desire_id} = req.params;

        const {token_data: {_id: userId}} = req.body;
        const results = await Desire.deleteOne({_id: desire_id, 'createdBy.userId': userId})

        res.json({success: results.deletedCount? true : false, data: results.deletedCount});       
    }
    catch(error){
        next(error);
    }
}


