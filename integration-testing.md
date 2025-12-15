# Тестування: інтеграційне та системне

## 1. Вступ:

Метою даної роботи є вивчення та застосування інтеграційного і системного тестування
для проекту **KSU GiftShop**, який складається з frontend (HTML/CSS/JavaScript),
backend (Flask) та бази даних PostgreSQL.

Інтеграційне тестування дозволяє перевірити коректність взаємодії між окремими модулями системи,
а системне тестування - перевірити роботу всього додатку як єдиного цілого з точки зору
кінцевого користувача.


---

## 2. Теорія:

### Інтеграційне тестування

**Інтеграційне тестування** - це перевірка взаємодії між модулями системи після їх об’єднання.

У даному проєкті інтеграційні тести перевіряють:
- взаємодію між frontend та backend через HTTP-запити;
- роботу backend з базою даних;
- передачу та обробку JWT-токенів.


### Системне тестування (E2E)

**Системне тестування (End-to-End)** - це перевірка повного циклу роботи додатку,
як його використовує реальний користувач.

У даному проєкті системні тести перевіряють:
- логін користувача;
- отримання даних з backend;
- відображення каталогу товарів;
- фільтрацію та сортування;
- вихід з системи.

---

## 3. Інтеграційні тести (Postman):


Для інтеграційного тестування використано інструмент **Postman**.

### Колекція запитів

Колекція містить наступні запити:
1. **POST /users/register** - реєстрація користувача
2. **GET /users/<int:user_id>** - відображення нового користувача
3. **POST /api/login** - логін та отримання JWT-токена
4. **GET /api/products** - отримання списку товарів з авторизацією

### Запит 1: Реєстрація користувача (Backend + БД)

![Postman_test1](image/Postman_test1.jpg)

### Запит 2: Відображення нового користувача

![Postman_test2](image/Postman_test2.jpg)

### Запит 3: Логін користувача (JWT)

![Postman_test3](image/Postman_test3.jpg)

### Запит 4: Отримання каталогу товарів (авторизація + БД)

![Postman_test4](image/Postman_test4.jpg)

### Запуск колекції: Run Collection - Assert all (перевірка всіх тестів).

![run](image/run.jpg)

---

## 4. Системні тести (Cypress):

(корінь проекту)/cypress/e2e/ souvenir-shop.cy.js:

```js
describe('Souvenir Shop E2E Tests', () => {

    it('Повний цикл: логін, каталог, фільтр, вихід', () => {
		
// Arrange: відкрити сайт
        cy.visit('http://localhost:3000/index.html');
		
        // Act: логін
        cy.get('#login_username').type('admin');
        cy.get('#login_password').type('adminadmin');
		cy.get('#loginForm button[type="submit"]').click();
		
        // Assert: каталог відкрився
        cy.get('#catalog').should('be.visible');
        cy.get('#items').children().should('have.length.greaterThan', 0);
		
        // Act: фільтрація
        cy.contains('Одяг').click();
		
        // Assert: товари відфільтровані
        cy.get('#items').children().should('exist');
		
        // Act: сортування за ціною
        cy.get('#sort-price').click();
		
        // Assert: каталог все ще відображається
        cy.get('#items').should('be.visible');
		
        // Act: вихід
        cy.get('.logout-btn').click();
		
        // Assert: повернення на логін
        cy.get('#login').should('be.visible');
    });

    it('Помилка логіну з неправильними даними', () => {
        
        cy.visit('http://localhost:3000/index.html');

        cy.get('#login_username').type('qweasdzxc');
        cy.get('#login_password').type('qweasdzxc');
        cy.get('#loginForm button[type="submit"]').click();

        // Перевірка повідомлення про помилку
        cy.on('window:alert', (text) => {
            expect(text).to.contains('Невірний логін або пароль');
        });

        // Логін форма лишається видимою
        cy.get('#login').should('be.visible');
    });
});
```

### Запуск:
```cmd
npx cypress run
```

```cmd
npx cypress open
```

* Результат:
![npx_cypress_run](image/npx_cypress_run.jpg)

---

## 5. Висновки:

Інтеграційні тести підтвердили коректну взаємодію між frontend, backend та базою даних.
Системні (E2E) тести показали, що додаток стабільно працює з точки зору кінцевого користувача.

Отримані результати свідчать про коректну архітектуру додатку та готовність системи
до подальшого розвитку і розширення функціоналу.
