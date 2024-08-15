/*Import dependencies*/
import bcrypt from "bcrypt"

/*Import DB connection*/
import { query } from "../db.js";

export const getPsicologos = async (req, res) => {
    try {
        const psicologos = await query('SELECT * FROM psicologos order by updated_at desc');
                res.json(psicologos);
    } catch (error) {
        res.status(500).json({ text: "Error al obtener los psicologos", error: error.message });
    }   
}

export const getPsicologoById = async (req, res) => {
    const { id } = req.params;
    try {
        const psicologo = await query(`SELECT * FROM psicologos WHERE id_psicologo = ?`, [id]);
        if (psicologo.length > 0) {
            res.json(psicologo[0]); 
        } else {
            res.status(404).json({ text: "Psicologo no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ text: "Error al obtener el psicologo", error: error.message });
    }
}

export const createPsicologo = async (req, res) => {
    const { nombre, apellido, email, telefono, especialidad, password } = req.body;
    
        if (!nombre || !apellido || !email || !telefono || !especialidad || !password ) {
        return res.status(400).json({ Error: "Todos los campos son requeridos" });
    }
    const hash = await bcrypt.hash(password, 10)
    try {
        const result = await query(
            `INSERT INTO psicologos (nombre, apellido, email, telefono, especialidad, created_at, updated_at, password) 
             VALUES (?, ?, ?, ?, ?, NOW(), NOW(), ?)`,
            [nombre, apellido, email, telefono, especialidad, hash ]
        );
        res.status(201).json({ message: 'Psicologo creado exitosamente', id_psicologo: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el psicologo', error: error.message });
    }
}

export const updatePsicologo = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, email, telefono, especialidad, password } = req.body;
    
    if (!nombre || !apellido || !email || !telefono || !especialidad || !password ) {
        return res.status(400).json({ Error: "Todos los campos son requeridos" });
    }
    const hash = await bcrypt.hash(password, 10)
    try {
        const psicologoExists = await query(`SELECT 1 FROM psicologos WHERE id_psicologo = ?`, [id]);
        if (psicologoExists.length === 0) {
            return res.status(404).json({ text: "Psicologo no encontrado" });
        }

        const result = await query(
            `UPDATE psicologos 
             SET nombre = ?, apellido = ?, email = ?, telefono = ?, especialidad = ?, updated_at = NOW(), password = ?  
             WHERE id_psicologo = ?`,
            [nombre, apellido, email, telefono, especialidad, hash , id]
        );

        if (result.affectedRows > 0) {
            res.json({ message: 'Psicólogo actualizado exitosamente' });
        } else {
            res.status(404).json({ text: "Psicólogo no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ text: "Error al actualizar la psicólogo", error: error.message });
    }
}

export const deletePsicologo = async (req, res) => {
    const { id } = req.params; 
    try {
        const psicologoExists = await query(`SELECT 1 FROM psicologos WHERE id_psicologo = ?`, [id]);
        if (psicologoExists.length === 0) {
            return res.status(404).json({ text: "Psicólogo no encontrado" });
        }

        const result = await query(`DELETE FROM psicologos WHERE id_psicologo = ?`, [id]);
        if (result.affectedRows > 0) {
            res.json({ message: 'Psicólogo eliminado exitosamente' });
        } else {
            res.status(404).json({ Error: "Psicólogo no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ text: "Error al eliminar la psicólogo", error: error.message });
    }
}
