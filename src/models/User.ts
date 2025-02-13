import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document{
    handle: string
    name: string
    email: string
    password: string
    description: string
    image: string
    links: string
}

const userSchema = new Schema({
    handle: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true,
        default: ""
    },
    image: {
        type: String,
        trim: true
    },
    links: {
        type: String,
        default: "[]"
    }
})

const User = mongoose.model<IUser>("User", userSchema)

export default User