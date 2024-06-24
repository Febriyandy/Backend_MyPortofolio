const express = require("express");
const {
    getSertifikat,
    getSertifikatById,
    createSertifikat,
    updateSertifikat,
    deleteSertifikat,
} = require("../controllers/Sertifikat.js");
const { verifyToken } = require ("../middleware/VerifyToken.js");

const router = express.Router();

router.get('/sertifikat', getSertifikat);
router.get('/sertifikat/:id', getSertifikatById);
router.post('/tambahsertifikat',verifyToken, createSertifikat);
router.patch('/updatesertifikat/:id',verifyToken, updateSertifikat);
router.delete('/deletesertifikat/:id',verifyToken, deleteSertifikat);

module.exports = router;