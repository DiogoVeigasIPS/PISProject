drop database if exists pis_project;
create database if not exists pis_project;
use pis_project;

-- Create Tables
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(30) NOT NULL UNIQUE,
	`password` VARCHAR(255) NOT NULL,
	token VARCHAR(255),
    email VARCHAR(60) NOT NULL UNIQUE,
    firstName VARCHAR(15) NOT NULL,
    lastName VARCHAR(15) NOT NULL
);

/* DROP TABLE IF EXISTS author;
CREATE TABLE IF NOT EXISTS author(
	id int primary key,
	foreign key (id) references `user`(id)
); */

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
    image VARCHAR(120) NOT NULL 
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
    image VARCHAR(120) NOT NULL,
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
    `image` VARCHAR (120)
);

-- Many to Many tables
DROP TABLE IF EXISTS favorite_recipe;
CREATE TABLE IF NOT EXISTS favorite_recipe (
    user_id INT,
    recipe_id INT,
    PRIMARY KEY (user_id, recipe_id),  
    FOREIGN KEY (user_id) REFERENCES `user`(id),
    FOREIGN KEY (recipe_id) REFERENCES recipe(id)
);

DROP TABLE IF EXISTS recipe_ingredient;
CREATE TABLE IF NOT EXISTS recipe_ingredient(
	recipe_id int,
    ingredient_id int,
    quantity VARCHAR(50),
    PRIMARY KEY (recipe_id, ingredient_id),
    FOREIGN KEY (recipe_id) references recipe(id),
    FOREIGN KEY (ingredient_id) references ingredient(id)
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
    COALESCE(r.description, 'Not provided') AS description, -- Handle NULL description
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
    c.id AS category_id,
    a.id AS area_id,
    u.id AS author_id,
    d.id AS difficulty_id
    FROM recipe r
    JOIN area a ON r.area_id = a.id
    LEFT JOIN `user` u ON r.author_id = u.id
    LEFT JOIN category c ON r.category_id = c.id
    LEFT JOIN difficulty d ON r.difficulty_id = d.id;

-- Query the view
SELECT * FROM search_recipes WHERE name like 'Sushi%';
SELECT * FROM search_recipes WHERE category_id = 4;
SELECT * FROM search_recipes WHERE area_id = 15;
SELECT * FROM search_recipes ORDER BY RAND();
SELECT * FROM search_recipes LIMIT 1;


select rl.name, r.name from recipe_list rl
join recipe_list_item rli on rl.id = rli.list_id
join recipe r on rli.recipe_id = r.id;

/* delete from recipe_list_item;
delete from recipe_ingredient;
delete from recipe; */