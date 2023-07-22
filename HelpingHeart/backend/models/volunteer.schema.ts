import { InferSchemaType, Schema, Types } from 'mongoose';

export const volunteerSchema = new Schema({
    userId: Types.ObjectId,
    fullname: String,
    status: String,
});

export type IVolunteer = InferSchemaType<typeof volunteerSchema>;
