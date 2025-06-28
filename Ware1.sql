ALTER DATABASE Ware1
SET MULTI_USER
WITH ROLLBACK IMMEDIATE;

SELECT * FROM Users;
Use Ware1;

INSERT INTO Users ( Username, Email, Role, Password)
VALUES 
( 'JohnDoe', 'john.doe@example.com', 'Admin', 'admin123'),
( 'JaneSmith', 'jane.smith@example.com', 'Manager', 'manager123'),
( 'MikeBrown', 'mike.brown@example.com', 'Client', 'client123'),
( 'AliceGreen', 'alice.green@example.com', 'Client', 'client456'),
( 'BobJohnson', 'bob.johnson@example.com', 'Manager', 'manager456');

select * from categories;

INSERT INTO Categories ( CategoryName) VALUES ( 'Electronics');
INSERT INTO Categories (CategoryName) VALUES ('Clothing');
INSERT INTO Categories (CategoryName) VALUES ('Home Appliances');
INSERT INTO Categories (CategoryName) VALUES ('Furniture');
INSERT INTO Categories (CategoryName) VALUES ('Books');
INSERT INTO Categories (CategoryName) VALUES ('Sports Equipment');
INSERT INTO Categories (CategoryName) VALUES ('Beauty & Personal Care');
INSERT INTO Categories (CategoryName) VALUES ('Toys & Games');
INSERT INTO Categories (CategoryName) VALUES ('Groceries');
INSERT INTO Categories (CategoryName) VALUES ('Office Supplies');

select * from Suppliers;

INSERT INTO Suppliers (SupplierName, ContactInfo) VALUES ('TechWorld Distributors', 'techworld@example.com');
INSERT INTO Suppliers (SupplierName, ContactInfo) VALUES ('FashionHub Pvt Ltd', 'fashionhub@example.com');
INSERT INTO Suppliers (SupplierName, ContactInfo) VALUES ('HomeEssentials Inc.', 'support@homeessentials.com');
INSERT INTO Suppliers (SupplierName, ContactInfo) VALUES ('FurniMakers', 'contact@furnimakers.com');
INSERT INTO Suppliers (SupplierName, ContactInfo) VALUES ('BookVerse Suppliers', 'info@bookverse.com');
INSERT INTO Suppliers (SupplierName, ContactInfo) VALUES ('SportsPro Traders', 'sales@sportspro.com');
INSERT INTO Suppliers (SupplierName, ContactInfo) VALUES ('Glow & Go Cosmetics', 'service@glowgo.com');
INSERT INTO Suppliers (SupplierName, ContactInfo) VALUES ('ToysPlanet', 'hello@toysplanet.com');
INSERT INTO Suppliers (SupplierName, ContactInfo) VALUES ('FreshMart Foods', 'orders@freshmart.com');
INSERT INTO Suppliers (SupplierName, ContactInfo) VALUES ('OfficeBasics Ltd.', 'admin@officebasics.com');


select * from products;
SELECT * FROM USERS;

INSERT INTO Products (ProductName, CategoryID, SupplierID, Quantity, Price, BarCode) 
VALUES ('Smartphone X100', 1, 1, 50, 499.99, '8901234567890');

INSERT INTO Products (ProductName, CategoryID, SupplierID, Quantity, Price, BarCode) 
VALUES ('Men\s Denim Jacket', 2, 2, 100, 79.99, '8901234567891');

INSERT INTO Products (ProductName, CategoryID, SupplierID, Quantity, Price, BarCode) 
VALUES ('Microwave Oven 20L', 3, 3, 30, 149.99, '8901234567892');

INSERT INTO Products (ProductName, CategoryID, SupplierID, Quantity, Price, BarCode) 
VALUES ('Wooden Study Table', 4, 4, 20, 199.99, '8901234567893');

INSERT INTO Products (ProductName, CategoryID, SupplierID, Quantity, Price, BarCode) 
VALUES ('Mystery Novel - The Lost Code', 5, 5, 200, 15.99, '8901234567894');

INSERT INTO Products (ProductName, CategoryID, SupplierID, Quantity, Price, BarCode) 
VALUES ('Yoga Mat Pro 6mm', 6, 6, 75, 25.50, '8901234567895');

INSERT INTO Products (ProductName, CategoryID, SupplierID, Quantity, Price, BarCode) 
VALUES ('Herbal Face Cream 100ml', 7, 7, 120, 12.99, '8901234567896');

INSERT INTO Products (ProductName, CategoryID, SupplierID, Quantity, Price, BarCode) 
VALUES ('Remote Control Car', 8, 8, 60, 34.99, '8901234567897');

INSERT INTO Products (ProductName, CategoryID, SupplierID, Quantity, Price, BarCode) 
VALUES ('Organic Rice 5kg', 9, 9, 90, 18.99, '8901234567898');

INSERT INTO Products (ProductName, CategoryID, SupplierID, Quantity, Price, BarCode) 
VALUES ('Ballpoint Pens - Pack of 10', 10, 10, 300, 5.99, '8901234567899');

select * from Products;