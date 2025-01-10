const Users = require("../models/UserModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");


exports.createUser = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const existingUser = await Users.findOne({
            where: { username: username }
        });

        if (existingUser) {
            return res.status(400).json({ msg: "Username sudah terdaftar, silakan masuk." });
        }

        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        await Users.create({
            username: username,
            password: hashPassword,
        });

        res.status(201).json({ success: true, msg: "Register Berhasil" });
    } catch (error) {
        console.error("Error in createUser:", error);
        res.status(500).json({ msg: "Gagal melakukan registrasi", error: error.message });
    }
};

exports.Login = async (req, res) => {
    try {
        const { username, password } = req.body;
  
        const user = await Users.findOne({
            where: { username: username }
        });

        if (!user) {
            return res.status(400).json({ msg: "Username tidak ditemukan, silahkan daftar" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ msg: "Password Salah, harap coba lagi" });
        }

        const { id: userId } = user;
        const accessToken = jwt.sign(
            { userId },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '20s' }
        );

        const refreshToken = jwt.sign(
            { userId },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        await Users.update(
            { refresh_token: refreshToken },
            { where: { id: userId } }
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.json({ accessToken });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

exports.Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);

    const user = await Users.findAll({
        where: {
            refresh_token: refreshToken
        }
    });

    if (!user[0]) return res.sendStatus(204);

    const userId = user[0].id;
    await Users.update({ refresh_token: null }, {
        where: {
            id: userId
        }
    });

    res.clearCookie('refreshToken');
    return res.sendStatus(200);
};

exports.updateUsers = async (req, res) => {
    const { id } = req.params;
    const { 
      username, title_role, title_about, deskripsi, 
      deksripsi_about1, deksripsi_about2, 
      url_email, url_ig, url_github, url_x, 
      url_linkedin, url_tiktok, url_fb, 
      url_discord, copyright 
    } = req.body;
  
    try {
      const users = await Users.findByPk(id);
  
      if (!users) {
        return res.status(404).json({ msg: "Users tidak ditemukan" });
      }
  
      let { url_photo, nama_photo } = users;
      let { url_photo_contact, nama_photo_contact } = users;
  
      // Handle photo upload
      if (req.files?.photo) {
        const photo = Array.isArray(req.files.photo) ? req.files.photo[0] : req.files.photo;
        nama_photo = `${photo.md5}${path.extname(photo.name)}`;
        url_photo = `${req.protocol}://${req.get("host")}/photo/${nama_photo}`;
  
        const uploadPath = path.join(__dirname, "../public/photo", nama_photo);
  
        // Delete old photo if exists
        if (users.nama_photo) {
          const oldPhotoPath = path.join(__dirname, "../public/photo", users.nama_photo);
          if (fs.existsSync(oldPhotoPath)) {
            fs.unlinkSync(oldPhotoPath);
          }
        }
  
        await photo.mv(uploadPath);
      }
  
      // Handle contact photo upload
      if (req.files?.foto) {
        const foto = Array.isArray(req.files.foto) ? req.files.foto[0] : req.files.foto;
        nama_photo_contact = `${foto.md5}${path.extname(foto.name)}`;
        url_photo_contact = `${req.protocol}://${req.get("host")}/photo_contact/${nama_photo_contact}`;
  
        const uploadPath = path.join(__dirname, "../public/photo_contact", nama_photo_contact);
  
        // Delete old contact photo if exists
        if (users.nama_photo_contact) {
          const oldContactPhotoPath = path.join(__dirname, "../public/photo_contact", users.nama_photo_contact);
          if (fs.existsSync(oldContactPhotoPath)) {
            fs.unlinkSync(oldContactPhotoPath);
          }
        }
  
        await foto.mv(uploadPath);
      }
  
      // Update user data
      await Users.update(
        {
          username,
          title_role,
          title_about,
          deskripsi,
          deksripsi_about1,
          deksripsi_about2,
          url_photo,
          nama_photo,
          url_photo_contact,
          nama_photo_contact,
          url_email,
          url_ig,
          url_github,
          url_x,
          url_linkedin,
          url_tiktok,
          url_fb,
          url_discord,
          copyright
        },
        { where: { id } }
      );
  
      res.status(200).json({ msg: "Data users berhasil diperbarui" });
    } catch (error) {
      console.error("Error in updateUsers:", error);
      res.status(500).json({ msg: "Gagal memperbarui data users", error: error.message });
    }
  };

  exports.getUsers = async (req, res) => {
    try {
        const response = await Users.findAll();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}
  
exports.getUsersById = async (req, res) => {
    try {
        const response = await Users.findOne({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}