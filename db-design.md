# Дизайн бази даних  
Проєкт: **Інформаційна система "Сувенірна лавка ХДУ"**

---

## 1. Вступ

### Опис проєкту  
Система призначена для автоматизації бізнес-процесів сувенірної лавки Херсонського державного університету. Вона забезпечує облік товарів, керування складськими залишками, оформлення продажів, взаємодію з постачальниками, формування звітів та контроль ролей користувачів.

### Вибір типу БД  
Для системи обрано реляційну базу даних **PostgreSQL**, оскільки вона забезпечує:  
- надійність зберігання даних;  
- підтримку зв’язків між сутностями;  
- транзакційність (важливо для продажів та поставок);  
- розширені засоби індексації.

### Мета БД  
Забезпечити структуроване, надійне й безпечне зберігання даних про:  
- товари та їх залишки;  
- користувачів і їх ролі;  
- продажі та їх позиції;  
- постачальників і поставки.

---

## 2. ER-діаграма

![DB diagram](Diagram/dbdiagram.jpg)

---

### dbdiagram.io код:

```dbdiagram
Table Users {
  id int [pk, increment]
  full_name varchar(100)
  email varchar(100) [unique]
  username varchar(50) [unique]
  password_hash varchar(255)
  role enum('admin','manager','seller','warehouse','supplier')
}

Table Products {
  id int [pk, increment]
  name varchar(100)
  category varchar(50)
  brand varchar(50)
  price decimal(10,2)
  quantity int
  description text
  sku varchar(50) [unique]
  image_url varchar(255)
}

Table Sales {
  id int [pk, increment]
  date datetime
  seller_id int [ref: > Users.id]
  total_price decimal(10,2)
}

Table SaleItems {
  id int [pk, increment]
  sale_id int [ref: > Sales.id]
  product_id int [ref: > Products.id]
  quantity int
  unit_price decimal(10,2)
}

Table Suppliers {
  id int [pk, increment]
  company_name varchar(100)
  contact_person varchar(100)
  phone varchar(50)
  email varchar(100)
}

Table SupplyOrders {
  id int [pk, increment]
  supplier_id int [ref: > Suppliers.id]
  date_created datetime
  status varchar(50)
}

Table SupplyItems {
  id int [pk, increment]
  order_id int [ref: > SupplyOrders.id]
  product_id int [ref: > Products.id]
  quantity int
}

Table Deliveries {
  id int [pk, increment]
  supplier_id int [ref: > Suppliers.id]
  date_delivered datetime
}

Table DeliveryItems {
  id int [pk, increment]
  delivery_id int [ref: > Deliveries.id]
  product_id int [ref: > Products.id]
  quantity int
}
```

---

## 3. Нормалізація
### База даних відповідає 3NF.

* 1NF
- усі поля атомарні;
- немає масивів/списків у полях;
- таблиці мають первинні ключі.

* 2NF
- у таблицях із складеним ключем (SaleItems, SupplyItems, DeliveryItems) немає часткових залежностей;
- усі неключові поля залежать від повного PK.

* 3NF
- жодне поле не залежить транзитивно від PK;
- наприклад, у таблиці Products ціна залежить тільки від товару, а не від категорії чи бренду.

---

## 4. Скрипти створення БД (PostgreSQL)

```PostgreSQL

CREATE DATABASE souvenir_shop;
\c souvenir_shop;

-- Таблиця користувачів
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'manager', 'seller', 'warehouse', 'supplier'))
);

-- Таблиця товарів
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    brand VARCHAR(50),
    price NUMERIC(10,2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    sku VARCHAR(50) UNIQUE,
    image_url VARCHAR(255)
);

-- Продажі
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    seller_id INTEGER REFERENCES users(id),
    total_price NUMERIC(10,2) NOT NULL
);

-- Позиції продажів
CREATE TABLE sale_items (
    id SERIAL PRIMARY KEY,
    sale_id INTEGER REFERENCES sales(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL
);

-- Постачальники
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(100),
    contact_person VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(100)
);

-- Замовлення постачальникам
CREATE TABLE supply_orders (
    id SERIAL PRIMARY KEY,
    supplier_id INTEGER REFERENCES suppliers(id),
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50)
);

-- Позиції замовлень
CREATE TABLE supply_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES supply_orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL
);

-- Поставки
CREATE TABLE deliveries (
    id SERIAL PRIMARY KEY,
    supplier_id INTEGER REFERENCES suppliers(id),
    date_delivered TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Позиції поставок
CREATE TABLE delivery_items (
    id SERIAL PRIMARY KEY,
    delivery_id INTEGER REFERENCES deliveries(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL
);

-- Індекси
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_sales_date ON sales(date);
CREATE INDEX idx_supplier_company ON suppliers(company_name);
```

---

## 5. Висновки
### Дизайн бази даних відповідає вимогам UML-діаграм, оскільки:

- класи з UML → стали таблицями;
- зв’язки між класами → перетворилися на зовнішні ключі;
- атрибути класів → відображені як поля таблиць;
- Use Case “Продаж товару” відображений через таблиці Sales і SaleItems.
Проєктована БД забезпечує масштабованість, цілісність даних, нормалізацію та можливість ефективного доступу до даних.

---
