import bcrypt from "bcrypt"
import { IUser } from "../models/User"

export const hashPassword = async (password: IUser["password"]) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

export const checkPassword = async (password: IUser["password"], hash: IUser["password"]) => {
    return await bcrypt.compare(password, hash)
}