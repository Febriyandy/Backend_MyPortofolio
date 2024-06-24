const express = require("express");
const {
    getProject,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
} = require("../controllers/Project.js");
const { verifyToken } = require ("../middleware/VerifyToken.js");

const router = express.Router();

router.get('/project', getProject);
router.get('/project/:id', getProjectById);
router.post('/tambahproject',verifyToken, createProject);
router.patch('/updateproject/:id', verifyToken, updateProject);
router.delete('/deleteproject/:id',verifyToken, deleteProject);

module.exports = router;