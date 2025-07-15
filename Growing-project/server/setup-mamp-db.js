const mysql = require("mysql/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function setupDatabase() {
  //Baca file sql
  const sqlFilePath = path.join(__dirname, "database.sql");
  const sqlScript = fs.readFileSync(sqlFilePath, "utf8");

  //Memisahkan perintah sql
  const sqlCommands = sqlScript
    .replace(/(\r|n\n|n\r)/gm, " ")
    .replace(/\s+/g, " ")
    .split(";")
    .map((command) => command.trim())
    .filter((command) => command);

  //Koneksi ke Mysql tanpa database
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 8889,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true,
    });

    console.log("Koneksi ke MySQL berhasil");

    //Membuat database jika belum ada
    console.log(`Membuat database ${process.env.DB_NAME} jika belum ada...`);
    await connection.query(
      `CREATE DATABASE IF NOT EXIST ${process.env.DB_NAME}`
    );

    //Menggunakan database
    console.log(`Menggunakan database ${process.env.DB_NAME}...`);
    await connection.query(`USE ${process.env.DB_NAME}`);

    //Menjalankan perintah SQL
    console.log("Membuat tabel dan memasukkan data awal...");
    for (const command of sqlCommands) {
      if (command) {
        try {
          await connection.query(command);
        } catch (err) {
          console.error(`Error menjalankan perintah SQL: ${command}`);
          console.error(err);
        }
      }
    }

    console.log("Setup database selesai!");
    console.log(
      `Database ${process.env.DB_NAME} berhasil dibuat dan diisi dengan tabel dan data awal.`
    );
  } catch (error) {
    console.error("Error dalam setup database:", error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
