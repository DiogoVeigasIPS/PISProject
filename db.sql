drop database if exists pis_project;
create database if not exists pis_project;
use pis_project;

-- Create Tables
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(60) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
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

DROP TABLE IF EXISTS cost;
CREATE TABLE IF NOT EXISTS cost(
	id INT PRIMARY KEY AUTO_INCREMENT,
    cost varchar(20) 
);

DROP TABLE IF EXISTS recipes;
CREATE TABLE IF NOT EXISTS recipes(
	id INT PRIMARY KEY AUTO_INCREMENT,
    external_id int not null unique,
    `name` VARCHAR(50) NOT NULL UNIQUE,
	preparationTime TIME not NULL,
    difficulty_id int not null,
    area_id int not null,
	author_id INT not null,
    image varchar(120) not null,
	description TEXT NOT NULL,
    FOREIGN KEY (area_id) references `area` (id),
    FOREIGN KEY (author_id) REFERENCES author(author_id),
    FOREIGN KEY (difficulty_id) references difficulty(id)
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
    FOREIGN KEY (user_id) REFERENCES `user` (id),
    FOREIGN KEY (recipe_id) REFERENCES recipes (id)
);

DROP TABLE IF EXISTS recipe_category;
CREATE TABLE IF NOT EXISTS recipe_category (
    recipe_id INT,
    category_id INT,
    PRIMARY KEY (recipe_id, category_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id),
    FOREIGN KEY (category_id) REFERENCES category(id)
);

DROP TABLE IF EXISTS recipe_ingredients;
CREATE TABLE IF NOT EXISTS recipe_ingredients(
	recipe_id int,
    ingredient_id int,
    quantity varchar(50),
    PRIMARY KEY (recipe_id, ingredient_id),
    FOREIGN KEY (recipe_id) references recipes(id),
    FOREIGN KEY (ingredient_id) references ingredients(id)
);

-- Fixed Atributes
INSERT INTO `user` (username, email, `password`, first_name, last_name)
VALUES ('System', 'system@example.com', 'system_password', 'System', 'User');

INSERT INTO difficulty (difficulty) values
('Beginner'), 
('Cook'), 
('Culinarian'), 
('Chef');

INSERT INTO `area` (`area`) VALUES
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

-- More data after executing the SeedController