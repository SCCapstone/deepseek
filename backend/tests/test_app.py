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


# generating a random string to use for login details
rand_str = generate_random_string(10)

# storing authentication token
auth_token = None


@pytest.fixture
def client():
    """Set up a test client"""
    print('Setting up client')
    with app.test_client() as client:
        yield client
    print('Tearing down client')


def test_register(client):
    """Testing the user register route"""
    data = {
        'email': '%s@%s.com' % (rand_str, rand_str),
        'username': rand_str,
        'password': rand_str,
    }
    response = client.post('/register', data=json.dumps(data), \
                           headers={'Content-Type': 'application/json'})
    assert response.status_code == 201


def test_login(client):
    """Testing the user login route"""
    data = {
        'username': rand_str,
        'password': rand_str,
    }
    response = client.post('/login', data=json.dumps(data), \
                           headers={'Content-Type': 'application/json'})
    assert response.status_code == 200

    # parsing cookies
    cookies = parse_cookies(response)
    assert 'auth_token' in cookies
    auth_token = cookies['auth_token']