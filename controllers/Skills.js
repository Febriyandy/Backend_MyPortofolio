const Skills = require("../models/SkillsModel.js");
const fs = require("fs");
const path = require("path");

exports.Home = async (req, res) => {
    res.send('Welcome to Portofolio server!');
}

exports.getSkill = async (req, res) => {
    try {
        const response = await Skills.findAll({
            attributes: ['id', 'name', 'level', 'category', 'link_foto']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

exports.getSkillById = async (req, res) => {
    try {
        const response = await Skills.findOne({
            attributes: ['id', 'name', 'level', 'category', 'link_foto'],
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}
exports.createSkill = async (req, res) => {
  const { name, level, category } = req.body;

  try {
    let link_foto = "";
    let nama_foto = "";

    if (req.files && req.files.foto) {
      const foto = Array.isArray(req.files.foto) ? req.files.foto[0] : req.files.foto;
      nama_foto = foto.md5 + path.extname(foto.name);
      link_foto = `${req.protocol}://${req.get('host')}/skills/${nama_foto}`;

      // Ensure the directory exists
      const uploadPath = path.join(__dirname, '../public/skills', nama_foto);
      
      // Move the uploaded file
      await foto.mv(uploadPath);
    }

    await Skills.create({
      name: name,
      level: level,
      category: category,
      link_foto: link_foto,
      nama_foto: nama_foto,
    });

    res.status(201).json({ msg: "Skills berhasil disimpan" });
  } catch (error) {
    console.error("Error in simpan Skills:", error);
    res.status(400).json({ msg: "Gagal melakukan simpan Skills", error: error.message });
  }
};

exports.updateSkill = async (req, res) => {
  const { id } = req.params;
  const { name, level, category } = req.body;

  try {
    const skill = await Skills.findByPk(id);

    if (!skill) {
      return res.status(404).json({ msg: "Skill tidak ditemukan" });
    }

    let link_foto = skill.link_foto;
    let nama_foto = skill.nama_foto;

    if (req.files && req.files.foto) {
      const foto = Array.isArray(req.files.foto) ? req.files.foto[0] : req.files.foto;
      nama_foto = foto.md5 + path.extname(foto.name);
      link_foto = `${req.protocol}://${req.get('host')}/skills/${nama_foto}`;

      const uploadPath = path.join(__dirname, '../public/skills', nama_foto);

      // Delete the old file if it exists
      if (skill.nama_foto) {
        const oldFilePath = path.join(__dirname, '../public/skills', skill.nama_foto);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // Move the new uploaded file
      await foto.mv(uploadPath);
    }

    await skill.update({
      name: name,
      level: level,
      category: category,
      link_foto: link_foto,
      nama_foto: nama_foto,
    });

    res.status(200).json({ msg: "Skill berhasil diperbarui" });
  } catch (error) {
    console.error("Error in update Skill:", error);
    res.status(400).json({ msg: "Gagal memperbarui Skill", error: error.message });
  }
};

exports.deleteSkill = async (req, res) => {
    const { id } = req.params;
  
    try {
      const skill = await Skills.findByPk(id);
  
      if (!skill) {
        return res.status(404).json({ msg: "Skill tidak ditemukan" });
      }
  
      // Delete the associated photo if it exists
      if (skill.nama_foto) {
        const oldFilePath = path.join(__dirname, '../public/skills', skill.nama_foto);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
  
      // Delete the skill from the database
      await skill.destroy({
        where: { id: id }
      });
  
      res.status(200).json({ msg: "Skill berhasil dihapus" });
    } catch (error) {
      console.error("Error in delete Skill:", error);
      res.status(400).json({ msg: "Gagal menghapus Skill", error: error.message });
    }
  };
