const db = require("../config/db");
const { validationResult } = require("express-validator");

const isAuthorized = async (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Token tidak ditemukan" });

  const [result] = await db.query("SELECT * FROM admin_token WHERE token = ?", [
    token
  ]);
  if (result.length === 0)
    return res.status(401).json({ message: "Token tidak valid" });

  return true;
};

const generateNIP = async () => {
  const year = new Date().getFullYear();
  const [rows] = await db.query(
    `SELECT COUNT(*) as count FROM karyawan WHERE nip LIKE '${year}%'`
  );
  const counter = String(rows[0].count + 1).padStart(4, "0");
  return `${year}${counter}`;
};

exports.createKaryawan = async (req, res) => {
  try {
    const auth = await isAuthorized(req, res);
    if (auth !== true) return;

    const { nama, alamat, tgl_lahir, gender, photo } = req.body;

    if (!nama || !alamat || !tgl_lahir || !gender || !photo) {
      return res.status(400).json({ message: "Field tidak boleh kosong" });
    }

    const nip = await generateNIP();

    await db.query(
      `INSERT INTO karyawan (nip, nama, alamat, tgl_lahir, gender, photo, status)
         VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [nip, nama, alamat, tgl_lahir, gender, photo]
    );

    res.json({ message: "Karyawan berhasil ditambahkan", nip });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

exports.getKaryawan = async (req, res) => {
  try {
    const auth = await isAuthorized(req, res);
    if (auth !== true) return;

    const { keyword = "", start = 0, count = 10 } = req.query;
    const keywordFilter = `%${keyword}%`;

    const [
      [{ total }]
    ] = await db.query(
      `SELECT COUNT(*) AS total FROM karyawan WHERE nama LIKE ?`,
      [keywordFilter]
    );

    const [rows] = await db.query(
      `SELECT * FROM karyawan 
         WHERE nama LIKE ?
         LIMIT ?, ?`,
      [keywordFilter, parseInt(start), parseInt(count)]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    res.json({
      data: rows,
      pagination: {
        totalData: total,
        start: parseInt(start),
        count: parseInt(count),
        currentPage: Math.floor(start / count) + 1,
        totalPages: Math.ceil(total / count)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

exports.updateKaryawan = async (req, res) => {
  try {
    const auth = await isAuthorized(req, res);
    if (auth !== true) return;

    const { nip } = req.params;
    const { nama, alamat, tgl_lahir, gender, photo } = req.body;

    if (!nip || !nama || !alamat || !tgl_lahir || !gender) {
      return res.status(400).json({ message: "Field tidak boleh kosong" });
    }

    let query = `UPDATE karyawan SET nama = ?, alamat = ?, tgl_lahir = ?, gender = ?`;
    const values = [nama, alamat, tgl_lahir, gender];

    if (photo) {
      query += `, photo = ?`;
      values.push(photo);
    }

    query += ` WHERE nip = ?`;
    values.push(nip);

    await db.query(query, values);

    res.json({ message: "Karyawan berhasil diupdate" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengupdate data" });
  }
};

exports.deactivateKaryawan = async (req, res) => {
  try {
    const auth = await isAuthorized(req, res);
    if (auth !== true) return;

    const { nip } = req.params;
    if (!nip) return res.status(400).json({ message: "NIP harus diisi" });

    await db.query(`UPDATE karyawan SET status = 9 WHERE nip = ?`, [nip]);

    res.json({ message: "Karyawan berhasil dinonaktifkan" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menonaktifkan karyawan" });
  }
};
