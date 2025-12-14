// Мок localStorage для Jest (Node.js)
global.localStorage = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, value) { this.store[key] = value.toString(); },
  removeItem(key) { delete this.store[key]; },
  clear() { this.store = {}; }
};

global.fetch = jest.fn();

function apiFetch(url) {
    const token = localStorage.getItem('token');
    return fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res => res.json());
}

test('apiFetch додає токен у заголовок', async () => {
    localStorage.setItem('token', 'fake-token');

    fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true })
    });

    const result = await apiFetch('http://test.com/api');

    expect(fetch).toHaveBeenCalledWith(
        'http://test.com/api',
        { headers: { 'Authorization': 'Bearer fake-token' } }
    );
    expect(result.success).toBe(true);
});

test('логін без пароля викликає помилку', async () => {
    const login = async (username, password) => {
        if (!password) {
            throw new Error('Пароль обовʼязковий');
        }
        return { token: '123' };
    };

    await expect(login('user', '')).rejects.toThrow('Пароль обовʼязковий');
});
