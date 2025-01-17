import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import User, { IUser } from "../models/User"

declare global {
    namespace Express{
        interface Request {
            user?: IUser
        }
    }
}

export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization
    if(!bearer){
        res.status(401).json({ message: "No autorizado" })
        return
    }

    const token = bearer.split(" ")[1]
    if(!token){
        res.status(401).json({ message: "No autorizado" })
        return
    }

    try {
        const result = jwt.verify(token, process.env.JWT_SECRET)
        if(typeof result == "object" && result.id){
            const user = await User.findById(result.id).select("handle name email description image optimizedImage links")
            if(!user){
                res.status(404).json({ message: "Usuario no encontrado" })
                return 
            }
            req.user = user
            next()
        }
    } catch (error) {
        res.status(500).json({ message: "Token no válido" })
    }
}