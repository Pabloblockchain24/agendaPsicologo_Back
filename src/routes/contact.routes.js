/*Import dependencies*/
import {Router} from "express";

/*Router instance*/
const router = Router();

/*Import controller contact functions*/
import { sendContactMail} from "../controllers/contactController.js";

/*Routes for each endpoint*/
router.post("/sendContactMail", sendContactMail)

export default router