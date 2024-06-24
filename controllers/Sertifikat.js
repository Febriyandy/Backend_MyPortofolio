const Sertifikat = require("../models/SertifikatModel.js");
const fs = require("fs");
const path = require("path");


exports.getSertifikat = async (req, res) => {
    try {
        const response = await Sertifikat.findAll({
            attributes: ['id', 'name', 'perusahaan', 'tanggal_kegiatan', 'bagian', 'deskripsi', 'color', 'link_icon' ,'link_foto']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

exports.getSertifikatById = async (req, res) => {
    try {
        const response = await Sertifikat.findOne({
            attributes: ['id', 'name', 'perusahaan', 'tanggal_kegiatan', 'bagian', 'deskripsi', 'color', 'link_icon' ,'link_foto'],
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}
exports.createSertifikat = async (req, res) => {
  const { name, perusahaan, tanggal_kegiatan, bagian, deskripsi , color} = req.body;

  try {
    let link_icon = "";
    let nama_icon = "";

    if (req.files && req.files.icon) {
      const icon = Array.isArray(req.files.icon) ? req.files.icon[0] : req.files.icon;
      nama_icon = icon.md5 + path.extname(icon.name);
      link_icon = `${req.protocol}://${req.get('host')}/icon/${nama_icon}`;

      // Ensure the directory exists
      const uploadPath1 = path.join(__dirname, '../public/icon', nama_icon);
      
      // Move the uploaded file
      await icon.mv(uploadPath1);
    }

    let link_foto = "";
    let nama_foto = "";

    if (req.files && req.files.foto) {
      const foto = Array.isArray(req.files.foto) ? req.files.foto[0] : req.files.foto;
      nama_foto = foto.md5 + path.extname(foto.name);
      link_foto = `${req.protocol}://${req.get('host')}/sertifikat/${nama_foto}`;

      // Ensure the directory exists
      const uploadPath = path.join(__dirname, '../public/sertifikat', nama_foto);
      
      // Move the uploaded file
      await foto.mv(uploadPath);
    }

    await Sertifikat.create({
      name: name,
      perusahaan: perusahaan,
      tanggal_kegiatan: tanggal_kegiatan,
      bagian: bagian,
      deskripsi: JSON.stringify(deskripsi),
      color: color,
      link_icon : link_icon,
      nama_icon: nama_icon,
      link_foto: link_foto,
      nama_foto: nama_foto,
    });

    res.status(201).json({ msg: "Sertifikat berhasil disimpan" });
  } catch (error) {
    console.error("Error in simpan Sertifikat:", error);
    res.status(400).json({ msg: "Gagal melakukan simpan Sertifikat", error: error.message });
  }
};

exports.updateSertifikat = async (req, res) => {
  const { id } = req.params;
  const { name, perusahaan, tanggal_kegiatan, bagian, deskripsi, color } = req.body;

  try {
    const sertifikat = await Sertifikat.findByPk(id);

    if (!sertifikat) {
      return res.status(404).json({ msg: "Sertifikat tidak ditemukan" });
    }

    let link_icon = sertifikat.link_icon;
    let nama_icon = sertifikat.nama_icon;

    if (req.files && req.files.icon) {
      const icon = Array.isArray(req.files.icon) ? req.files.icon[0] : req.files.icon;
      nama_icon = icon.md5 + path.extname(icon.name);
      link_icon = `${req.protocol}://${req.get('host')}/icon/${nama_icon}`;

      const uploadPath1 = path.join(__dirname, '../public/icon', nama_icon);

      // Hapus file ikon lama jika ada
      if (sertifikat.nama_icon) {
        const oldIconPath = path.join(__dirname, '../public/icon', sertifikat.nama_icon);
        if (fs.existsSync(oldIconPath)) {
          fs.unlinkSync(oldIconPath);
        }
      }

      // Pindahkan file ikon yang baru diunggah
      await icon.mv(uploadPath1);
    }

    let link_foto = sertifikat.link_foto;
    let nama_foto = sertifikat.nama_foto;

    if (req.files && req.files.foto) {
      const foto = Array.isArray(req.files.foto) ? req.files.foto[0] : req.files.foto;
      nama_foto = foto.md5 + path.extname(foto.name);
      link_foto = `${req.protocol}://${req.get('host')}/sertifikat/${nama_foto}`;

      const uploadPath = path.join(__dirname, '../public/sertifikat', nama_foto);

      // Hapus file foto lama jika ada
      if (sertifikat.nama_foto) {
        const oldFotoPath = path.join(__dirname, '../public/sertifikat', sertifikat.nama_foto);
        if (fs.existsSync(oldFotoPath)) {
          fs.unlinkSync(oldFotoPath);
        }
      }

      // Pindahkan file foto yang baru diunggah
      await foto.mv(uploadPath);
    }

    // Perbarui data sertifikat dengan kondisi where berdasarkan ID
    await Sertifikat.update({
      name: name,
      perusahaan: perusahaan,
      tanggal_kegiatan: tanggal_kegiatan,
      bagian: bagian,
      deskripsi: deskripsi ? JSON.stringify(deskripsi) : null,
      color: color,
      link_icon : link_icon,
      nama_icon: nama_icon,
      link_foto: link_foto,
      nama_foto: nama_foto,
    }, {
      where: { id: id }
    });

    res.status(200).json({ msg: "Sertifikat berhasil diperbarui" });
  } catch (error) {
    console.error("Error in update Sertifikat:", error);
    res.status(400).json({ msg: "Gagal memperbarui Sertifikat", error: error.message });
  }
};



exports.deleteSertifikat = async (req, res) => {
  const { id } = req.params;

  try {
    const sertifikat = await Sertifikat.findByPk(id);

    if (!sertifikat) {
      return res.status(404).json({ msg: "Sertifikat tidak ditemukan" });
    }

    // Hapus file ikon terkait jika ada
    if (sertifikat.nama_icon) {
      const oldIconPath = path.join(__dirname, '../public/icon', sertifikat.nama_icon);
      if (fs.existsSync(oldIconPath)) {
        fs.unlinkSync(oldIconPath);
      }
    }

    // Hapus file foto terkait jika ada
    if (sertifikat.nama_foto) {
      const oldFotoPath = path.join(__dirname, '../public/sertifikat', sertifikat.nama_foto);
      if (fs.existsSync(oldFotoPath)) {
        fs.unlinkSync(oldFotoPath);
      }
    }

    // Hapus sertifikat dari database
    await Sertifikat.destroy({
      where: { id: id }
    });

    res.status(200).json({ msg: "Sertifikat berhasil dihapus" });
  } catch (error) {
    console.error("Error in delete Sertifikat:", error);
    res.status(400).json({ msg: "Gagal menghapus Sertifikat", error: error.message });
  }
};


