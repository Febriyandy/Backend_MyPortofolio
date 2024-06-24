const express = require("express");
const {
    getKontak,
    createKontak,
    deleteKontak,
    getKontakById
} = require ("../controllers/Kontak.js");
const { verifyToken } = require ("../middleware/VerifyToken.js");

const router = express.Router();

router.get('/kontak', verifyToken, getKontak);
router.get('/kontak/:id',verifyToken, getKontakById);
router.post('/kontak', createKontak);
router.delete('/kontak/:id',verifyToken, deleteKontak);

module.exports = router;