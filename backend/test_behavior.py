from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time

# Set up the WebDriver options
chrome_options = Options()
chrome_options.add_argument("--headless")  # Run headlessly (no GUI)
chrome_options.add_argument("--no-sandbox")  # Required for Docker environments
chrome_options.add_argument("--disable-dev-shm-usage")  # Required for Docker environments

# URL of your app (change to your actual login page)
login_url = "http://localhost:4000/login"
home_url = "http://localhost:4000/home"  # URL to check for successful login

# Start the Selenium WebDriver (Remote for Docker or local Chrome)
driver = webdriver.Remote(
    command_executor="http://selenium:4444/wd/hub",  # Update based on your Docker network setup
    options=chrome_options
)

# Open the login page
driver.get(login_url)

# Locate and fill in the login form (adjust to your app's form)
try:
    username_field = driver.find_element(By.ID, "username")  # Replace with actual ID
    password_field = driver.find_element(By.ID, "password")  # Replace with actual ID
    login_button = driver.find_element(By.ID, "login_button")  # Replace with actual ID

    # Provide login credentials (use real credentials)
    username_field.send_keys("test_user")
    password_field.send_keys("test_password")
    login_button.click()

    # Wait for the page to load (you can adjust the wait time)
    time.sleep(3)  # Adjust sleep time based on your app's response time

    # Check if the current URL matches the home page (indicating a successful login)
    if driver.current_url == home_url:
        print("Test passed: Successfully redirected to home page.")
    else:
        print("Test failed: Did not redirect to home page.")

except Exception as e:
    print(f"An error occurred: {e}")

finally:
    # Close the browser
    driver.quit()