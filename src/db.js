import mysql from 'mysql2';




// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'agendaAdmin',
//     password: 'agenda2024',
//     database: 'agendapsicologo'
// });

// export const connectDB = () => {
//     connection.connect((err) => {
//         if (err) {
//             console.error('Error conectándose a MySQL:', err.stack);
//             return;
//         }
//         console.log('Conectado a MySQL con ID de conexión:', connection.threadId);
//     });
// };

// export const query = (sql, params = []) => {
//     return new Promise((resolve, reject) => {
//       connection.query(sql, params, (err, results) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(results);
//         }
//       });
//     });
//   };
  
import mysql from 'mysql2/promise';

// Crear un pool de conexiones
const pool = mysql.createPool({
    host: 'localhost',
    user: 'agendaAdmin',
    password: 'agenda2024',
    database: 'agendapsicologo',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const query = async (sql, params = []) => {
    const connection = await pool.getConnection(); // Obtener una conexión del pool
    try {
        const [results] = await connection.execute(sql, params); // Ejecutar la consulta
        return results;
    } catch (err) {
        throw err;
    } finally {
        connection.release(); // Liberar la conexión de vuelta al pool
    }
};


export default connection;
