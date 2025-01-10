const express = require("express");
const{
    createUser,
    Login,
    Logout,
    updateUsers,
    getUsers,
    getUsersById
} = require  ("../controllers/Users.js");
const { verifyToken } = require ("../middleware/VerifyToken.js");
const  { refreshToken } = require  ("../controllers/RefreshToken.js");
const router = express.Router();


router.post('/register', createUser);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);
router.patch('/users/:id', updateUsers);
router.get('/users', getUsers);
router.get('/users/:id', getUsersById);



module.exports = router;