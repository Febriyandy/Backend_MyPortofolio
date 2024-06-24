const express = require("express");
const {
    getArtikel,
    getArtikelById,
    createArtikel,
    updateArtikel,
    deleteArtikel
} = require("../controllers/Artikel.js");
const { verifyToken } = require ("../middleware/VerifyToken.js");

const router = express.Router();

router.get('/artikel', getArtikel);
router.get('/artikel/:id', getArtikelById);
router.post('/tambahartikel',verifyToken, createArtikel);
router.patch('/updateartikel/:id',verifyToken, updateArtikel);
router.delete('/deleteartikel/:id',verifyToken, deleteArtikel);

module.exports = router;