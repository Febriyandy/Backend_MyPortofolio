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
router.post('/tambahartikel', createArtikel);
router.patch('/updateartikel/:id', updateArtikel);
router.delete('/deleteartikel/:id', deleteArtikel);

module.exports = router;