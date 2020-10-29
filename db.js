var spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/imageboard`
);

module.exports.getImages = () => {
    return db.query(`SELECT * FROM images ORDER BY id DESC`);
};

module.exports.postImages = (title, description, username, url) => {
    return db.query(
        `INSERT INTO images(title, description, username, url)
        VALUES ($1, $2, $3, $4) RETURNING *`,
        [title, description, username, url]
    );
};

module.exports.getModalImage = (id) => {
    return db.query(`SELECT * FROM images WHERE id=$1`, [id]);
};

module.exports.getComments = (id) => {
    return db.query(`SELECT * FROM comments WHERE id=$1 ORDER BY id DESC`, [
        id,
    ]);
};

module.exports.postComments = (comment, username, id) => {
    return db.query(
        `INSERT INTO comments (username, comment, image_id)
        VALUES ($1, $2, $3) RETURNING *`,
        [comment, username, id]
    );
};
