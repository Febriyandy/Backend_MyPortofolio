const express = require("express");
const {
    getKontak,
    createKontak,
    deleteKontak,
    getKontakById
} = require ("../controllers/Kontak.js");
const { verifyToken } = require ("../middleware/VerifyToken.js");

const router = express.Router();

router.get('/kontak',  getKontak);
router.get('/kontak/:id', getKontakById);
router.post('/kontak', createKontak);
router.delete('/kontak/:id', deleteKontak);

module.exports = router;