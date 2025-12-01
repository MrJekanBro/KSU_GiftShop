document.getElementById('regForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const full_name = document.getElementById('full_name').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password_hash = document.getElementById('password_hash').value;
	const role = document.getElementById("role").value;


    try {
        const response = await fetch('http://localhost:5000/users/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ full_name, username, email, password_hash: password_hash, role})
        });

        if (!response.ok) {
            return alert("Помилка реєстрації");
        }

        document.getElementById('register').style.display = 'none';
        document.getElementById('catalog').style.display = 'block';

        loadCatalog('all');

    } catch (error) {
        console.error("Помилка:", error);
    }
});

async function loadCatalog(category = "all") {
    const itemsDiv = document.getElementById('items');

    // Тимчасові дані (до створення API)
    const items = [
		{name: "Футболка ХДУ", price: 350, category: "одяг", quantity: 12},
		{name: "Куртка ХДУ", price: 800, category: "одяг", quantity: 6},

		{name: "Кросівки ХДУ", price: 1200, category: "взуття", quantity: 4},
		{name: "Кеди ХДУ", price: 650, category: "взуття", quantity: 10},

		{name: "Зошит 32л", price: 10, category: "канцелярія", quantity: 100},
		{name: "Ручка ХДУ", price: 5, category: "канцелярія", quantity: 250},

		{name: "Наліпка ХДУ", price: 15, category: "наліпки", quantity: 80},
		{name: "Набір наліпок", price: 40, category: "наліпки", quantity: 45},

		{name: "Магніт ХДУ", price: 35, category: "магніти", quantity: 30},
		{name: "Великий магніт ХДУ", price: 60, category: "магніти", quantity: 20},

		{name: "Кружка ХДУ", price: 120, category: "посуд", quantity: 18},
		{name: "Тарілка ХДУ", price: 200, category: "посуд", quantity: 10},
	];

    itemsDiv.innerHTML = '';

    // Фільтрація
    const filteredItems = category === "all" ? items : items.filter(item => item.category === category);

    filteredItems.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('item-card');
        card.innerHTML = `
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
