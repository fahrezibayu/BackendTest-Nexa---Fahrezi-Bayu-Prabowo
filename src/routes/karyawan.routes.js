const express = require('express');
const router = express.Router();
const karyawanController = require('../controllers/karyawan.controller');

router.post('/', karyawanController.createKaryawan);

router.get('/', karyawanController.getKaryawan);

router.put('/:nip', karyawanController.updateKaryawan);

router.patch('/:nip/nonaktif', karyawanController.deactivateKaryawan);

module.exports = router;
