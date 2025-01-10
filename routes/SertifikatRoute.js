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
router.post('/tambahsertifikat', createSertifikat);
router.patch('/updatesertifikat/:id', updateSertifikat);
router.delete('/deletesertifikat/:id', deleteSertifikat);

module.exports = router;