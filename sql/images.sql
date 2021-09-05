DROP TABLE IF EXISTS images CASCADE;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    image_upload VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS links CASCADE;

CREATE TABLE links(
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- hardcoded images:

-- INSERT INTO images (image_upload, username, title, description) VALUES (
--     'https://s3.amazonaws.com/imageboard/jAVZmnxnZ-U95ap2-PLliFFF7TO0KqZm.jpg',
--     'funkychicken',
--     'Welcome to Spiced and the Future!',
--     'This photo brings back so many great memories.'
-- );

-- INSERT INTO images (image_upload, username, title, description) VALUES (
--     'https://s3.amazonaws.com/imageboard/wg8d94G_HrWdq7bU_2wT6Y6F3zrX-kej.jpg',
--     'discoduck',
--     'Elvis',
--     'We can''t go on together with suspicious minds.'
-- );

-- INSERT INTO images (image_upload, username, title, description) VALUES (
--     'https://s3.amazonaws.com/imageboard/XCv4AwJdm6QuzjenFPKJocpipRNNMwze.jpg',
--     'discoduck',
--     'To be or not to be',
--     'That is the question.'
-- );
-- INSERT INTO images (image_upload, username, title, description) VALUES (
--     'https://eatliver.b-cdn.net/wp-content/uploads/2019/11/cats1.jpg',
--     'discoduck',
--     'To be or not to be',
--     'That is the question.'
-- );
-- INSERT INTO links (url) VALUES (
--     'https://eatliver.b-cdn.net/wp-content/uploads/2019/11/cats1.jpg'
-- );
