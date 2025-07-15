const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 8889,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  socketPath: process.env.SOCKET_PATH,
});

//Test the connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Database connection successful");
    console.log(`Connected to MySQL on port ${process.env.DB_PORT || 8889}`);
    connection.release();
  } catch (error) {
    console.error("Database connection failed:", error);
    console.error(`
            Failed to connect to MySQL with these settings:
            - HOST: ${process.env.DB_HOST}
            - PORT: ${process.env.DB_PORT || 8889}
            - User: ${process.env.DB_USER}
            - Database: ${process.env.Db_NAME}
            - Socket Path: ${process.env.SOCKET_PATH || "Not specified"}
                Please check your MAMP settings and make sure MySQL is running.
                `);
    process.exit(1);
  }
}

testConnection();

module.exports = pool;
