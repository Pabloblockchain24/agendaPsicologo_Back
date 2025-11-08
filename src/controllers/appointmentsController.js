import { query } from "../db.js";
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: "sanarmental@gmail.com",
        pass: "hmhf abba hhqb estf"
    }
})

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
};

export const createAppointment = async (req, res) => {
    const { rut_paciente, id_psicologo, fecha, hora } = req.body

    if (!rut_paciente || !id_psicologo || !fecha || !hora) {
        return res.status(400).json({ Error: "Todos los campos son requeridos" });
    }

    try {
        const result = await query(
            `INSERT INTO sesiones (rut_paciente, id_psicologo, fecha, hora, estado, observaciones, created_at, updated_at) 
             VALUES (?, ?, ?, ?, 'pendiente', ' ', NOW(), NOW())`,
            [rut_paciente, id_psicologo, fecha, hora]
        );
        res.status(201).json({ message: 'Sesion creada exitosamente', id_sesion: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la sesión', error: error.message });
    }
};

export const updateAppointment = async (req, res) => {
    const { id } = req.params;
    const { id_paciente, id_psicologo, fecha, hora, estado, observaciones } = req.body

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
            [id_paciente, id_psicologo, fecha, hora, estado, observaciones, id]
        );

        if (result.affectedRows > 0) {
            res.json({ message: 'Sesión actualizada exitosamente' });
        } else {
            res.status(404).json({ text: "Sesión no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ text: "Error al actualizar la sesión", error: error.message });
    }

};

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
};

export const confirmationAppointmentMail = async (req, res) => {
    const { citaData } = req.body;
    const { especialidad, fecha, hora, rut_paciente, nombrePsicologo, correoPaciente, id_appointment } = citaData;

    const mailOptions = {
        from: "SanarMental <confirmaciones@sanarmental.cl>",
        to: `${correoPaciente}`, 
        subject: "Confirmación de Cita - SanarMental",
        html: `
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                        background-color: #eaf6f9;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 30px;
                        border-radius: 8px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        background-color: #f9f9f9;
                        border: 1px solid #d1ecf1;
                    }
                    h1 {
                        color: #2c3e50;
                        text-align: left;
                    }
                    p {
                        margin-bottom: 15px;
                        line-height: 1.6;
                        font-weight: normal;
                        color: #2c3e50;
                        text-align: left;
                    }
                    .highlight {
                        font-weight: bold;
                        color: #16a085;
                    }
                    .card {
                        background-color: #d1ecf1;
                        padding: 20px;
                        border-radius: 8px;
                        margin-bottom: 20px;
                        text-align: left;
                    }
                    .button {
                        background-color: #ffffff;
                        border: 1px solid #4da6ff;
                        color: #4da6ff;
                        padding: 10px 20px;
                        text-align: center;
                        border-radius: 5px;
                        text-decoration: none;
                        display: inline-block;
                        margin-top: 20px;
                    }
                    .button:hover {
                        background-color: #e8effd;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>¡Confirmación de Cita!</h1>
                    <p>Estimado(a)</p>
                    <p>Tu cita en SanarMental ha sido confirmada. A continuación, te proporcionamos los detalles:</p>
                    <div class="card">
                        <p><span class="highlight">Especialidad:</span> ${especialidad}</p>
                        <p><span class="highlight">Psicólogo:</span> ${nombrePsicologo}</p>
                        <p><span class="highlight">Fecha:</span> ${fecha}</p>
                        <p><span class="highlight">Hora:</span> ${hora}</p>
                        <p><span class="highlight">RUT del Paciente:</span> ${rut_paciente}</p>
                    </div>
                    <p>Si necesitas modificar o cancelar tu cita, por favor hazlo con anticipación en el siguiente enlace.</p>
                    <a href="https://sanarmental.cl/confirmarHora/${id_appointment}" class="button">Cancelar Cita</a>
                    <p>Gracias por confiar en nosotros.</p>
                    <p>Saludos cordiales,<br>El equipo de SanarMental</p>
                </div>
            </body>
        </html>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.send("Error al enviar correo");
        } else {
            res.send(`Correo enviado`);
        }
    });
};

