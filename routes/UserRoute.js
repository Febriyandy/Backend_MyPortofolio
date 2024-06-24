const express = require("express");
const{
    createUser,
    Login,
} = require  ("../controllers/Users.js");
const { verifyToken } = require ("../middleware/VerifyToken.js");
const  { refreshToken } = require  ("../controllers/RefreshToken.js");
const router = express.Router();


router.post('/register', createUser);
router.post('/login', Login);
router.get('/token', verifyToken, refreshToken);


module.exports = router;