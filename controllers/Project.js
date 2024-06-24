const Project = require("../models/ProjectModels.js");
const fs = require("fs");
const path = require("path");


exports.getProject = async (req, res) => {
    try {
        const response = await Project.findAll({
            attributes: ['id', 'name', 'deskripsi', 'bahasa_pemrograman', 'link_github', 'link_preview', 'link_foto']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

exports.getProjectById = async (req, res) => {
    try {
        const response = await Project.findOne({
            attributes: ['id', 'name', 'deskripsi', 'bahasa_pemrograman', 'link_github', 'link_preview', 'link_foto'],
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}
exports.createProject = async (req, res) => {
  const { name, deskripsi, bahasa_pemrograman, link_github, link_preview } = req.body;

  try {
    let link_foto = "";
    let nama_foto = "";

    if (req.files && req.files.foto) {
      const foto = Array.isArray(req.files.foto) ? req.files.foto[0] : req.files.foto;
      nama_foto = foto.md5 + path.extname(foto.name);
      link_foto = `${req.protocol}://${req.get('host')}/project/${nama_foto}`;

      // Ensure the directory exists
      const uploadPath = path.join(__dirname, '../public/project', nama_foto);
      
      // Move the uploaded file
      await foto.mv(uploadPath);
    }

    await Project.create({
      name: name,
      deskripsi: deskripsi,
      bahasa_pemrograman: JSON.stringify(bahasa_pemrograman),
      link_github : link_github,
      link_preview: link_preview,
      link_foto: link_foto,
      nama_foto: nama_foto,
    });

    res.status(201).json({ msg: "Project berhasil disimpan" });
  } catch (error) {
    console.error("Error in simpan Project:", error);
    res.status(400).json({ msg: "Gagal melakukan simpan Project", error: error.message });
  }
};

exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { name, deskripsi, bahasa_pemrograman, link_github, link_preview } = req.body;

  try {
    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({ msg: "Project tidak ditemukan" });
    }

    let link_foto = project.link_foto;
    let nama_foto = project.nama_foto;

    if (req.files && req.files.foto) {
      const foto = Array.isArray(req.files.foto) ? req.files.foto[0] : req.files.foto;
      nama_foto = foto.md5 + path.extname(foto.name);
      link_foto = `${req.protocol}://${req.get('host')}/project/${nama_foto}`;

      const uploadPath = path.join(__dirname, '../public/project', nama_foto);

      // Hapus file lama jika ada
      if (project.nama_foto) {
        const oldFilePath = path.join(__dirname, '../public/project', project.nama_foto);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // Pindahkan file yang diunggah baru
      await foto.mv(uploadPath);
    }

    // Perbarui data proyek dengan kondisi where berdasarkan ID
    await Project.update({
      name: name,
      deskripsi: deskripsi,
      bahasa_pemrograman: bahasa_pemrograman ? JSON.stringify(bahasa_pemrograman) : null,
      link_github : link_github,
      link_preview: link_preview,
      link_foto: link_foto,
      nama_foto: nama_foto,
    }, {
      where: { id: id } // Menentukan kondisi pembaruan berdasarkan ID proyek
    });

    res.status(200).json({ msg: "Project berhasil diperbarui" });
  } catch (error) {
    console.error("Error in update Project:", error);
    res.status(400).json({ msg: "Gagal memperbarui Project", error: error.message });
  }
};


exports.deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({ msg: "Proyek tidak ditemukan" });
    }

    // Hapus foto terkait jika ada
    if (project.nama_foto) {
      const oldFilePath = path.join(__dirname, '../public/project', project.nama_foto);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Hapus proyek dari database dengan memberikan kondisi berdasarkan ID
    await Project.destroy({
      where: { id: id }
    });

    res.status(200).json({ msg: "Proyek berhasil dihapus" });
  } catch (error) {
    console.error("Error in delete Project:", error);
    res.status(400).json({ msg: "Gagal menghapus Proyek", error: error.message });
  }
};

