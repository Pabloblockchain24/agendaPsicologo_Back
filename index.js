import app from "./src/app.js"
import config from "./src/config/config.js";
import { connectDB } from './src/db.js';

connectDB()

app.listen(config.port, () => {
    console.log(`Servidor corriendo en puerto ${config.port}`)
})

