import mysql from 'mysql2';

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'agendaAdmin',
    password: 'agenda2024',
    database: 'agendapsicologo'
});

export const connectDB = () => {
    connection.connect((err) => {
        if (err) {
            console.error('Error conectándose a MySQL:', err.stack);
            return;
        }
        console.log('Conectado a MySQL con ID de conexión:', connection.threadId);
    });
};

export const query = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, params, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  };
  


export default connection;
