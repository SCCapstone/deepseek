import sys
import os
import pytest
from app import app, db


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
