const Users = require("../models/UserModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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