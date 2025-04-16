CREATE OR REPLACE VIEW karyawan_fahrezi AS
SELECT 
  ROW_NUMBER() OVER (ORDER BY id) AS No,
  nip,
  nama,
  alamat,
  CASE 
    WHEN gender = 'L' THEN 'Laki - Laki'
    WHEN gender = 'P' THEN 'Perempuan'
  END AS Gend,
  DATE_FORMAT(tgl_lahir, '%d %M %Y') AS `Tanggal Lahir`
FROM karyawan
WHERE status = 1;