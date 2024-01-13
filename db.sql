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
    external_id int NOT NULL unique,
    `name` VARCHAR(50) NOT NULL UNIQUE,
    image VARCHAR(120) NOT NULL,
	description TEXT NOT NULL,
	preparation_description TEXT NOT NULL,
    area_id int NOT NULL,
	category_id INT NOT NULL,
	author_id INT,
    difficulty_id INT,
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
    `image` VARCHAR (120) NOT NULL
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

-- Fixed Atributes
INSERT IGNORE INTO `user` (username, email, `password`, firstName, lastName)
VALUES ('System', 'system@example.com', 'system_password', 'System', 'User');
/*
INSERT IGNORE INTO author (id) VALUES (1);  -- Assuming 1 is the ID of the user created above
*/
INSERT IGNORE INTO difficulty (`name`) values
('Beginner'), 
('Cook'), 
('Chef');

INSERT IGNORE INTO `area` (`name`) VALUES
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

INSERT IGNORE INTO ingredient (`name`, `description`, image)
VALUES
('Nori Sheets', 'Seaweed sheets for sushi rolls', 'http://image.example'),
('Avocado', 'Fresh avocado for sushi rolls', 'http://image.example'),
('Rice Vinegar', 'Seasoned rice vinegar for sushi rice', 'http://image.example'),
('Cherry Tomatoes', 'Fresh cherry tomatoes for the salad', 'http://image.example'),
('Olives', 'Kalamata olives for the salad', 'http://image.example'),
('Olive Oil', 'Extra virgin olive oil for the salad', 'http://image.example'),
('Mozzarella balls','Small balls made of mozzarella cheese', 'http://image.example'),
('Tuna','Strong flavored fish cought in the ocean, mostly in the altantic', 'http://image.example'),
('Basil','Fresh basil is used a lot to make salad and as a side condiment to a lot of mediterranean dishes', 'http://image.example'),
('Farfalle', 'Small pasta in the shape of little bowties used a lot in mediterranean and especially in italian dishes', 'http://image.example');

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

-- Views (probably will need to create object for author, area, category and difficulty)
DROP VIEW IF EXISTS search_recipes;
CREATE VIEW search_recipes AS
SELECT
    'recipes', JSON_ARRAYAGG(
        JSON_OBJECT(
            'id', r.id,
            'name', r.name,
            'category_id', c.id,
            'category', c.name,
            'description', r.description,
            'preparationDescription', r.preparation_description,
            'area_id', a.id,
            'area', a.name,
            'author_id', u.id,
            'author', CONCAT(u.firstName, ' ', u.lastName),
            'ingredients', (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT('ingredient_id', i.id, 'name', i.name, 'quantity', ri.quantity)
                )
                FROM recipe_ingredients ri
                JOIN ingredient i ON ri.ingredient_id = i.id
                WHERE ri.recipe_id = r.id
            ),
            'image', r.image,
            'preparationTime', r.preparationTime,  
            'difficulty_id', d.id,
            'difficulty', d.name,
            'cost', r.cost 
        )
    )
FROM
    recipe r
JOIN
    area a ON r.area_id = a.id
LEFT JOIN 
    `user` u ON r.author_id = u.id
/*JOIN
    author au ON r.author_id = au.id
JOIN
    `user` u ON au.id = u.id*/
LEFT JOIN
    category c ON r.category_id = c.id
LEFT JOIN
    difficulty d ON r.difficulty_id = d.id	
GROUP BY
    r.id;

SELECT * FROM search_recipes;

-- Recipe list
insert into recipe_list(`name`, user_id) values ("Piteu do veigas", 1);
insert into recipe_list_item(list_id, recipe_id) values (1, 1);
insert into recipe_list_item(list_id, recipe_id) values (1, 2);

select rl.name, r.name from recipe_list rl
join recipe_list_item rli on rl.id = rli.list_id
join recipe r on rli.recipe_id = r.id;

/* delete from recipe_list_item;
delete from recipe_ingredients;
delete from recipe; */