import dotenv from "dotenv"

dotenv.config();

export default{
    port:process.env.PORT,
    TOKEN_SECRET: process.env.TOKEN_SECRET,
}