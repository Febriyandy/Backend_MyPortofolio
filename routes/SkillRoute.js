const express = require("express");
const {
    Home,
    getSkill,
    getSkillById,
    createSkill,
    updateSkill,
    deleteSkill
} = require("../controllers/Skills.js");
const { verifyToken } = require ("../middleware/VerifyToken.js");

const router = express.Router();

router.get('/', Home);
router.get('/skill', getSkill);
router.get('/skill/:id', getSkillById);
router.post('/tambahskill',  createSkill);
router.patch('/updateskill/:id', updateSkill);
router.delete('/deleteskill/:id', deleteSkill);

module.exports = router;