# Growing-
Aplikasi Catatan dan Pengembangan Diri
Aplikasi berbasis web untuk mencatat dan mengelola pembelajaran mandiri dengan visualisasi progres.
📋 Deskripsi
Aplikasi "Catatan dan Pengembangan Diri" adalah solusi untuk individu yang belajar secara mandiri, membantu mereka melacak materi yang sudah dipelajari, merefleksikan pembelajaran, dan memantau kemajuan yang dicapai. Aplikasi ini mendukung kategorisasi catatan, memungkinkan pengguna menyaring berdasarkan kategori dan tanggal, serta menampilkan visualisasi progres pembelajaran.

🌟 Fitur Utama

Autentikasi Pengguna: Register dan login untuk pengalaman personal
Manajemen Catatan: Tambah, edit, hapus, dan arsip catatan pembelajaran
Kategorisasi: Kelompokkan catatan berdasarkan kategori (Coding, Bahasa, Life Skills, dll)
Filter: Filter catatan berdasarkan kategori dan tanggal
Dark/Light Mode: Toggle antara tema gelap dan terang
Visualisasi Progres: Dashboard dengan chart untuk memantau perkembangan belajar
UI Modern: Desain liquid glass/glassmorphism dengan animasi smooth

🛠️ Teknologi
Frontend

React 18 dengan Vite
Vanilla CSS (tanpa framework)
Chart.js untuk visualisasi data
React Router untuk navigasi
Context API untuk state management

Backend

Express.js
MySQL dengan mysql2
JWT untuk autentikasi
RESTful API

🔧 Instalasi dan Setup
Prasyarat

Node.js (v14 atau lebih baru)
MySQL
npm atau yarn

Langkah Instalasi

Clone repository
bashgit clone https://github.com/username/Growing.git
cd aplikasi-catatan

import database.sql

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

Setup Backend
bashcd server

# Install dependencies
npm install

# Buat file .env
echo "PORT=8888
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=learning_notes_db
JWT_SECRET=your_secret_key" > .env

# Jalankan server
npm run dev

Setup Frontend
bashcd ../client

# Install dependencies
npm install

# Buat file .env
echo "VITE_API_URL=http://localhost:8888/api" > .env

# Jalankan aplikasi frontend
npm run dev

Akses Aplikasi
Buka browser dan akses http://localhost:5173

👥 Tim Pengembang

(B25B6R020) - Adrianza Ihsan Nurohman
(B25B6R067) - Nawal Alhamid
(B25B6R023) - Firmanda Arbito Sena Brata
(B25B6R055) - Nazwa Sulistiyawati

 Lisensi
Dibuat untuk keperluan Capstone Project Dicoding Bootcamp.
