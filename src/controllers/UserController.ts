import type { Request, Response } from "express"
import slug from 'slug'
import formidable from 'formidable'
import { v4 as uuid } from "uuid"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import { generateJWT } from "../utils/jwt"
import cloudinary from "../config/cloudinary"

export class UserController {

    private static returnError = (res: Response, status: number, message: string) => {
        const error = new Error(message)
        res.status(status).json({ message: error.message })
    }

    static createAccount = async (req: Request, res: Response) => {

        const { name, email, password } = req.body

        try {
            const userExists = await User.findOne({ email })
            if (userExists) {
                this.returnError(res, 409, "Este correo está en uso")
                return
            }

            const handle = slug(req.body.handle, "")
            const handleExists = await User.findOne({ handle })
            if (handleExists) {
                this.returnError(res, 409, "Este handle no está disponible")
                return
            }

            const newUser = new User({ name, email, handle })
            newUser.password = await hashPassword(password)
            await newUser.save()

            res.status(201).send({ message: "Usuario registrado correctamente" });
        } catch (error) {
            res.status(400).json({ message: "Error al registrar el usuario" })
        }
    }

    static loginUser = async (req: Request, res: Response) => {
        const { email, password } = req.body
        try {
            const user = await User.findOne({ email })
            console.log(user)
            if (!user) {
                this.returnError(res, 404, "El usuario o contraseña no son correctos")
                return
            }

            const isCorrectPassword = await checkPassword(password, user.password)
            if (!isCorrectPassword) {
                this.returnError(res, 401, "El usuario o contraseña no son correctos")
                return
            }

            const token = generateJWT({ id: user.id })

            res.status(200).json(token);

        } catch (error) {
            res.status(400).json({ message: "Error al autenticar el usuario" })
        }
    }

    static getUser = async (req: Request, res: Response) => {
        res.status(200).json(req.user)
    }

    static updateProfile = async (req: Request, res: Response) => {
        try {
            const { description, links } = req.body

            const handle = slug(req.body.handle, "")
            const handleExists = await User.findOne({ handle })
            if (handleExists && handleExists.email !== req.user.email) {
                this.returnError(res, 409, "Este handle no está disponible")
                return
            }

            req.user.handle = handle
            req.user.description = description
            req.user.links = links
            await req.user.save()
            res.status(200).json({ message: "Perfil actualizado correctamente", handle: req.user.handle })
        } catch (error) {
            res.status(500).json({ message: "Hubo un error" })
        }
    }

    static uploadProfileImage = async (req: Request, res: Response) => {

        const form = formidable({ multiples: false })
        try {
            form.parse(req, async (error, fields, files) => {
                await cloudinary.uploader.upload(files.profileImage[0].filepath, { public_id: uuid() }, async (error, result) => {
                    if (error) {
                        this.returnError(res, 500, "Hubo un error al subir la imagen")
                        return
                    }
                    if (result) {
                        req.user.image = result.secure_url
                        await req.user.save()
                        res.status(200).json({ image: result.secure_url })
                    }
                })
            })
        } catch (error) {
            res.status(500).json({ message: "Hubo un error" })
        }
    }

    static getUserByHandle = async (req: Request, res: Response) => {
        try {
            const { handle } = req.params
            const user = await User.findOne({ handle }).select("handle name description image links -_id")
            if(!user){
                this.returnError(res, 404, "Página no encontrada")
                return
            }
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json({ message: "Hubo un error" })
        }
    }

    static searchByHandle = async (req: Request, res: Response) => {
        try {
            const { handle } = req.body
            const user = await User.findOne({ handle }).select("handle")
            if(user){
                console.log(user)
                this.returnError(res, 409, "Handle no disponible")
                return
            }
            res.status(200).json({ message: "Handle disponible" })
        } catch (error) {
            res.status(500).json({ message: "Hubo un error" })
        }
    }
}