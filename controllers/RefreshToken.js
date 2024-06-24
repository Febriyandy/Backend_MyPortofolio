const Users = require("../models/UserModel.js");
const jwt = require("jsonwebtoken");

exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(401);

        const user = await Users.findOne({
            where: { refresh_token: refreshToken }
        });

        if (!user) return res.sendStatus(403);

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403);

            const userId = user.id;
            const username = user.username;
            const accessToken = jwt.sign({ userId, username }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '15s'
            });

            res.json({ accessToken });
        });
    } catch (error) {
        console.error("Error in refreshToken:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};
