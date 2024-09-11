-- -------------------------------------------------------------
-- TablePlus 6.1.2(569)
--
-- https://tableplus.com/
--
-- Database: vuetest
-- Generation Time: 2024-09-11 21:58:47.4500
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


CREATE TABLE `country` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `is_active` tinyint(4) DEFAULT '1',
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

CREATE TABLE `customer` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `is_active` tinyint(4) DEFAULT '1',
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

CREATE TABLE `product_category` (
  `object_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `is_active` tinyint(4) DEFAULT '1',
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `category_group` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`object_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

CREATE TABLE `sales_order` (
  `object_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `customer_id` bigint(20) NOT NULL,
  `status_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `country_id` int(11) NOT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  PRIMARY KEY (`object_id`),
  KEY `customer_id` (`customer_id`),
  KEY `status_id` (`status_id`),
  KEY `category_id` (`category_id`),
  KEY `country_id` (`country_id`),
  CONSTRAINT `sales_order_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`),
  CONSTRAINT `sales_order_ibfk_2` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`),
  CONSTRAINT `sales_order_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `product_category` (`object_id`),
  CONSTRAINT `sales_order_ibfk_4` FOREIGN KEY (`country_id`) REFERENCES `country` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

CREATE TABLE `status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `is_active` tinyint(4) DEFAULT '1',
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

INSERT INTO `country` (`id`, `name`, `is_active`, `created_date`, `updated_date`) VALUES
(1, 'United Kingdom', 1, '2019-01-01 00:00:00', NULL),
(2, 'Russia', 1, '2019-01-01 00:00:00', NULL),
(3, 'Germany', 1, '2019-01-01 00:00:00', NULL),
(4, 'Singapore', 1, '2019-01-01 00:00:00', NULL),
(5, 'Malaysia', 1, '2019-01-01 00:00:00', NULL),
(6, 'Taiwan', 1, '2019-01-01 00:00:00', NULL),
(7, 'China', 1, '2019-01-01 00:00:00', NULL);

INSERT INTO `customer` (`id`, `name`, `is_active`, `created_date`, `updated_date`) VALUES
(1, 'Kivell', 1, '2019-01-01 00:00:00', NULL),
(2, 'Jardine', 1, '2019-01-01 00:00:00', NULL),
(3, 'Gill', 1, '2019-01-01 00:00:00', NULL),
(4, 'Sor’vino', 1, '2019-01-01 00:00:00', NULL),
(5, 'Jones', 1, '2019-01-01 00:00:00', NULL),
(6, 'Andrews', 1, '2019-01-01 00:00:00', NULL),
(7, 'Thompson', 1, '2019-01-01 00:00:00', NULL),
(8, 'Morgan', 1, '2019-01-01 00:00:00', NULL);

INSERT INTO `product_category` (`object_id`, `name`, `is_active`, `created_date`, `updated_date`, `category_group`) VALUES
(1, 'Electronics', 1, '2019-01-01 00:00:00', NULL, 'Electronics'),
(2, 'Furniture', 1, '2019-01-01 00:00:00', NULL, 'Furniture'),
(3, 'Stationery', 1, '2019-01-01 00:00:00', NULL, 'Others'),
(4, 'Sports', 1, '2019-01-01 00:00:00', NULL, 'Others'),
(5, 'Hardware', 1, '2019-01-01 00:00:00', NULL, 'Others');

INSERT INTO `sales_order` (`object_id`, `customer_id`, `status_id`, `category_id`, `country_id`, `created_date`, `updated_date`) VALUES
(1, 1, 1, 1, 1, '2019-01-23 00:00:00', NULL),
(2, 2, 2, 2, 2, '2019-02-09 00:00:00', NULL),
(3, 3, 3, 3, 3, '2019-02-26 00:00:00', NULL),
(4, 4, 4, 2, 4, '2019-03-15 00:00:00', NULL),
(5, 5, 3, 4, 3, '2019-04-01 00:00:00', NULL),
(6, 6, 2, 1, 5, '2019-04-18 00:00:00', NULL),
(7, 2, 2, 4, 3, '2019-05-05 00:00:00', NULL),
(8, 7, 1, 5, 5, '2019-05-22 00:00:00', NULL),
(9, 5, 4, 2, 6, '2019-06-08 00:00:00', NULL),
(10, 8, 2, 4, 7, '2019-04-18 00:00:00', NULL);

INSERT INTO `status` (`id`, `name`, `is_active`, `created_date`, `updated_date`) VALUES
(1, 'Accepted', 1, '2019-01-01 00:00:00', NULL),
(2, 'Processing', 1, '2019-01-01 00:00:00', NULL),
(3, 'Rejected', 1, '2019-01-01 00:00:00', NULL),
(4, 'Open', 1, '2019-01-01 00:00:00', NULL);



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;