# UML-Діаграми для проєкту **KSU GiftShop**
Автоматизована інформаційна система сувенірної лавки Херсонського державного університету.

---

# 1. Вступ

Документ містить UML-діаграми, які описують структурну та поведінкову модель системи **KSU GiftShop**.  
Мета діаграм — забезпечити розуміння архітектури, визначити ключові компоненти та показати взаємодію між елементами системи.

UML-діаграми дозволяють:
- візуалізувати структуру проєкту;
- уникнути непорозумінь у команді;
- спростити подальшу розробку (БД, API, бекенд-класи).

---

# 2. Діаграма класів

## 2.1. PlantUML-код

```plantuml
@startuml
class User {
  - id: int
  - name: string
  - role: string
  + login()
  + logout()
}

class Product {
  - id: int
  - name: string
  - price: double
  - quantity: int
  + updateQuantity()
}

class Order {
  - id: int
  - date: datetime
  - totalPrice: double
  + calculateTotal()
}

class Supplier {
  - id: int
  - name: string
  - contact: string
  + sendSupply()
}

class StockEntry {
  - id: int
  - quantity: int
  - date: datetime
  + registerSupply()
}

User "1" --> "*" Order : оформлює >
Order "*" -- "*" Product : містить >
Supplier "1" -- "*" StockEntry : < постачає
Product "1" --> "*" StockEntry : входить у >
@enduml




# UML-діаграми  
**Проєкт:** Інформаційна система сувенірної лавки Херсонського державного університету  
**Назва:** KSU GiftShop

---

## 1. Вступ

У рамках проєкту "KSU GiftShop" створюється інформаційна система для автоматизації роботи сувенірної лавки ХДУ.  
Система забезпечує облік товарів, управління складськими залишками, оформлення продажів, роботу з постачальниками та генерацію звітів.

**Мета UML-діаграм:**  
- візуалізувати структуру системи (класи та зв’язки),  
- показати поведінку системи (послідовність взаємодій та стани),  
- спростити комунікацію та подальшу розробку,  
- забезпечити зрозумілу основу для реалізації бази даних та API.

---

## 2. Діаграма класів

### 🔹 Зображення (PlantUML код)

```plantuml
@startuml
enum UserRole {
  Admin
  Manager
  Seller
  WarehouseWorker
  Supplier
}

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

User <|-- Admin
User <|-- Manager
User <|-- Seller
User <|-- WarehouseWorker

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
