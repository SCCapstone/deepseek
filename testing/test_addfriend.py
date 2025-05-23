# Generated by Selenium IDE
import pytest
import time
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

class TestAddfriend():
  def setup_method(self, method):
    self.driver = webdriver.Firefox()
    self.vars = {}
    # Generate unique details for two users
    # Use time to ensure more uniqueness if tests run quickly
    timestamp = int(time.time() * 1000)
    self.vars["user_a_rand"] = f"{timestamp}_a" 
    self.vars["user_b_rand"] = f"{timestamp}_b" 
    self.vars["user_a_email"] = f"user_{self.vars['user_a_rand']}@email.com"
    self.vars["user_a_name"] = f"userA_{self.vars['user_a_rand']}"
    self.vars["user_b_email"] = f"user_{self.vars['user_b_rand']}@email.com"
    self.vars["user_b_name"] = f"userB_{self.vars['user_b_rand']}"
    self.vars["password"] = "testpass123"

  def teardown_method(self, method):
    self.driver.quit()

  def register_user(self, email, username, password):
    self.driver.get("http://localhost:4000/")
    self.driver.set_window_size(1000, 1000)
    # Click Register/Sign up link/button
    try: # Handle both link and button scenarios seen in different tests
      register_element = WebDriverWait(self.driver, 5).until(
          expected_conditions.element_to_be_clickable((By.LINK_TEXT, "Don't have an account? Register"))
      )
    except:
      register_element = WebDriverWait(self.driver, 5).until(
          expected_conditions.element_to_be_clickable((By.CSS_SELECTOR, ".btn:nth-child(2)"))
      )
    register_element.click()
    
    WebDriverWait(self.driver, 5).until(expected_conditions.visibility_of_element_located((By.CSS_SELECTOR, ".mb-2:nth-child(1) > .w-100")))
    # Fill registration form
    self.driver.find_element(By.CSS_SELECTOR, ".mb-2:nth-child(1) > .w-100").send_keys(email)
    self.driver.find_element(By.CSS_SELECTOR, ".mb-2:nth-child(2) > .w-100").send_keys(username)
    self.driver.find_element(By.CSS_SELECTOR, ".mb-2:nth-child(3) > .w-100").send_keys(password)
    self.driver.find_element(By.CSS_SELECTOR, ".btn").click()
    # Wait for dashboard/logged-in state (e.g., profile icon)
    WebDriverWait(self.driver, 10).until(expected_conditions.visibility_of_element_located((By.CSS_SELECTOR, ".mr-3 > svg"))) # Assuming profile icon indicates login
    print(f"Registered {username}")

  def login_user(self, username, password):
      self.driver.get("http://localhost:4000/")
      self.driver.set_window_size(1000, 1000)
      # Click the login button first (first button in the list)
      self.driver.find_element(By.CSS_SELECTOR, ".btn:nth-child(1)").click()
      # Fill login form 
      WebDriverWait(self.driver, 5).until(expected_conditions.visibility_of_element_located((By.CSS_SELECTOR, ".mb-2:nth-child(1) > .w-100"))) # Wait for username field
      self.driver.find_element(By.CSS_SELECTOR, ".mb-2:nth-child(1) > .w-100").send_keys(username)
      self.driver.find_element(By.CSS_SELECTOR, ".mb-2:nth-child(2) > .w-100").send_keys(password)
      self.driver.find_element(By.CSS_SELECTOR, ".btn").click()
      # Wait for dashboard/logged-in state
      WebDriverWait(self.driver, 10).until(expected_conditions.visibility_of_element_located((By.CSS_SELECTOR, ".mr-3 > svg")))
      print(f"Logged in as {username}")

  def logout_user(self):
    # Assuming logout is via profile icon -> logout button
    WebDriverWait(self.driver, 5).until(expected_conditions.element_to_be_clickable((By.CSS_SELECTOR, ".mr-3 > svg"))).click()
    WebDriverWait(self.driver, 5).until(expected_conditions.element_to_be_clickable((By.CSS_SELECTOR, ".p-2:nth-child(3)"))).click() # Assuming logout is 3rd item
    WebDriverWait(self.driver, 5).until(expected_conditions.element_to_be_clickable((By.CSS_SELECTOR, ".btn-danger"))).click() # Confirm logout
    # Wait for login page elements to confirm logout
    WebDriverWait(self.driver, 10).until(expected_conditions.visibility_of_element_located((By.CSS_SELECTOR, ".mb-2:nth-child(1) > .w-100")))
    print("Logged out")


  def test_addfriend(self):
    # 1 & 2. Register User A and Logout
    self.register_user(self.vars["user_a_email"], self.vars["user_a_name"], self.vars["password"])
    self.logout_user()

    # 3 & 4. Register User B and Logout
    self.register_user(self.vars["user_b_email"], self.vars["user_b_name"], self.vars["password"])
    self.logout_user()

    # 5. Login as User A
    self.login_user(self.vars["user_a_name"], self.vars["password"])

    # 6 & 7. Search for User B
    print(f"Searching for {self.vars['user_b_name']}")
    search_input = WebDriverWait(self.driver, 10).until(
        expected_conditions.visibility_of_element_located((By.CSS_SELECTOR, ".rounded-left"))
    )
    search_input.click()
    search_input.send_keys(self.vars["user_b_name"])
    
    # Click the Add button for the found user
    WebDriverWait(self.driver, 10).until(
        expected_conditions.element_to_be_clickable((By.CSS_SELECTOR, ".btn-danger"))
    ).click()

    # 8. Logout User A
    self.logout_user()

    # 9. Login as User B
    self.login_user(self.vars["user_b_name"], self.vars["password"])

    # 10. Click the notification icon in navbar to see friend requests
    WebDriverWait(self.driver, 10).until(
        expected_conditions.element_to_be_clickable((By.CSS_SELECTOR, ".position-relative:nth-child(1) > svg > path"))
    ).click()

    # Click Accept (btn-success) on the friend request
    WebDriverWait(self.driver, 10).until(
        expected_conditions.element_to_be_clickable((By.CSS_SELECTOR, ".btn-success"))
    ).click()

    # Click outside to close the notification dropdown (based on test_freindass.py)
    self.driver.find_element(By.CSS_SELECTOR, ".position-fixed:nth-child(2)").click()

    # Optional: Verify by checking friends list
    WebDriverWait(self.driver, 10).until(
        expected_conditions.element_to_be_clickable((By.CSS_SELECTOR, "a:nth-child(3) > img"))
    ).click()
    
    WebDriverWait(self.driver, 10).until(
        expected_conditions.element_to_be_clickable((By.CSS_SELECTOR, ".w-100:nth-child(3)"))
    ).click()

    # Optional: Verify friend is in the list
    time.sleep(1)  # Give the friends list a moment to load
    
    # Optional: Logout
    # self.logout_user() 