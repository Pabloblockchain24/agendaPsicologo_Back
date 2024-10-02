import { query } from "../db.js";

export const getAppointments = async (req, res) => {
    try {
        const appointments = await query('SELECT * FROM sesiones order by updated_at desc');
                res.json(appointments);
    } catch (error) {
        res.status(500).json({ text: "Error al obtener las sesiones", error: error.message });
    }
};

export const getAppointmentById = async (req, res) => {
    const { id } = req.params;
    try {
        const sesion = await query(`SELECT * FROM sesiones WHERE id_sesion = ?`, [id]);
        if (sesion.length > 0) {
            res.json(sesion[0]); 
        } else {
            res.status(404).json({ text: "Sesión no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ text: "Error al obtener la sesión", error: error.message });
    }
}

export const createAppointment = async (req, res) => {
    const { rut_paciente, id_psicologo, fecha, hora } = req.body

    if (!rut_paciente || !id_psicologo || !fecha || !hora ) {
        return res.status(400).json({ Error: "Todos los campos son requeridos" });
    }

    try {
        const result = await query(
            `INSERT INTO sesiones (rut_paciente, id_psicologo, fecha, hora, estado, observaciones, created_at, updated_at) 
             VALUES (?, ?, ?, ?, 'pendiente', ' ', NOW(), NOW())`,
            [rut_paciente, id_psicologo, fecha, hora ]
        );
        res.status(201).json({ message: 'Sesion creada exitosamente', id_sesion: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la sesión', error: error.message });
    }
}

export const updateAppointment = async (req, res) => {
    const { id } = req.params;
    const { id_paciente, id_psicologo, fecha, hora, estado, observaciones} = req.body

    if (!id_paciente || !id_psicologo || !fecha || !hora || !estado || !observaciones) {
        return res.status(400).json({ Error: "Todos los campos son requeridos" });
    }

    try {
        const appointmentExists = await query(`SELECT 1 FROM sesiones WHERE id_sesion = ?`, [id]);
        if (appointmentExists.length === 0) {
            return res.status(404).json({ text: "Sesión no encontrada" });
        }

        const result = await query(
            `UPDATE sesiones 
             SET id_paciente = ?, id_psicologo = ?, fecha = ?, hora = ?, estado = ?, observaciones = ?, updated_at = NOW() 
             WHERE id_sesion = ?`,
            [id_paciente, id_psicologo, fecha, hora, estado,observaciones, id]
        );

        if (result.affectedRows > 0) {
            res.json({ message: 'Sesión actualizada exitosamente' });
        } else {
            res.status(404).json({ text: "Sesión no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ text: "Error al actualizar la sesión", error: error.message });
    }

}
export const deleteAppointment = async (req, res) => {
    const { id } = req.params; 
    try {
        const appointmentExists = await query(`SELECT 1 FROM sesiones WHERE id_sesion = ?`, [id]);
        if (appointmentExists.length === 0) {
            return res.status(404).json({ text: "Sesión no encontrada" });
        }

        const result = await query(`DELETE FROM sesiones WHERE id_sesion = ?`, [id]);
        if (result.affectedRows > 0) {
            res.json({ message: 'Sesión eliminada exitosamente' });
        } else {
            res.status(404).json({ Error: "Sesión no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ text: "Error al eliminar la sesión", error: error.message });
    }
}