// Логін
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login_username').value;
    const password = document.getElementById('login_password').value;

    const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('token', data.token);
        document.getElementById('login').style.display = 'none';
        document.getElementById('catalog').style.display = 'block';
        alert("Ви увійшли!");
		loadCatalog();
    } else {
        alert(data.error || "Помилка входу");
    }
});

// Запити з токеном
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

// Завантаження каталогу з БД
async function loadCatalog(category = "all") {
    const response = await apiFetch('http://localhost:5000/api/products');
    const items = await response.json();

    const itemsDiv = document.getElementById('items');
    itemsDiv.innerHTML = '';

    const filteredItems = category === "all" ? items : items.filter(item => item.category === category);

    filteredItems.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('item-card');
        card.innerHTML = `
			<img 
				src="http://localhost:5000/images/products/${item.image_url}" 
				alt="${item.name}"
				class="product-image"
			>
            <h3>${item.name}</h3>
            <p>Ціна: ${item.price} грн</p>
            <p>Кількість: ${item.quantity} шт</p>
			<button>У кошик</button>
        `;
        itemsDiv.appendChild(card);
    });
}

// Фільтр
function filterCatalog(category) {
    loadCatalog(category);
}

let currentSort = {
    price: "desc",
    quantity: "desc"
};

function sortByPrice() {
    const itemsDiv = document.getElementById('items');
    const cards = Array.from(itemsDiv.children);

    currentSort.price = currentSort.price === "asc" ? "desc" : "asc";

    cards.sort((a, b) => {
        const priceA = parseInt(a.querySelector("p").textContent.replace(/\D/g, ""));
        const priceB = parseInt(b.querySelector("p").textContent.replace(/\D/g, ""));

        return currentSort.price === "asc" ? priceA - priceB : priceB - priceA;
    });

    itemsDiv.innerHTML = "";
    cards.forEach(card => itemsDiv.appendChild(card));
}

function sortByQuantity() {
    const itemsDiv = document.getElementById('items');
    const cards = Array.from(itemsDiv.children);

    currentSort.quantity = currentSort.quantity === "asc" ? "desc" : "asc";

    cards.sort((a, b) => {
        const qA = parseInt(a.querySelectorAll("p")[1].textContent.replace(/\D/g, ""));
        const qB = parseInt(b.querySelectorAll("p")[1].textContent.replace(/\D/g, ""));

        return currentSort.quantity === "asc" ? qA - qB : qB - qA;
    });

    itemsDiv.innerHTML = "";
    cards.forEach(card => itemsDiv.appendChild(card));
}

// Вихід
function logout() {
    localStorage.removeItem('token');
    document.getElementById('catalog').style.display = 'none';
    document.getElementById('login').style.display = 'block';
}
