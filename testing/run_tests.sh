#!/bin/bash
set -e

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt

# Install Firefox WebDriver (geckodriver)
GECKODRIVER_VERSION=v0.34.0
GECKODRIVER_URL="https://github.com/mozilla/geckodriver/releases/download/$GECKODRIVER_VERSION/geckodriver-$GECKODRIVER_VERSION-linux64.tar.gz"
wget -O geckodriver.tar.gz $GECKODRIVER_URL
mkdir -p venv/bin
 tar -xzf geckodriver.tar.gz -C venv/bin
rm geckodriver.tar.gz
chmod +x venv/bin/geckodriver
export PATH="$(pwd)/venv/bin:$PATH"

# Run tests
pytest test_addfriend.py test_createevent.py test_profileflow.py test_register.py test_registerlogin.py

# Deactivate virtual environment
deactivate

echo "Tests completed. Press any key to exit..."
read -n 1 -s 