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

![DB diagram](Diagram/dbdiagram.png)


dbdiagram.io-код:

```sql
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
