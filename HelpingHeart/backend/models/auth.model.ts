import { Schema, model, InferSchemaType } from 'mongoose';


export const userSchema = new Schema({
    name: { first: String, last: String },
    email: { type: String, unique: true },
    password: String,
    location: { type: [Number], required: false },
    phone: { type: String, required: false },
    address: { type: String, required: false },
    rating: { type: Number, required: false }
}, { timestamps: true, versionKey: false })

export type IUser = InferSchemaType<typeof userSchema>;

export default model<IUser>('user', userSchema)