drop database if exists pis_project;
create database if not exists pis_project;
use pis_project;

-- Create Tables
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(30) NOT NULL UNIQUE,
	`password` VARCHAR(255) NOT NULL,
	token VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(60) NOT NULL UNIQUE,
    first_name VARCHAR(15) NOT NULL,
    last_name VARCHAR(15) NOT NULL
);

DROP TABLE IF EXISTS author;
CREATE TABLE IF NOT EXISTS author(
	id int primary key,
	foreign key (id) references `user`(id)
);

DROP TABLE IF EXISTS difficulty;
CREATE TABLE IF NOT EXISTS difficulty(
	id INT PRIMARY KEY AUTO_INCREMENT,
    difficulty varchar(10) UNIQUE
);

DROP TABLE IF EXISTS category;
CREATE TABLE IF NOT EXISTS category (
    id INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL UNIQUE,
    `description` VARCHAR(255) not null,
    image varchar(120) not null 
);

DROP TABLE IF EXISTS `area`;
CREATE TABLE IF NOT EXISTS `area`(
	id INT PRIMARY KEY AUTO_INCREMENT,
    `area` varchar(60) not null unique
);


DROP TABLE IF EXISTS recipe;
CREATE TABLE IF NOT EXISTS recipe(
	id INT PRIMARY KEY AUTO_INCREMENT,
    external_id int not null unique,
    `name` VARCHAR(50) NOT NULL UNIQUE,
    image varchar(120) not null,
	description TEXT NOT NULL,
    area_id int not null,
	author_id INT not null,
	category_id INT not null,
    difficulty_id INT,
    preparationTime INT,
    cost_id DECIMAL(5,2),
    FOREIGN KEY (category_id) references category(id),
    FOREIGN KEY (area_id) references `area`(id),
    FOREIGN KEY (author_id) REFERENCES author(id),
    FOREIGN KEY (difficulty_id) REFERENCES difficulty(id)
);

DROP TABLE IF EXISTS ingredients;
CREATE TABLE IF NOT EXISTS ingredients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL UNIQUE,
    `description` VARCHAR (100) not null
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

DROP TABLE IF EXISTS recipe_ingredients;
CREATE TABLE IF NOT EXISTS recipe_ingredients(
	recipe_id int,
    ingredient_id int,
    quantity varchar(50),
    PRIMARY KEY (recipe_id, ingredient_id),
    FOREIGN KEY (recipe_id) references recipe(id),
    FOREIGN KEY (ingredient_id) references ingredients(id)
);

-- Fixed Atributes
INSERT IGNORE INTO `user` (username, email, `password`, first_name, last_name)
VALUES ('System', 'system@example.com', 'system_password', 'System', 'User');

INSERT IGNORE INTO author (id) VALUES (1);  -- Assuming 1 is the ID of the user created above

INSERT IGNORE INTO difficulty (difficulty) values
('Beginner'), 
('Cook'), 
('Chef');

INSERT IGNORE INTO `area` (`area`) VALUES
('American'), 
('British'), 
('Canadian'), 
('Chinese'), 
('Croatian'), 
('Dutch'), 
('Egyptian'), 
('Filipino'), 
('French'), 
('Greek'), 
('Indian'), 
('Irish'), 
('Italian'), 
('Jamaican'), 
('Japanese'), 
('Kenyan'), 
('Malaysian'), 
('Mediterranean'),
('Mexican'), 
('Moroccan'), 
('Polish'), 
('Portuguese'), 
('Russian'), 
('Spanish'), 
('Thai'), 
('Tunisian'), 
('Turkish'), 
('Unknown'), 
('Vietnamese');

INSERT IGNORE INTO category (`name`, `description`, image) 
VALUES
    ('Beef', 'Beef is a culinary delight derived from cattle, known for its rich flavor and nutritional value.', 'beef_image.jpg'),
    ('Chicken', 'Chicken, a domesticated fowl, is a versatile meat enjoyed worldwide for its lean protein and mild taste.', 'chicken_image.jpg'),
    ('Fish', 'Fish is a diverse group of aquatic animals. It is a popular choice for a healthy and delicious meal.', 'fish_image.jpg'),
    ('Salad', 'Salads are refreshing and nutritious dishes typically consisting of a mixture of vegetables, fruits, and other ingredients.', 'salad_image.jpg');

