import { Router } from "express";
import { body } from "express-validator";
import { UserController } from "./controllers/UserController";
import { handleInputErrors } from "./middlewares/validationMiddleware";
import { isAuth } from "./middlewares/authMiddleware";

const router = Router();

/* AUTENTICACIÓN Y REGISTRO */
router.post("/auth/register", 
    body("handle")
        .trim()
        .notEmpty().withMessage("El handle es obligatorio")
        .isString().withMessage("El handle debe ser un texto")
        .isLength({ min: 3, max: 20 }).withMessage("El handle debe tener entre 3 y 20 caracteres")
        .matches(/^[a-zA-Z0-9]+$/).withMessage("El handle solo puede contener letras y números"),
    body("name")
        .trim()
        .notEmpty().withMessage("El nombre es obligatorio")
        .isString().withMessage("El nombre debe ser un texto"),
    body("email")
        .trim()
        .notEmpty().withMessage("El correo es obligatorio")
        .isEmail().withMessage("Introduce un email válido"),
    body("password")
        .isLength({ min: 5 }).withMessage("La contraseña debe tener al menos 5 caracteres"),
    handleInputErrors,
    UserController.createAccount
);

router.post("/auth/login", 
    body("email")
        .trim()
        .notEmpty().withMessage("El correo es obligatorio")
        .isEmail().withMessage("Introduce un email válido"),
    body("password")
        .isLength({ min: 5 }).withMessage("La contraseña no es válida"),
    handleInputErrors,
    UserController.loginUser
);

router.get("/user", isAuth, UserController.getUser)
router.patch("/user", 
    body("handle")
        .trim()
        .notEmpty().withMessage("El handle es obligatorio")
        .isString().withMessage("El handle debe ser un texto")
        .isLength({ min: 3, max: 20 }).withMessage("El handle debe tener entre 3 y 20 caracteres")
        .matches(/^[a-zA-Z0-9]+$/).withMessage("El handle solo puede contener letras y números"),
    body("description")
        .trim()
        .isString().withMessage("La descripción debe ser un texto"),
    handleInputErrors,
    isAuth, 
    UserController.updateProfile
)
router.post("/user/image", isAuth, UserController.uploadProfileImage)

router.get("/user/:handle", UserController.getUserByHandle)

router.post("/search", 
    body("handle")
        .trim()
        .notEmpty().withMessage("El handle es obligatorio")
        .isString().withMessage("El handle debe ser un texto")
        .isLength({ min: 3, max: 20 }).withMessage("El handle debe tener entre 3 y 20 caracteres")
        .matches(/^[a-zA-Z0-9]+$/).withMessage("El handle solo puede contener letras y números"),
    handleInputErrors,
    UserController.searchByHandle)

export default router