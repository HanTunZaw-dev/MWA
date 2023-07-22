import { RequestHandler } from "express";
import { IResponse } from "../types/IResponse";
import { BodyWithTonken } from "../types/BodyWithTonken";
import Desire from "../models/desires.model"
import { ErrorResponse } from "../types/ErrorResponse";
import { BodyWithOperator } from "../types/BodyWithOperator";

export const add_volunteer : RequestHandler<{desire_id: string}, IResponse<number>, BodyWithTonken> = async (req, res, next) => {
    try{
        const {desire_id} = req.params;
        const {token_data: {_id: userId, fullname, email}} = req.body;
        const results = await Desire.updateOne(
            {_id: desire_id, 'createBy.userId': {$ne: userId}, 'volunteers.userId': userId},
            {$set:{'volunteers.$.status': "Pending"}}
        )
        if(results.modifiedCount > 0){
            res.json({success: true, data: results.modifiedCount});
            return;
        }
        else{
            const newvolunter = {
                userId,
                fullname,
                email,
                status: "Pending"
            }
            const results = await Desire.updateOne(
                {_id: desire_id, 'createBy.userId': {$ne: userId}},
                {$addToSet:{volunteers: newvolunter}}
            )   
            res.json({success: results.modifiedCount? true : false, data: results.modifiedCount});
        }      
    }
    catch(error){
        next(error);
    }
}

export const update_volunteer_by_id : RequestHandler<{desire_id: string, volunteer_id: string}, IResponse<number>, BodyWithOperator & BodyWithTonken> = async (req, res, next) => {
    try{
        let status: String = 'Accepted';
        const {desire_id, volunteer_id} = req.params;
        const {token_data: {_id: userId}, operator} = req.body;
        switch(operator){
            case 'Accept':
                status = "Accepted";
                const result1 = await Desire.updateOne({_id: desire_id, 'volunteers.userId': volunteer_id},
                {$set: {'volunteers.$.status': status}})
                res.json({success: result1.modifiedCount? true : false, data: result1.modifiedCount});
                break;
            case 'Reject':
                status = "Rejected";
                const result2 = await Desire.updateOne({_id: desire_id, 'volunteers.userId': volunteer_id},
                {$set: {'volunteers.$.status': status}})
                res.json({success: result2.modifiedCount? true : false, data: result2.modifiedCount});
                break;
            case 'Unregister':
                status = "Unregistered";
                const result3 = await Desire.updateOne({_id: desire_id, 'volunteers.userId': volunteer_id},
                {$set: {'volunteers.$.status': status}})
                res.json({success: result3.modifiedCount? true : false, data: result3.modifiedCount});
                break;
            case 'Close':
                status = "Done";
                const result4 = await Desire.updateOne({_id: desire_id, 'volunteers.userId': volunteer_id},
                {$set: {'volunteers.$.status': status}})
                res.json({success: result4.modifiedCount? true : false, data: result4.modifiedCount});
                break;
            default:
                throw new ErrorResponse("Invalid operator.", 400);
        }
    }
    catch(error){
        next(error);
    }
}



