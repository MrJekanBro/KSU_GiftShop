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

## Тестування

📸 Скріншот 1 – запуск Flask-сервера
📸 Скріншот 2 – форма логіну в браузері
📸 Скріншот 3 – успішний вхід і збережений токен (DevTools → Application → localStorage)
📸 Скріншот 4 – успішний GET запит (json масив товарів)
📸 Скріншот 5 – відображення каталогу товарів
📸 Скріншот 6 – робота сортування
📸 Скріншот 7 – вихід із системи


