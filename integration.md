# Інтеграція frontend та backend

---

## Мета роботи
Навчитися інтегрувати клієнтську (*frontend*) та серверну (*backend*) частини веб-додатку в єдину працюючу систему з використанням HTTP-запитів, системи авторизації через *JWT*, *CORS* та бази даних *PostgreSQL*.

---

## Вступ:

**Frontend** - це клієнтська частина веб-додатку, яка працює в браузері. Вона відповідає за відображення інтерфейсу користувача та обробку його дій (кліки, введення даних у форму тощо).

**Backend** - це серверна частина, яка:
- приймає запити від клієнта,
- обробляє їх,
- взаємодіє з базою даних,
- повертає результати у вигляді JSON.

Для обміну даними між frontend і backend використовується протокол HTTP та методи:

| Метод  | Призначення            |
| ------ | ---------------------- |
| GET    | Отримання даних        |
| POST   | Надсилання нових даних |
| PUT    | Оновлення даних        |
| DELETE | Видалення              |

Для захисту API використовується JWT (JSON Web Token), який передається у заголовку Authorization.

---

### Використані технології:
- Backend: Python + Flask
- Frontend: HTML + CSS + JavaScript
- База даних: PostgreSQL
- ORM: SQLAlchemy
- Авторизація: JWT (JSON Web Token)
- Обмін даними: fetch API
- CORS: flask-cors
- Сервер: localhost:5000

---

## Реалізація **backend** частини

### Файл **models.py**
У файлі створено дві моделі:
- User - користувачі системи
- Product - товари сувенірної крамниці

```python
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True, nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'admin','manager','seller','warehouse','supplier'


class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50))
    brand = db.Column(db.String(50))
    price = db.Column(db.Numeric(10,2), nullable=False)
    quantity = db.Column(db.Integer, default=0)
    description = db.Column(db.Text)
    sku = db.Column(db.String(50), unique=True)
    image_url = db.Column(db.String(255))
```

---

### Файл **app.py**

У файлі реалізовано:
- Підключення БД
- Дозвіл CORS
- Авторизація через JWT
- Захист ендпоінтів
- Отримання списку товарів

```python
from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, User, Product
import jwt
from datetime import datetime, timedelta
from functools import wraps

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:jeka08122005jeka@localhost/souvenir_shop"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

SECRET_KEY = "super-secret-key-2025"

with app.app_context():
    db.create_all()
```

---

Авторизація:
```python
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if user and user.password_hash == password:
        token = jwt.encode(
            {
                'id': user.id,
                'username': user.username,
                'role': user.role,
                'exp': datetime.utcnow() + timedelta(days=1)
            },
            SECRET_KEY,
            algorithm='HS256'
        )
        return jsonify({'token': token}), 200

    return jsonify({'error': 'Невірний логін або пароль'}), 401
```

---

Захист токеном:
```python
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Токен відсутній'}), 401
        try:
            token = token.split(" ")[1]
            jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except:
            return jsonify({'error': 'Токен неправильний'}), 401
        return f(*args, **kwargs)
    return decorated
```

---

## Реалізація frontend частини

### Форма авторизації у **index.html**:

```html
<form id="loginForm">
    <input type="text" id="login_username" placeholder="Логін" required>
    <input type="password" id="login_password" placeholder="Пароль" required>
    <button type="submit">Увійти</button>
</form>
```

---

### Збереження токена у **script.js**:

```JS
localStorage.setItem('token', data.token);
```

---

Функція запитів із токеном:

```JS
function apiFetch(url, options = {}) {
    const token = localStorage.getItem('token');
    return fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
        }
    });
}
```

---

### SQL‑скрипт для додавання товарів до БД:

