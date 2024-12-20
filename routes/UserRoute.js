const express = require("express");
const{
    createUser,
    Login,
    Logout,
} = require  ("../controllers/Users.js");
const  { refreshToken } = require  ("../controllers/RefreshToken.js");
const router = express.Router();


router.post('/register', createUser);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);



module.exports = router;