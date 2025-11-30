document.getElementById('regForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password_hash = document.getElementById('password_hash').value;
	const role = document.getElementById("role").value;

    try {
        const response = await fetch('http://localhost:5000/users/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username, email, password_hash: password_hash, role})
        });

        if (!response.ok) {
            return alert("Помилка реєстрації");
        }

        document.getElementById('register').style.display = 'none';
        document.getElementById('catalog').style.display = 'block';

        loadCatalog();

    } catch (error) {
        console.error("Помилка:", error);
    }
});

async function loadCatalog() {
    const itemsDiv = document.getElementById('items');

    // Тимчасові дані (до створення API)
    const items = [
        {name: "Брелок ХДУ", price: 60},
        {name: "Кружка ХДУ", price: 120},
        {name: "Футболка ХДУ", price: 350},
        {name: "Наліпка ХДУ", price: 25}
    ];

    itemsDiv.innerHTML = '';

    items.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('item-card');
        card.innerHTML = `
            <h3>${item.name}</h3>
            <p>Ціна: ${item.price} грн</p>
            <button>У кошик</button>
        `;
        itemsDiv.appendChild(card);
    });
}