INSERT IGNORE INTO recipe (external_id, `name`, area_id, author_id, image, description, category_id)
VALUES
(101, 'Sushi Rolls', 15, 1, 'https://www.themealdb.com/images/media/meals/g046bb1663960946.jpg/preview', 'Steps:\n1. Prepare the rice vinegar-seasoned rice. \n2. Place a nori sheet on a bamboo rolling mat.\n3. Spread a thin layer of prepared rice on the nori sheet.\n4. Add sliced avocado along one edge of the rice.\n5. Roll the sushi tightly and cut into bite-sized pieces.', 3),
(102, 'Mediterranean Salad', 18, 1, 'https://www.themealdb.com/images/media/meals/wvqpwt1468339226.jpg/preview', 'Steps:\n1. Cook the farfalle pasta according to package instructions.\n2. In a large bowl, combine cherry tomatoes, olives, mozzarella balls, tuna, and cooked farfalle.\n3. Drizzle olive oil over the salad and toss gently to combine.\n4. Garnish with fresh basil before serving.', 4);

INSERT IGNORE INTO ingredients (`name`, `description`)
VALUES
('Nori Sheets', 'Seaweed sheets for sushi rolls'),
('Avocado', 'Fresh avocado for sushi rolls'),
('Rice Vinegar', 'Seasoned rice vinegar for sushi rice'),
('Cherry Tomatoes', 'Fresh cherry tomatoes for the salad'),
('Olives', 'Kalamata olives for the salad'),
('Olive Oil', 'Extra virgin olive oil for the salad'),
('Mozzarella balls','Small balls made of mozzarella cheese'),
('Tuna','Strong flavored fish cought in the ocean, mostly in the altantic'),
('Basil','Fresh basil is used a lot to make salad and as a side condiment to a lot of mediterranean dishes'),
('Farfalle', 'Small pasta in the shape of little bowties used a lot in mediterranean and especially in italian dishes');

INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, quantity)
VALUES
(1, 1, '5 sheets'),       -- Sushi Rolls with 5 Nori sheets
(1, 2, '2'),              -- 2 avocados
(1, 3, '100ml'),          -- 100ml rice vinegar
(2, 4, '1 cup'),         -- Mediterranean Salad with 1 cup cherry tomatoes
(2, 5, '1 cup'),         -- 1 cup olives
(2, 6, '2 tablespoons'), -- 2 tablespoons olive oil
(2, 7, '200g'), -- 200g of Mozzarella
(2, 8, '200g'), -- 200g of tuna
(2, 9, '1 bunch'), -- 1 bunch of basil
(2, 10 , '350g'); -- 350g of farfalle


-- Views
DROP VIEW IF EXISTS recipe_view;

CREATE VIEW recipe_view AS
SELECT
    r.id AS `Recipe ID`,
    r.name AS `Name`,
    c.name AS Category,
    r.description AS `Description`,
    a.area AS `Area`,
    CONCAT(u.first_name, ' ', u.last_name) AS Author,
    CONCAT_WS(', ', GROUP_CONCAT(DISTINCT i.name), GROUP_CONCAT(ri.quantity)) AS `Ingredients(Qty)`,
    r.image AS image,
    r.preparationTime AS `Time`,
    d.difficulty AS Difficulty,
    r.cost_id AS Cost
FROM
    recipe r
JOIN
    area a ON r.area_id = a.id
JOIN
    author au ON r.author_id = au.id
JOIN
    `user` u ON au.id = u.id
LEFT JOIN
    category c ON r.category_id = c.id
LEFT JOIN
    recipe_ingredients ri ON r.id = ri.recipe_id
LEFT JOIN
    ingredients i ON ri.ingredient_id = i.id
LEFT JOIN
    difficulty d ON r.difficulty_id = d.id
GROUP BY
    r.id, ri.quantity;



SELECT * FROM recipe_view;

-- JSON
SELECT
    JSON_OBJECT(
        'recipes', JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', r.id,
                'name', r.name,
                'category', c.name,
                'description', r.description,
                'area', a.area,
                'author', CONCAT(u.first_name, ' ', u.last_name),
                'ingredients', (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT('name', i.name, 'quantity', ri.quantity)
                    )
                    FROM recipe_ingredients ri
                    JOIN ingredients i ON ri.ingredient_id = i.id
                    WHERE ri.recipe_id = r.id
                ),
                'image', r.image,
                'preparationTime', r.preparationTime,  
                'difficulty', d.difficulty,
                'cost', r.cost_id  
            )
        )
    ) AS `recipes`
FROM
    recipe r
JOIN
    area a ON r.area_id = a.id
JOIN
    author au ON r.author_id = au.id
JOIN
    `user` u ON au.id = u.id
LEFT JOIN
    category c ON r.category_id = c.id
LEFT JOIN
    difficulty d ON r.difficulty_id = d.id
GROUP BY
    r.id;


-- More data after executing the SeedController