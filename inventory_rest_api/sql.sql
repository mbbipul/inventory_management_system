-- SELECT name, database_id, create_date  
-- FROM sys.databases ;
-- Drop the database 'DatabaseName'
-- Connect to the 'master' database to run this snippet
USE master
GO
-- Uncomment the ALTER DATABASE statement below to set the database to SINGLE_USER mode if the drop database command fails because the database is in use.
-- ALTER DATABASE DatabaseName SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
-- Drop the database if it exists
IF EXISTS (
  SELECT name
   FROM sys.databases
   WHERE name = N'inventory_db'
)
DROP DATABASE inventory_db
GO