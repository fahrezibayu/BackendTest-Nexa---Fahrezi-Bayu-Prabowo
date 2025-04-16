require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.routes');
const karyawanRoutes = require('./routes/karyawan.routes');

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/karyawan', karyawanRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
