import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {
        const WHITELIST = process.env.FRONTEND_URL.split(";")

        if (process.argv.includes("--api")) {
            WHITELIST.push(undefined)
        }
        console.log(WHITELIST)
        console.log(origin)
        if (WHITELIST.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error("Error de CORS"))
        }
    }
}