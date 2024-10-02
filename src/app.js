/*Import dependencies*/
import express from 'express';
import cookieParser from "cookie-parser"
import cors from "cors"

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

/*Cors configuration*/
const allowedOrigins = [
    'http://localhost:5173',
    'https://agenda-psicologo-front.vercel.app/',

];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    credentials: true
};

app.use(cors(corsOptions));

/*Uso de router*/
app.use("/api", patientRouter)
app.use("/api", appointmentRouter)
app.use("/api", psicologosRouter)

export default app