/*Import dependencies*/
import express from 'express';
import cookieParser from "cookie-parser"

/*Import routers*/
import patientRouter from "./routes/patient.routes.js"
import appointmentRouter from "./routes/appointment.routes.js"
import psicologosRouter from "./routes/psicologos.routes.js"

/*Instancia de express.js*/
const app = express();

/*Middlewares express.js */
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

/*Uso de router*/
app.use("/api", patientRouter)
app.use("/api", appointmentRouter)
app.use("/api", psicologosRouter)

export default app