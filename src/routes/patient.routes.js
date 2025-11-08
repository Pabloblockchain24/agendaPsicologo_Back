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
  deletePatient,
  getPatientByRut,
  updatePatientContact ,
  createNewPatientByContact
} from "../controllers/patientsController.js";

/*Routes for each endpoint*/
router.get("/patients", getPatients)
router.post("/patient", createPatient)

router.get("/patient/:id", getPatientById)
router.get("/patientByRut/:rut", getPatientByRut)

router.post("/createNewPatientByContact", createNewPatientByContact)

router.put("/updatePatient", updatePatientContact)
router.delete("/patient/:id", deletePatient)

export default router