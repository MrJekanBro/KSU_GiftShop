# Frontend: Інтерфейс користувача

## 1. Вступ

Frontend для проєкту **KSU GiftShop — Сувенірна лавка ХДУ** реалізовано у вигляді простого HTML/CSS/JS-прототипу.  
Мета — показати основні UI-елементи та їх інтеракцію з backend (реєстрація користувача, завантаження каталогу, фільтрація та сортування товарів).

Компоненти:
- Форма реєстрації (поле ФІО, username, email, пароль, роль)
- Каталог товарів (картки товарів)
- Панель фільтрів (категорії)
- Кнопки сортування (ціна, кількість)

---

## 2. Wireframe

**Скріншот Figma / wireframe**: (додайте тут згенерований PNG з Figma або скріншот).  
**Пояснення:** Wireframe — низькодеталізований ескіз, що містить:
- Екран «Реєстрація»: поля для ФІО, username, email, пароль, select для ролі, кнопка «Зареєструватися».
- Екран «Каталог»: панель фільтрів (Всі, Одяг, Взуття, Канцелярія, Наліпки, Магніти, Посуд), кнопки сортування (Ціна, Кількість), сітка карток товарів.

---

## 3. Код

### index.html

```html:disable-run
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Сувенірна лавка ХДУ</title>
    <link rel="stylesheet" href="styles.css" />
</head>
<body>

<header>
    <h1>Сувенірна лавка ХДУ</h1>
</header>

<main>
    <!-- Блок: Реєстрація -->
    <section id="register">
        <h2>Реєстрація</h2>
        <form id="regForm">
            <input type="text" id="full_name" placeholder="ФІО" required />
            <input type="text" id="username" placeholder="Ім'я користувача" required />
            <input type="email" id="email" placeholder="Email" required />
            <input type="password" id="password_hash" placeholder="Пароль" />
            <select id="role">
                <option value="admin">Адмін</option>
                <option value="manager">Менеджер</option>
                <option value="seller">Продавець</option>
                <option value="warehouse">Працівник складу</option>
                <option value="supplier">Постачальник</option>
            </select>

            <button type="submit" class="register-btn">Зареєструватися</button>
        </form>
    </section>

    <!-- Блок: Каталог (показується після реєстрації) -->
    <section id="catalog" style="display:none;">
        <h2>Каталог товарів</h2>

        <div id="filters">
            <!-- Фільтри -->
            <div class="filter-group">
                <button class="filter-btn" onclick="filterCatalog('all')">Всі</button>
                <button class="filter-btn" onclick="filterCatalog('одяг')">Одяг</button>
                <button class="filter-btn" onclick="filterCatalog('взуття')">Взуття</button>
                <button class="filter-btn" onclick="filterCatalog('канцелярія')">Канцелярія</button>
                <button class="filter-btn" onclick="filterCatalog('наліпки')">Наліпки</button>
                <button class="filter-btn" onclick="filterCatalog('магніти')">Магніти</button>
                <button class="filter-btn" onclick="filterCatalog('посуд')">Посуд</button>
            </div>

            <!-- Сортування -->
            <div class="sort-group">
                <button id="sort-price" class="sort-btn" onclick="sortByPrice()">Ціна ↕</button>
                <button id="sort-quantity" class="sort-btn" onclick="sortByQuantity()">Кіл-ть ↕</button>
            </div>
        </div>

        <div id="items"></div>
    </section>

</main>

<script src="script.js"></script>
</body>
</html>
