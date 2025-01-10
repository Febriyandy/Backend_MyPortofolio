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
router.post('/tambahproject', createProject);
router.patch('/updateproject/:id',  updateProject);
router.delete('/deleteproject/:id', deleteProject);

module.exports = router;