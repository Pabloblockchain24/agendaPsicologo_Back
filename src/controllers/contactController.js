import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: "sanarmental@gmail.com",
        pass: "hmhf abba hhqb estf"
    }
})

export const sendContactMail = async (req, res) => {
    const { nombre, correo, telefono, asunto, mensaje } = req.body

    const mailOptions = {
        from: "AgendaPsicologo Contacto <sanarmental@gmail.com>",
        to: "sanarmental@gmail.com",
        subject: `${asunto}`,
        html: `
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 30px;
                        border-radius: 8px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    p {
                        margin-bottom: 15px;
                        line-height: 1.6;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1> ¡ Tienes una nueva solicitud de contacto !  </h1>
                    <p>Nombre Completo: ${nombre}</p>
                    <p>Correo: ${correo}</p>
                    <p>Teléfono: ${telefono}</p>
                    <p>Asunto: ${asunto}</p>
                    <p>Mensaje: ${mensaje}</p>
                </div>
            </body>
        </html>`
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.send("Error al enviar correo")
        } else {
            res.send(`Correo enviado`)
        }
    })
}