```SQL
INSERT INTO products (name, category, brand, price, quantity, description, sku, image_url)
VALUES
('Футболка ХДУ', 'одяг', 'CampusWear', 350.00, 12, 'Бавовняна футболка з логотипом', 'TSHIRT001', 'tshirt.jpg'),
('Куртка ХДУ', 'одяг', 'CampusWear', 800.00, 6, 'Тепла куртка з логотипом', 'JACKET001', 'jacket.jpg'),
('Штани ХДУ', 'одяг', 'CampusWear', 600.00, 8, 'Зручні штани з логотипом', 'PANTS001', 'pants.jpg'),
('Светр ХДУ', 'одяг', 'CampusWear', 450.00, 10, 'Вовняний светр з логотипом', 'SWEATER001', 'sweater.jpg'),
('Кросівки ХДУ', 'взуття', 'CampusWear', 1200.00, 4, 'Спортивні кросівки з логотипом', 'SHOES001', 'shoes.jpg'),
('Кеди ХДУ', 'взуття', 'CampusWear', 650.00, 10, 'Кеди для щоденного використання', 'SNEAKERS001', 'sneakers.jpg'),
('Тапочки ХДУ', 'взуття', 'CampusWear', 300.00, 15, 'Домашні тапочки з логотипом', 'SLIPPERS001', 'slippers.jpg'),
('Зошит 32л', 'канцелярія', 'EduSupplies', 10.00, 100, 'Зошит на 32 сторінки', 'NOTEBOOK032', 'notebook32.jpg'),
('Зошит 48л', 'канцелярія', 'EduSupplies', 15.00, 80, 'Зошит на 48 сторінок', 'NOTEBOOK048', 'notebook48.jpg'),
('Ручка ХДУ', 'канцелярія', 'EduSupplies', 5.00, 250, 'Синя кулькова ручка', 'PEN001', 'pen.jpg'),
('Олівець ХДУ', 'канцелярія', 'EduSupplies', 3.00, 300, 'Графітний олівець', 'PENCIL001', 'pencil.jpg'),
('Маркер ХДУ', 'канцелярія', 'EduSupplies', 20.00, 60, 'Маркер для виділення тексту', 'MARKER001', 'marker.jpg'),
('Наліпка ХДУ', 'наліпки', 'SouvenirCo', 15.00, 80, 'Наліпка з логотипом', 'STICKER001', 'sticker.jpg'),
('Набір наліпок', 'наліпки', 'SouvenirCo', 40.00, 45, 'Набір різнокольорових наліпок', 'STICKERSET001', 'stickerset.jpg'),
('Стікери ХДУ', 'наліпки', 'SouvenirCo', 25.00, 70, 'Стікери для записів', 'STICKY001', 'sticky.jpg'),
('Магніт ХДУ', 'магніти', 'SouvenirCo', 35.00, 30, 'Магніт на холодильник', 'MAG001', 'magnet.jpg'),
('Великий магніт ХДУ', 'магніти', 'SouvenirCo', 60.00, 20, 'Великий магніт на холодильник', 'MAG002', 'magnet_big.jpg'),
('Магнітний набір ХДУ', 'магніти', 'SouvenirCo', 80.00, 15, 'Набір магнітів', 'MAGSET001', 'magnetset.jpg'),
('Кружка ХДУ', 'посуд', 'GiftBrand', 120.00, 18, 'Керамічна кружка з логотипом', 'CUP001', 'cup.jpg'),
('Тарілка ХДУ', 'посуд', 'GiftBrand', 200.00, 10, 'Керамічна тарілка з логотипом', 'PLATE001', 'plate.jpg'),
('Чашка ХДУ', 'посуд', 'GiftBrand', 90.00, 25, 'Чашка для чаю з логотипом', 'MUG001', 'mug.jpg'),
('Склянка ХДУ', 'посуд', 'GiftBrand', 70.00, 30, 'Скляна склянка з логотипом', 'GLASS001', 'glass.jpg');
```

---

## Тестування

- форма логіну в браузері
- вхід у систему/ відображення каталогу товарів
- вихід із системи


| Дані коректні | Дані некоректні |
| ---------- | ---------- |
|  |  |


