const express = require("express");
const app = express();
const db = require("./db");
const multer = require("multer"); // multer defines where to save files
const uidSafe = require("uid-safe"); // encodes file name
const path = require("path"); // grabs extention (jpg)
const s3 = require("./s3");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.use(express.static("public"));

app.get("/images", (req, res) => {
    db.getImages()
        .then(({ rows }) => {
            console.log("rows: ", rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("error in getImages: ", err);
        });
});

app.post("/images", uploader.single("file"), s3.upload, function (req, res) {
    // If nothing went wrong the file is already in the uploads directory
    const { title, description, username } = req.body;
    const { filename } = req.file;
    const url = `https://s3.amazonaws.com/spicedling/${filename}`;

    if (req.file) {
        db.postImages(title, description, username, url)
            .then(({ rows }) => {
                rows = rows[0];
                res.json({ rows });
                console.log("rows: ", rows);
            })
            .catch((err) => {
                console.log("error in postImages", err);
            });
    } else {
        res.json({
            success: false,
        });
    }
});

app.listen(8080, () => console.log("Imageboard up and running"));

// image should be less than 2MB
//upload.single("file") acts as middleware
