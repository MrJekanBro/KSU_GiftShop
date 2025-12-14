import pytest
from app import app, db, User

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_login_fail(client):
    response = client.post('/api/login', json={
        'username': '',
        'password': ''
    })
    assert response.status_code == 401
    data = response.get_json()
    assert 'error' in data


def test_login_success(client):
    # Дані користувача повинні існувати в БД
    response = client.post('/api/login', json={
        'username': 'admin',
        'password': 'adminadmin'
    })
    assert response.status_code == 200
    data = response.get_json()
    assert 'token' in data
    assert len(data['token']) > 10



def test_get_products_protected(client):
    login_response = client.post('/api/login', json={
        'username': 'admin',
        'password': 'adminadmin'
    })
    token = login_response.get_json()['token']

    response = client.get(
        '/api/products',
        headers={'Authorization': f'Bearer {token}'}
    )

    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
