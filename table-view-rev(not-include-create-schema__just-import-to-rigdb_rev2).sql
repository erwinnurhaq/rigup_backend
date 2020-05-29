-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: rigdb_rev2
-- ------------------------------------------------------
-- Server version	8.0.18

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Temporary view structure for view `category_leaf`
--

DROP TABLE IF EXISTS `category_leaf`;
/*!50001 DROP VIEW IF EXISTS `category_leaf`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `category_leaf` AS SELECT 
 1 AS `id`,
 1 AS `category`,
 1 AS `mainParentId`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `product_complete_fix`
--

DROP TABLE IF EXISTS `product_complete_fix`;
/*!50001 DROP VIEW IF EXISTS `product_complete_fix`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `product_complete_fix` AS SELECT 
 1 AS `id`,
 1 AS `brandId`,
 1 AS `name`,
 1 AS `description`,
 1 AS `weight`,
 1 AS `wattage`,
 1 AS `price`,
 1 AS `stock`,
 1 AS `brand`,
 1 AS `categoryId`,
 1 AS `category`,
 1 AS `mainParentId`,
 1 AS `image`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `category_leaf`
--

/*!50001 DROP VIEW IF EXISTS `category_leaf`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `category_leaf` AS select `c1`.`id` AS `id`,`c1`.`category` AS `category`,`c1`.`mainParentId` AS `mainParentId` from (`categories` `c1` left join `categories` `c2` on((`c2`.`parentId` = `c1`.`id`))) where (`c2`.`id` is null) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `product_complete_fix`
--

/*!50001 DROP VIEW IF EXISTS `product_complete_fix`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `product_complete_fix` AS select `p`.`id` AS `id`,`p`.`brandId` AS `brandId`,`p`.`name` AS `name`,`p`.`description` AS `description`,`p`.`weight` AS `weight`,`p`.`wattage` AS `wattage`,`p`.`price` AS `price`,`p`.`stock` AS `stock`,`b`.`brand` AS `brand`,`c`.`id` AS `categoryId`,`c`.`category` AS `category`,`c`.`mainParentId` AS `mainParentId`,`img`.`image` AS `image` from ((((`products` `p` join `brands` `b` on((`b`.`id` = `p`.`brandId`))) join `product_cats` `pc` on((`pc`.`productId` = `p`.`id`))) join `categories` `c` on((`c`.`id` = `pc`.`categoryId`))) join (select `pi`.`productId` AS `productId`,`pi`.`image` AS `image` from ((select min(`product_images`.`id`) AS `id` from `product_images` group by `product_images`.`productId`) `i` join `product_images` `pi` on((`pi`.`id` = `i`.`id`)))) `img` on((`img`.`productId` = `p`.`id`))) order by `p`.`id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-05-30  2:34:57
