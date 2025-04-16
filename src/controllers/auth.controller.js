const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const { encrypt } = require('../utils/crypto');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const encryptedPassword = encrypt(password);
  console.log('Username:', username);
    console.log('Password:', encryptedPassword);


  try {
    const [rows] = await pool.query(`SELECT * FROM admin WHERE username = ? AND password = ?`, [username, encryptedPassword]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await pool.query(`INSERT INTO admin_token (username, token, created_at) VALUES (?, ?, NOW())`, [username, token]);

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err });
  }
};
