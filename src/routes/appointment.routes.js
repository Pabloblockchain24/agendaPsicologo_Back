/*Import dependencies*/
import {Router} from "express";

/*Router instance*/
const router = Router();

/*Import controller citas functions*/
import {
    getAppointments,
    createAppointment,
    getAppointmentById,
    updateAppointment,
    deleteAppointment
} from "../controllers/appointmentsController.js";

/*Routes for each endpoint*/
router.get("/appointments", getAppointments)
router.post("/appointment", createAppointment)

router.get("/appointment/:id", getAppointmentById)
router.put("/appointment/:id", updateAppointment)
router.delete("/appointment/:id", deleteAppointment)


export default router