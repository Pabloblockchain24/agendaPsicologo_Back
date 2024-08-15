/*Import dependencies*/
import {Router} from "express";

/*Router instance*/
const router = Router();

/*Import controller psicologos functions*/
import { 
    getPsicologos, 
    getPsicologoById,
    createPsicologo, 
    updatePsicologo, 
    deletePsicologo 
  } from "../controllers/psicologosController.js";

/*Routes for each endpoint*/
router.get("/psicologos", getPsicologos)
router.post("/psicologo", createPsicologo)

router.get("/psicologo/:id", getPsicologoById)
router.put("/psicologo/:id", updatePsicologo)
router.delete("/psicologo/:id", deletePsicologo)

export default router