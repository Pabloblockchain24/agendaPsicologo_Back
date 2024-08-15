/*Import dependencies*/
import {Router} from "express";

/*Router instance*/
const router = Router();

/*Import controller patients functions*/
import { 
  getPatients, 
  getPatientById,
  createPatient, 
  updatePatient, 
  deletePatient 
} from "../controllers/patientsController.js";

/*Routes for each endpoint*/
router.get("/patients", getPatients)
router.post("/patient", createPatient)

router.get("/patient/:id", getPatientById)
router.put("/patient/:id", updatePatient)
router.delete("/patient/:id", deletePatient)

export default router