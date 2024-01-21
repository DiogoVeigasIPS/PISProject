drop database if exists pis_project;
create database if not exists pis_project;
use pis_project;

-- Create Tables
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(30) NOT NULL UNIQUE,
	`password` VARCHAR(255) NOT NULL,
    email VARCHAR(60) NOT NULL UNIQUE,
    firstName VARCHAR(15) NOT NULL,
    lastName VARCHAR(15) NOT NULL,
    `image` TEXT NULL,
    isAdmin BOOL NOT NULL DEFAULT 0
);

DROP TABLE IF EXISTS difficulty;
CREATE TABLE IF NOT EXISTS difficulty(
	id INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(50) UNIQUE
);

DROP TABLE IF EXISTS category;
CREATE TABLE IF NOT EXISTS category (
    id INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL UNIQUE,
    `description` TEXT,
    image TEXT NOT NULL 
);

DROP TABLE IF EXISTS `area`;
CREATE TABLE IF NOT EXISTS `area`(
	id INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(60) NOT NULL unique
);

DROP TABLE IF EXISTS recipe;
CREATE TABLE IF NOT EXISTS recipe(
	id INT PRIMARY KEY AUTO_INCREMENT,
    external_id int unique,
    `name` VARCHAR(200) NOT NULL UNIQUE,
    image TEXT NOT NULL,
	description TEXT,
	preparation_description TEXT NOT NULL,
    area_id int NOT NULL,
	category_id INT NOT NULL,
	author_id INT NULL,
    difficulty_id INT NULL,
    preparationTime INT,
    cost DECIMAL(5,2),
    FOREIGN KEY (category_id) references category(id),
    FOREIGN KEY (area_id) references `area`(id),
    FOREIGN KEY (author_id) REFERENCES user(id),
    FOREIGN KEY (difficulty_id) REFERENCES difficulty(id)
);

DROP TABLE IF EXISTS ingredient;
CREATE TABLE IF NOT EXISTS ingredient (
    id INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL UNIQUE,
    `description` TEXT,
    `image` TEXT
);

-- Many to Many tables
DROP TABLE IF EXISTS recipe_ingredient;
CREATE TABLE IF NOT EXISTS recipe_ingredient(
	recipe_id int,
    ingredient_id int,
    quantity VARCHAR(50),
    PRIMARY KEY (recipe_id, ingredient_id),
    FOREIGN KEY (recipe_id) references recipe(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) references ingredient(id)
);

DROP TABLE IF EXISTS favorite_recipe;
CREATE TABLE IF NOT EXISTS favorite_recipe (
    user_id INT,
    recipe_id INT,
    timestamp_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, recipe_id),  
    FOREIGN KEY (user_id) REFERENCES `user`(id),
    FOREIGN KEY (recipe_id) REFERENCES recipe(id)
);

DROP TABLE IF EXISTS recipe_list;
CREATE TABLE IF NOT EXISTS recipe_list (
	id INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(155) NOT NULL,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES `user`(id)
);

DROP TABLE IF EXISTS recipe_list_item;
CREATE TABLE IF NOT EXISTS recipe_list_item (
	list_id INT,
    recipe_id INT,
    PRIMARY KEY (list_id, recipe_id),  
    FOREIGN KEY (list_id) REFERENCES recipe_list(id),
    FOREIGN KEY (recipe_id) REFERENCES recipe(id)
);

-- Views
DROP VIEW IF EXISTS search_recipes;
CREATE VIEW search_recipes AS
SELECT
    r.id AS id,
    r.external_id AS idProvider,
    r.name AS name,
    c.id AS category_id,
    a.id AS area_id,
    u.id AS author_id,
    d.id AS difficulty_id,
    JSON_OBJECT(
        'id', c.id,
        'name', c.name,
        'description', c.description,
        'image', c.image
    ) AS category,
    r.description AS description,
    r.preparation_description AS preparationDescription,
    JSON_OBJECT(
        'id', a.id,
        'name', a.name
    ) AS area,
    JSON_OBJECT(
        'id', u.id,
        'username', u.username,
        'firstName', u.firstName,
        'lastName', u.lastName
    ) AS author,
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'ingredient', JSON_OBJECT(
                    'id', i.id,
                    'name', i.name,
                    'image', i.image
                ),
                'quantity', ri.quantity
            )
        ) AS ingredients
        FROM recipe_ingredient ri
        JOIN ingredient i ON ri.ingredient_id = i.id
        WHERE ri.recipe_id = r.id
    ) AS ingredients,
    r.image AS image,
    r.preparationTime AS preparationTime,
    JSON_OBJECT(
        'id', d.id,
        'name', d.name
    ) AS difficulty,
    r.cost AS cost
FROM
    recipe r
    JOIN area a ON r.area_id = a.id
    LEFT JOIN `user` u ON r.author_id = u.id
    LEFT JOIN category c ON r.category_id = c.id
    LEFT JOIN difficulty d ON r.difficulty_id = d.id;

DROP VIEW IF EXISTS partial_search_recipes;
CREATE VIEW partial_search_recipes AS
SELECT
    r.id AS id,
    r.name AS name,
    r.image AS image,
    r.external_id AS idProvider,
    category_id,
    area_id,
    author_id,
    difficulty_id
    FROM recipe r;

DROP VIEW IF EXISTS partial_named_search_recipes;
CREATE VIEW partial_named_search_recipes AS
SELECT
    r.id AS id,
    r.name AS name,
    r.image AS image,
    r.external_id AS idProvider,
    JSON_OBJECT(
        'id', c.id,
        'name', c.name
    ) AS category,
    JSON_OBJECT(
        'id', d.id,
        'name', IFNULL(d.name, 'Not provided')
    ) AS difficulty,
    JSON_OBJECT(
        'id', u.id,
        'username', u.username
    ) AS author,
    JSON_OBJECT(
        'id', a.id,
        'name', a.name
    ) AS area,
    c.id AS category_id,
    a.id AS area_id
    FROM recipe r
    JOIN area a ON r.area_id = a.id
    LEFT JOIN `user` u ON r.author_id = u.id
    LEFT JOIN category c ON r.category_id = c.id
    LEFT JOIN difficulty d ON r.difficulty_id = d.id;

DROP VIEW IF EXISTS partial_ingredients;
CREATE VIEW partial_ingredients AS
SELECT
    id as id,
    `name`as `name`,
    `image` as `image`
from ingredient;

-- difficulty

INSERT INTO `difficulty` (`name`) VALUES ('Beginner'), ('Cook'), ('Chef');

-- user

INSERT INTO `user` (username, `password`, email, firstName, lastName, image, isAdmin) 
VALUES ('diogoveigas', '$2b$10$l6uOhFiBJu0METRSPseae.IgXRJbrCxeL6MOkydpM9Dom.kn2dCuC', 'diogo@admin.com', 'Diogo', 'Veigas', 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimage.myanimelist.net%2Fui%2F_3fYL8i6Q-n-155t3dn_4lSUHsq7btWTlmgH6uHajdH5TTQ7Kt5AmXxYAAHY3pSv&f=1&nofb=1&ipt=96f562e13e7959d030f7e93415b7827f1dc348b4230345758b0e9ba25801e869&ipo=images', 1),
('alc', '$2b$10$/mkWNJp5.TxK3hOc4WXMr.j2uJMSvRmbBQgTfLH3FX2dyyVCc401a', 'andre@admin.com', 'andre', 'carvalho', NULL, 1);