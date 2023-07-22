import { Types, InferSchemaType, Schema, model } from 'mongoose';
import { userSchema } from './auth.model';
import { volunteerSchema } from './volunteer.schema';


const desireSchema = new Schema({
    status: String,
    category: String,
    title: String,
    description: String,
    requestTime: Date,
    location: {type: [Number]},
    address: String,
    contactInfo: String, //show to accepted helper only.
    estimateInHours: Number, //how long to finish the task
    numberOfVolunteerNeeded: Number,
    createdBy: {
        userId: Types.ObjectId,
        fullname: String,
        email: String
    },
    volunteers: [volunteerSchema]


}, { timestamps: true, versionKey: false });

export type IDesire = InferSchemaType<typeof desireSchema>;

export default model<IDesire>('desire', desireSchema)