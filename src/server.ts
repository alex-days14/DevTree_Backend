import express from "express"
import cors from "cors"
import 'dotenv/config'
import router from "./router";
import { connectDB } from "./config/db";
import { corsConfig } from "./config/cors";

// Conectar a la base de datos
connectDB();

const app = express();

// Habilitar CORS
app.use(cors(corsConfig))

// Habilitar lectura de formularios
app.use(express.json())

//Routing
app.use("/api", router)

export default app;