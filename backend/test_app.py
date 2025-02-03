import sys
import os
import pytest
from app import app


sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

@pytest.fixture
def client():
    # creating a test client for the app
    with app.test_client() as client:
        yield client

def test_protected_route(client):
    """Testing a login-protected route"""
    response = client.get('/myprofile')

    # response should return 401 (unauthorized)
    # since we did not provide auth token
    assert response.status_code == 401
