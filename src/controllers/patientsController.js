/*Import dependencies*/
import bcrypt from "bcrypt"

/*Import DB connection*/
import { query } from "../db.js";
export const getPatients = async (req, res) => {
    try {
        const patients = await query('SELECT * FROM pacientes order by updated_at desc');
                res.json(patients);
    } catch (error) {
        res.status(500).json({ text: "Error al obtener los pacientes", error: error.message });
    }
};

export const getPatientById = async (req, res) => {
    const { id } = req.params;
    try {
        const patient = await query(`SELECT * FROM pacientes WHERE id_paciente = ?`, [id]);
        if (patient.length > 0) {
            res.json(patient[0]); 
        } else {
            res.status(404).json({ text: "Paciente no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ text: "Error al obtener el paciente", error: error.message });
    }
};

export const createPatient = async (req, res) => {
    const { nombre, apellido, fecha_nacimiento, email, telefono } = req.body
    const formattedFechaNacimiento = new Date(fecha_nacimiento).toISOString().split('T')[0];

    try {
        const result = await query(
            `INSERT INTO pacientes (nombre, apellido, fecha_nacimiento, email, telefono, fecha_registro, updated_at) 
             VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
            [nombre, apellido, formattedFechaNacimiento, email, telefono]
        );
        res.status(201).json({ message: 'Paciente creado exitosamente', id_paciente: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el paciente', error: error.message });
    }
}

export const updatePatient = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, fecha_nacimiento, email, telefono } = req.body;

    if (!id || !nombre || !apellido || !fecha_nacimiento || !email || !telefono) {
        return res.status(400).json({ text: "Todos los campos son requeridos" });
    }
   const formattedFechaNacimiento = new Date(fecha_nacimiento).toISOString().split('T')[0];

    try {
        const patientExists = await query(`SELECT 1 FROM pacientes WHERE id_paciente = ?`, [id]);
        if (patientExists.length === 0) {
            return res.status(404).json({ text: "Paciente no encontrado" });
        }

        const result = await query(
            `UPDATE pacientes 
             SET nombre = ?, apellido = ?, fecha_nacimiento = ?, email = ?, telefono = ?, updated_at = NOW() 
             WHERE id_paciente = ?`,
            [nombre, apellido, formattedFechaNacimiento, email, telefono, id]
        );

        if (result.affectedRows > 0) {
            res.json({ message: 'Paciente actualizado exitosamente' });
        } else {
            res.status(404).json({ text: "Paciente no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ text: "Error al actualizar el paciente", error: error.message });
    }
};

export const deletePatient = async (req, res) => {
    const { id } = req.params; 
    try {
        const patientExists = await query(`SELECT 1 FROM pacientes WHERE id_paciente = ?`, [id]);
        if (patientExists.length === 0) {
            return res.status(404).json({ text: "Paciente no encontrado" });
        }

        const result = await query(`DELETE FROM pacientes WHERE id_paciente = ?`, [id]);
        if (result.affectedRows > 0) {
            res.json({ message: 'Paciente eliminado exitosamente' });
        } else {
            res.status(404).json({ text: "Paciente no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ text: "Error al eliminar el paciente", error: error.message });
    }
};
