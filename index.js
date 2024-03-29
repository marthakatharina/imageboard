const express = require("express");
const app = express();
const db = require("./db");
const multer = require("multer"); // multer defines where to save files
const uidSafe = require("uid-safe"); // encodes file name
const path = require("path"); // grabs extention (jpg)
const s3 = require("./s3");
const { s3Url } = require("./config.json");

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
app.use(express.json());

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
    // const image_upload = `https://s3.amazonaws.com/spicedling/${filename}`;
    const image_upload = `https://s3.amazonaws.com/onlinebookcase/${filename}`;

    if (req.file) {
        db.postImages(title, description, username, image_upload)
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

app.get("/links", (req, res) => {
    db.getLinks()
        .then(({ rows }) => {
            console.log("rows: ", rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("error in getLinks: ", err);
        });
});

app.post("/links", function (req, res) {
    const { url } = req.body.link;

    if (req.body) {
        db.postLinks(url)
            .then(({ rows }) => {
                rows = rows[0];
                res.json({ rows });
                console.log("rows: ", rows);
            })
            .catch((err) => {
                console.log("error in postLinks", err);
            });
    } else {
        res.json({
            success: false,
        });
    }
});

app.get("/images/:id", (req, res) => {
    const { id } = req.params;
    console.log("req.params: ", req.params.id);
    db.getModalImage(id)
        .then(({ rows }) => {
            console.log("rows in getModalImage: ", rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("err in getModalImage: ", err);
        });
});

app.get("/comments/:id", (req, res) => {
    const { id } = req.params;
    db.getComments(id)
        .then(({ rows }) => {
            console.log("rows: ", rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("error in getComments: ", err);
        });
});

app.post("/comment", (req, res) => {
    console.log("req.body: ", req.body);
    const { comment, username, id } = req.body.newComment;
    db.postComments(comment, username, id)
        .then(({ rows }) => {
            rows = rows[0];
            res.json({ rows });
            console.log("rows in POST: ", rows);
        })
        .catch((err) => {
            console.log("error in postComments", err);
        });
});

app.get("/more/:lastId", (req, res) => {
    const { lastId } = req.params;
    console.log("req.params: ", req.params);

    db.getMoreImages(lastId)
        .then(({ rows }) => {
            console.log("rows in getMoreImages: ", rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("error in getMoreImages", err);
        });
});

app.listen(process.env.PORT || 8080, () =>
    console.log("Imageboard up and running")
);

// image should be less than 2MB
//upload.single("file") acts as middleware
