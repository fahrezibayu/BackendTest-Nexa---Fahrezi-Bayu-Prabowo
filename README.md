# BackendTest Nexa - Fahrezi

## Deskripsi
BackendTest Nexa

## Struktur Project
- ExpressJS + MySQL
- JWT Authentication
- Photo disimpan dalam base64
- Stored Procedure & View
- Docker support


## Instalasi Lokal
```bash
npm install
npm run dev


## Problem Solve
- Jika ada kendala ketika create procedure bisa menggunakan ./mysql_upgrade di server apache mysql seperti xampp

## Tes API Gunakan Postman untuk:

- Login: POST /api/auth/login

- Tambah karyawan: POST /api/karyawan

- List karyawan: GET /api/karyawan

- Update karyawan: PUT /api/karyawan/:nip

- Nonaktifkan: PATCH /api/karyawan/:nip/deactivate

*Note* Jangan lupa merubah .env.example ke .env