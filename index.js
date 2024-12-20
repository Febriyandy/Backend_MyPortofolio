const express = require("express");
const db = require("./config/Database.js");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const FileUpload = require("express-fileupload");
const SkillRoute = require("./routes/SkillRoute.js");
const ProjectRoute = require("./routes/ProjectRoute.js");
const SertifikatRoute = require("./routes/SertifikatRoute.js");
const ArtikelRoute = require("./routes/ArtikelRoute.js");
const KontakRoute = require("./routes/KontakRoute.js");
const UsersRoute = require ("./routes/UserRoute.js");
const Sertifikat = require("./models/SertifikatModel.js");

dotenv.config();
const app = express();
const PORT = process.env.APP_PORT || 3000;
const server_host = process.env.YOUR_HOST || '0.0.0.0';
const frontend_url = process.env.FRONTEND_URL || 'http://localhost:5173';

(async () => {
    try {
        await db.authenticate();
        console.log('Database Connected..');
        //await Sertifikat.sync();
    } catch (error) {
        console.error(error);
    }
})();

app.use(cors({ credentials:true, origin: frontend_url}));
app.use(cookieParser());
app.use(express.json());
app.use(FileUpload());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(SkillRoute);
app.use(ProjectRoute);
app.use(SertifikatRoute);
app.use(ArtikelRoute);
app.use(KontakRoute);
app.use(UsersRoute);


app.listen(PORT, server_host, () => {
    console.log(`Server up and running on port ${PORT}...`);
});
