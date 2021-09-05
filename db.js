var spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/imageboard`
);

module.exports.getImages = () => {
    return db.query(`SELECT * FROM images ORDER BY id DESC LIMIT 12`);
};

module.exports.postImages = (title, description, username, image_upload) => {
    return db.query(
        `INSERT INTO images(title, description, username, image_upload)
        VALUES ($1, $2, $3, $4) RETURNING *`,
        [title, description, username, image_upload]
    );
};
module.exports.getLinks = () => {
    return db.query(`SELECT * FROM links ORDER BY id DESC LIMIT 12`);
};

module.exports.postLinks = (url) => {
    return db.query(
        `INSERT INTO links(url)
        VALUES ($1) RETURNING *`,
        [url]
    );
};

module.exports.getModalImage = (id) => {
    return db.query(`SELECT * FROM images WHERE id=$1`, [id]);
};

module.exports.getComments = (image_id) => {
    return db.query(
        `SELECT * FROM comments WHERE image_id=$1 ORDER BY id DESC`,
        [image_id]
    );
};

module.exports.postComments = (comment, username, image_id) => {
    // console.log("comment, username, image_id: ", comment, username, image_id);
    return db.query(
        `INSERT INTO comments (comment, username, image_id)
        VALUES ($1, $2, $3) RETURNING *`,
        [comment, username, image_id]
    );
};

module.exports.getMoreImages = (lastId) => {
    return db.query(
        `SELECT image_upload, title, id, (
SELECT id FROM images
ORDER BY id ASC
LIMIT 1
) AS "lowestId" FROM images
WHERE id < $1
ORDER BY id DESC
LIMIT 12`,
        [lastId]
    );
};
