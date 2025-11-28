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
