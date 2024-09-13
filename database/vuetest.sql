CREATE USER 'devUser'@'localhost' IDENTIFIED BY 'devUser';

-- create database
DROP DATABASE IF EXISTS vuetest;
CREATE DATABASE vuetest;

USE vuetest;
-- drop table if exists
DROP TABLE IF EXISTS sales_order;
DROP TABLE IF EXISTS product_category;

DROP TABLE IF EXISTS `product_category`;
CREATE TABLE `product_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `category_group` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `sales_order`;
CREATE TABLE `sales_order` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(128) NOT NULL,
  `status` varchar(15) NOT NULL,
  `category_id` int(11) NOT NULL,
  `country` varchar(30) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `sales_order_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `product_category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

INSERT INTO `product_category` (`id`, `name`, `created_date`, `updated_date`, `category_group`) VALUES
(1, 'Electronics', '2019-01-01 00:00:00', NULL, 'Electronics'),
(2, 'Furniture', '2019-01-01 00:00:00', NULL, 'Furniture'),
(3, 'Stationery', '2019-01-01 00:00:00', NULL, 'Others'),
(4, 'Sports', '2019-01-01 00:00:00', NULL, 'Others'),
(5, 'Hardware', '2019-01-01 00:00:00', NULL, 'Others');

INSERT INTO `sales_order` (`id`, `customer_name`, `status`, `category_id`, `country`, `created_date`, `updated_date`) VALUES
(1, 'Kivell', 'Accepted', 1, ' United Kingdom', '2019-01-23 00:00:00', NULL),
(2, 'Jardine', 'Processing', 2, ' Russia', '2019-02-09 00:00:00', NULL),
(3, 'Gill', 'Rejected', 3, ' German', '2019-02-26 00:00:00', NULL),
(4, 'Sor’vino', 'Open', 2, ' Singapore', '2019-03-15 00:00:00', NULL),
(5, 'Jones', 'Rejected', 4, ' German', '2019-04-01 00:00:00', NULL),
(6, 'Andrews', 'Processing', 1, ' Malaysia', '2019-04-18 00:00:00', NULL),
(7, 'Jardine', 'Processing', 4, ' German', '2019-05-05 00:00:00', NULL),
(8, 'Thompson', 'Accepted', 5, ' Malaysia', '2019-05-22 00:00:00', NULL),
(9, 'Jones', 'Open', 2, ' Taiwan', '2019-06-08 00:00:00', NULL),
(10, 'Morgan', 'Processing', 4, ' China', '2019-04-18 00:00:00', NULL),
(12, 'Dummy', 'Processing', 3, ' Russia', '2024-09-12 02:40:19', NULL),
(13, 'New Test', 'Rejected', 5, ' Singapore', '2024-09-12 02:40:37', NULL),
(14, 'Hello123', 'Rejected', 2, ' German', '2024-09-12 11:12:35', '2024-09-12 11:21:36');