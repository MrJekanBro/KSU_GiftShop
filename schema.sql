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
