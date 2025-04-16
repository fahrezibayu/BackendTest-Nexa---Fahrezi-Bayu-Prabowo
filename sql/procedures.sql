DELIMITER //
CREATE PROCEDURE sp_add_kary_fahrezi (
  IN p_nip VARCHAR(20),
  IN p_nama VARCHAR(100),
  IN p_alamat TEXT,
  IN p_gender ENUM('L', 'P'),
  IN p_tgl_lahir DATE,
  IN p_photo LONGTEXT
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    INSERT INTO log_trx_api (endpoint, nip, success, message) 
    VALUES ('/api/karyawan', p_nip, 0, 'NIP already exists or error inserting');
  END;

  START TRANSACTION;
    IF EXISTS (SELECT 1 FROM karyawan WHERE nip = p_nip) THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'NIP already exists';
    ELSE
      INSERT INTO karyawan (nip, nama, alamat, gender, tgl_lahir, photo) 
      VALUES (p_nip, p_nama, p_alamat, p_gender, p_tgl_lahir, p_photo);

      INSERT INTO log_trx_api (endpoint, nip, success, message)
      VALUES ('/api/karyawan', p_nip, 1, 'Karyawan inserted successfully');
    END IF;
  COMMIT;
END;
//
DELIMITER ;