import os
import sys

# adding the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from app import app


@pytest.fixture
def client():
    """Set up a test client"""
    print('Setting up client')
    with app.test_client():
        yield client
    print('Tearing down client')