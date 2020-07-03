-- Select rows from a Table or View 'TableOrViewName' in schema 'SchemaName'
-- Drop the database 'DatabaseName'
-- Connect to the 'master' database to run this snippet
-- Select rows from a Table or View 'TableOrViewName' in schema 'SchemaName'
SELECT ProductName,ProductCode,ProductCategoryName,
    FROM dbo.Products p
    INNER JOIN inventory_db.ProductCategories c ON c.CategoryId = p.CategoryId
GO