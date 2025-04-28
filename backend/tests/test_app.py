import os
import sys
import json
import random
import string
import pytest
from http.cookies import SimpleCookie

# adding the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app


def generate_random_string(length):
    """
    Helper function to generate random usernames/passwords
    """
    characters = string.ascii_letters + string.digits
    random_string = ''.join(random.choice(characters) for _ in range(length))
    return random_string


def parse_cookies(response):
    """
    Takes in a pytest response and outputs the cookies as a dict
    """
    cookie_string = response.headers.get('Set-Cookie')
    cookies = SimpleCookie()
    cookies.load(cookie_string)
    cookies_dict = {}
    for key, morsel in cookies.items():
        cookies_dict[key] = morsel.value
    return cookies_dict


# generating random strings to use for login details
rand_user1 = generate_random_string(10)
rand_user2 = generate_random_string(10)

# storing authentication tokens
auth_token1 = None
auth_token2 = None

# test event data
test_event = {
    'title': 'Test event',
    'date': '2025-03-20',
    'start_time': '8:30',
    'end_time': '9:00',
}


@pytest.fixture
def client():
    """Set up a test client"""
    with app.test_client() as client:
        yield client


def test_register(client):
    """Testing the /register endpoint"""

    # first user
    data = {
        'email': '%s@test.com' % rand_user1,
        'username': rand_user1,
        'password': rand_user1,
    }
    response = client.post('/register', data=json.dumps(data), \
                           headers={'Content-Type': 'application/json'})
    assert response.status_code == 201
    
    # second user
    data = {
        'email': '%s@test.com' % rand_user2,
        'username': rand_user2,
        'password': rand_user2,
    }
    response = client.post('/register', data=json.dumps(data), \
                           headers={'Content-Type': 'application/json'})
    assert response.status_code == 201


def test_login(client):
    """Testing /login endpoint"""

    # first user
    data = {
        'username': rand_user1,
        'password': rand_user1,
    }
    response = client.post('/login', data=json.dumps(data), \
                           headers={'Content-Type': 'application/json'})
    assert response.status_code == 200

    # parsing cookies
    cookies = parse_cookies(response)
    assert 'auth_token' in cookies
    global auth_token1 # so that we can save auth_token as a global var
    auth_token1 = cookies['auth_token']

    # second user
    data = {
        'username': rand_user2,
        'password': rand_user2,
    }
    response = client.post('/login', data=json.dumps(data), \
                           headers={'Content-Type': 'application/json'})
    assert response.status_code == 200

    # parsing cookies
    cookies = parse_cookies(response)
    assert 'auth_token' in cookies
    global auth_token2 # so that we can save auth_token as a global var
    auth_token2 = cookies['auth_token']


def test_get_my_profile(client):
    """Testing the /get-profile endpoint"""

    # verifying that route works
    client.set_cookie('auth_token', auth_token1)
    response = client.get('/get-profile')
    assert response.status_code == 200

    # verifying that the data is correct
    data = response.get_json()['data']
    assert data['username'] == rand_user1


def test_get_other_profile(client):
    """Testing the /get-profile/<username> endpoint"""

    # testing route
    response = client.get('/get-profile/' + rand_user2)
    assert response.status_code == 200

    # verifying data
    data = response.get_json()['data']
    assert data['username'] == rand_user2


def test_add_event(client):
    """Testing the /add-event endpoint"""
    client.set_cookie('auth_token', auth_token1)
    response = client.post('/add-event', data=json.dumps(test_event), \
                           headers={'Content-Type': 'application/json'})
    assert response.status_code == 201


def test_get_events(client):
    """Testing the /get-events endpoint"""

    # getting user events
    client.set_cookie('auth_token', auth_token1)
    response = client.get('/get-events')
    assert response.status_code == 200
    
    # making sure test event is in events
    data = response.get_json()['data']
    assert len(data) > 0
    assert data[0]['title'] == test_event['title']