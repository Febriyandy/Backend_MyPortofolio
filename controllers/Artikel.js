const Artikel = require("../models/ArtikelModel.js");
const fs = require("fs");
const path = require("path");


exports.getArtikel = async (req, res) => {
    try {
        const response = await Artikel.findAll({
            attributes: ['id', 'judul', 'tanggal', 'isi', 'kategori', 'link_foto']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

exports.getArtikelById = async (req, res) => {
    try {
        const response = await Artikel.findOne({
            attributes: ['id', 'judul', 'tanggal', 'isi', 'kategori', 'link_foto'],
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}
exports.createArtikel = async (req, res) => {
  const {  judul, tanggal, isi, kategori} = req.body;

  try {
    let link_foto = "";
    let nama_foto = "";

    if (req.files && req.files.foto) {
      const foto = Array.isArray(req.files.foto) ? req.files.foto[0] : req.files.foto;
      nama_foto = foto.md5 + path.extname(foto.name);
      link_foto = `${req.protocol}://${req.get('host')}/artikel/${nama_foto}`;

      // Ensure the directory exists
      const uploadPath = path.join(__dirname, '../public/artikel', nama_foto);
      
      // Move the uploaded file
      await foto.mv(uploadPath);
    }

    await Artikel.create({
      judul: judul,
      tanggal: tanggal,
      isi: JSON.stringify(isi),
      kategori : kategori,
      link_foto: link_foto,
      nama_foto: nama_foto,
    });

    res.status(201).json({ msg: "Artikel berhasil disimpan" });
  } catch (error) {
    console.error("Error in simpan Artikel:", error);
    res.status(400).json({ msg: "Gagal melakukan simpan Artikel", error: error.message });
  }
};

exports.updateArtikel = async (req, res) => {
  const { id } = req.params;
  const { judul, tanggal, isi, kategori} = req.body;

  try {
    const artikel = await Artikel.findByPk(id);

    if (!artikel) {
      return res.status(404).json({ msg: "artikel tidak ditemukan" });
    }

    let link_foto = artikel.link_foto;
    let nama_foto = artikel.nama_foto;

    if (req.files && req.files.foto) {
      const foto = Array.isArray(req.files.foto) ? req.files.foto[0] : req.files.foto;
      nama_foto = foto.md5 + path.extname(foto.name);
      link_foto = `${req.protocol}://${req.get('host')}/artikel/${nama_foto}`;

      const uploadPath = path.join(__dirname, '../public/artikel', nama_foto);

      // Hapus file lama jika ada
      if (artikel.nama_foto) {
        const oldFilePath = path.join(__dirname, '../public/artikel', artikel.nama_foto);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // Pindahkan file yang diunggah baru
      await foto.mv(uploadPath);
    }

    // Perbarui data proyek dengan kondisi where berdasarkan ID
    await Artikel.update({
      judul: judul,
      tanggal: tanggal,
      isi: isi ? JSON.stringify(isi) : null,
      kategori : kategori,
      link_foto: link_foto,
      nama_foto: nama_foto,
    }, {
      where: { id: id } // Menentukan kondisi pembaruan berdasarkan ID proyek
    });

    res.status(200).json({ msg: "Artikel berhasil diperbarui" });
  } catch (error) {
    console.error("Error in update Artikel:", error);
    res.status(400).json({ msg: "Gagal memperbarui Artikel", error: error.message });
  }
};


exports.deleteArtikel = async (req, res) => {
  const { id } = req.params;

  try {
    const artikel = await Artikel.findByPk(id);

    if (!artikel) {
      return res.status(404).json({ msg: "Artikel tidak ditemukan" });
    }

    // Hapus foto terkait jika ada
    if (artikel.nama_foto) {
      const oldFilePath = path.join(__dirname, '../public/artikel', artikel.nama_foto);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Hapus Artikel dari database dengan memberikan kondisi berdasarkan ID
    await Artikel.destroy({
      where: { id: id }
    });

    res.status(200).json({ msg: "Artikel berhasil dihapus" });
  } catch (error) {
    console.error("Error in delete artikel:", error);
    res.status(400).json({ msg: "Gagal menghapus Artikel", error: error.message });
  }
};

