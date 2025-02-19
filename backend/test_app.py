import sys
import os
import pytest
import random
import string
from app import app, db


sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def generate_random_string(length=10):
    """Generate a random username with the given length."""
    letters_and_digits = string.ascii_letters + string.digits
    return ''.join(random.choice(letters_and_digits) for i in range(length))

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

# Test for creating users, adding them as friends, and then deleting them
def test_add_friend(client):
    # Step 1: Create User 1
    user1 = {
        "password": generate_random_string(20),
        "username": generate_random_string(20)
    }
    response = client.post('/register', json=user1)
    assert response.status_code == 200  # Assuming user creation returns 200

    # Extract the user1 ID from the response
    user1_data = response.get_json()
    user1_id = user1_data['user']['id']  # Use 'id' instead of '_id'
    assert user1_id is not None  # Ensure the user ID was returned

    # Step 2: Create User 2
    user2 = {
        "password": generate_random_string(20),
        "username": generate_random_string(20)
    }
    response = client.post('/register', json=user2)
    assert response.status_code == 200  # Assuming user creation returns 200

    # Extract the user2 ID from the response
    user2_data = response.get_json()
    user2_id = user2_data['user']['id']  # Use 'id' instead of '_id'
    assert user2_id is not None  # Ensure the user ID was returned

    # Step 3: Add User 1 and User 2 as friends
    add_friend_data = {
        "user_id": user1_id,  # Use the extracted 'id' here
        "friend_id": user2_id  # Use the extracted 'id' here
    }
    response = client.post('/friends/add', json=add_friend_data)
    assert response.status_code == 200  # Assuming the add friend returns 200

    # Additional checks can be made to verify the friendship if applicable

    # Step 4: Clean up - Delete User 1
    response = client.delete(f'/users/delete/{user1_id}')
    assert response.status_code == 200  # Assuming user deletion returns 200

    # Step 5: Clean up - Delete User 2
    response = client.delete(f'/users/delete/{user2_id}')
    assert response.status_code == 200  # Assuming user deletion returns 200


@pytest.fixture
def test_event_id():
    # Add a test event to the database
    event_id = db.db.events.insert_one({
        "title": "Test Event",
        "description": "This is a test event."
    }).inserted_id
    yield event_id
    # Clean up the test event
    db.db.events.delete_one({"_id": event_id})

def test_get_event(client, test_event_id):
    response = client.get(f'/events/{test_event_id}')
    assert response.status_code == 200
    assert "Test Event" in response.get_data(as_text=True)

    # Test invalid event_id
    response = client.get('/events/invalid_id')
    assert response.status_code == 400

def test_delete_event(client, test_event_id):
    response = client.delete(f'/events/{test_event_id}')
    assert response.status_code == 200

    # Verify the event is deleted
    response = client.get(f'/events/{test_event_id}')
    assert response.status_code == 404

def test_edit_event(client, test_event_id):
    update_data = {
        "title": "Updated Event Title",
        "description": "This is the updated description."
    }
    response = client.patch(
        f'/events/{test_event_id}',
        json=update_data
    )
    assert response.status_code == 200

    # Verify the event is updated
    response = client.get(f'/events/{test_event_id}')
    assert "Updated Event Title" in response.get_data(as_text=True)

