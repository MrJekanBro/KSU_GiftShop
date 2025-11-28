# UML-Діаграми для проєкту **KSU GiftShop**
### Автоматизована інформаційна система сувенірної лавки Херсонського державного університету.

---

# 1. Вступ

У рамках проєкту **"KSU GiftShop"** створюється інформаційна система для автоматизації роботи сувенірної лавки ХДУ.  
Система забезпечує облік товарів, управління складськими залишками, оформлення продажів, роботу з постачальниками та генерацію звітів.
Документ містить UML-діаграми, які описують структурну та поведінкову модель системи **KSU GiftShop**.  
Мета діаграм - забезпечити розуміння архітектури, визначити ключові компоненти та показати взаємодію між елементами системи.

UML-діаграми дозволяють:
- візуалізувати структуру системи (класи та зв’язки)
- показати поведінку системи (послідовність взаємодій та стани)
- уникнути непорозумінь у команді
- забезпечити зрозумілу основу для реалізації бази даних та API

---

# 2. UML-діаграми 

## Діаграма класів

```PlantUML
@startuml
' === ENUMS ===
enum UserRole {
  Admin
  Manager
  Seller
  WarehouseWorker
  Supplier
}

' === BASE CLASS ===
class User {
  - id: int
  - fullName: string
  - email: string
  - username: string
  - passwordHash: string
  - role: UserRole

  + login(username, password): bool
  + logout(): void
}

' === ROLES ===
class Admin {
  + manageUsers(): void
  + configureSystem(): void
  + viewSystemLogs(): List<LogRecord>
}

class Manager {
  + generateReport(period): Report
  + viewSales(): List<Sale>
  + controlAssortment(): void
}

class Seller {
  + findProduct(nameOrCode): Product
  + createSale(productList): Sale
  + printReceipt(sale: Sale): void
}

class WarehouseWorker {
  + acceptDelivery(delivery: Delivery): bool
  + updateStock(product: Product, quantity: int): void
  + checkStock(): List<Product>
}

class Supplier {
  - id: int
  - companyName: string
  - contactPerson: string
  - phone: string
  - email: string
  - availableProducts: List<Product>

  + receiveOrder(order: SupplyOrder): bool
  + deliverGoods(): Delivery
}

' === PRODUCT ===
class Product {
  - id: int
  - name: string
  - category: string
  - brand: string
  - price: double
  - quantity: int
  - description: string
  - sku: string
  - imageUrl: string

  + isAvailable(): bool
}

' === SALES ===
class Sale {
  - id: int
  - date: Date
  - items: List<SaleItem>
  - totalPrice: double
  - seller: Seller

  + calculateTotal(): double
}

class SaleItem {
  - product: Product
  - quantity: int
  - unitPrice: double
}

' === DELIVERY / SUPPLY ===
class Delivery {
  - id: int
  - supplier: Supplier
  - dateDelivered: Date
  - items: List<DeliveryItem>

  + totalItems(): int
}

class DeliveryItem {
  - product: Product
  - quantity: int
}

class SupplyOrder {
  - id: int
  - dateCreated: Date
  - items: List<SupplyItem>
  - status: string

  + getTotalQuantity(): int
}

class SupplyItem {
  - product: Product
  - quantity: int
}

' === INHERITANCE ===
User <|-- Admin
User <|-- Manager
User <|-- Seller
User <|-- WarehouseWorker

' Supplier is standalone (not a system user)
' === RELATIONSHIPS ===
Sale "1" *-- "*" SaleItem
SaleItem "*" --> "1" Product

Delivery "1" *-- "*" DeliveryItem
DeliveryItem "*" --> "1" Product

SupplyOrder "1" *-- "*" SupplyItem
SupplyItem "*" --> "1" Product

Supplier "1" --> "*" SupplyOrder : receives
Supplier "1" --> "*" Delivery : delivers

Seller "1" --> "*" Sale : creates
WarehouseWorker "1" --> "*" Delivery : processes

@enduml
```

### Пояснення

- User - базовий клас з ролями.
- Admin / Manager / Seller / WarehouseWorker - спадкоємці, кожний має свої функції.
- Product - основна сутність каталогу.
- Sale та SaleItem - продаж і його позиції.
- Delivery / SupplyOrder - поставки від постачальників.
- Зв’язки включають композицію, агрегацію й асоціації.

---

## Діаграма послідовностей (Use Case: оформлення продажу)

```PlantUML
@startuml
actor Seller

Seller -> System : login()
System --> Seller : auth OK

Seller -> System : findProduct(nameOrCode)
System -> ProductDB : searchProduct()
ProductDB --> System : Product
System --> Seller : showProduct()

Seller -> System : createSale(productList)
System -> Sale : create(productList)
Sale -> Product : updateStock()
Product --> Sale : stock updated

Sale --> System : saleCompleted
System --> Seller : showSaleSummary()

Seller -> ReceiptPrinter : printReceipt(sale)
ReceiptPrinter --> Seller : receiptPrinted
@enduml

```

### Пояснення

- Діаграма показує повний процес оформлення продажу:
- авторизація продавця;
- пошук товару;
- створення продажу;
- оновлення складських залишків;
- друк чека.

---

## Діаграма станів (Product Lifecycle)
```PlantUML
@startuml
[*] --> Created

Created --> InStock : deliveryAccepted
InStock --> LowStock : quantity < threshold
LowStock --> OutOfStock : quantity == 0
OutOfStock --> InStock : restocked

InStock --> Discontinued : archived
LowStock --> Discontinued : archived
OutOfStock --> Discontinued : archived

Discontinued --> [*]
@enduml
```

### Пояснення

- Товар у системі може бути в таких станах:
- Created — щойно доданий
- InStock — в наявності
- LowStock — низький залишок
- OutOfStock — розпродано
- Discontinued — знято з продажу
