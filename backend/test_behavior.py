# from selenium import webdriver
# from selenium.webdriver.common.by import By
# from selenium.webdriver.chrome.options import Options
# import time

# # Set up the WebDriver options
# chrome_options = Options()
# chrome_options.add_argument("--headless")  # Run headlessly (no GUI)
# chrome_options.add_argument("--no-sandbox")  # Required for Docker environments
# chrome_options.add_argument("--disable-dev-shm-usage")  # Required for Docker environments

# # URL of your app (change to your actual login page)
# login_url = "http://localhost:4000/login"
# home_url = "http://localhost:4000/calendar"  # URL to check for successful login

# # Start the Selenium WebDriver (Remote for Docker or local Chrome)
# print("Starting WebDriver...")
# driver = webdriver.Remote(options=chrome_options)  # Use webdriver.Remote if using Docker

# # Start test
# print("Starting test...")

# try:
#     print("looking for login")
#     # Open the login page
#     driver.get(login_url)

#     # Wait for the page to load
#     time.sleep(2)
#     print("Page loaded, looking for username")
#     # Locate and fill in the login form
#     username_field = driver.find_element(By.ID, "username")  # Replace with actual ID
#     print("Found username field")
#     password_field = driver.find_element(By.ID, "password")  # Replace with actual ID
#     login_button = driver.find_element(By.ID, "login_button")  # Replace with actual ID

#     # Provide login credentials (use real credentials)
#     username_field.send_keys("test_user")
#     password_field.send_keys("test_password")
#     login_button.click()

#     # Wait for the page to load after login
#     time.sleep(3)  # Adjust sleep time based on your app's response time

#     # Check if the current URL matches the home page (indicating a successful login)
#     if driver.current_url == home_url:
#         print("Test passed: Successfully redirected to home page.")
#     else:
#         print(f"Test failed: Did not redirect to home page. Current URL: {driver.current_url}")

# except Exception as e:
#     print(f"An error occurred: {e}")

# finally:
#     # Close the browser
#     driver.quit()
