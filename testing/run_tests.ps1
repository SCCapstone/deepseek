# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
python -m pip install -r requirements.txt

# Install Firefox WebDriver (geckodriver)
$geckodriverUrl = "https://github.com/mozilla/geckodriver/releases/download/v0.34.0/geckodriver-v0.34.0-win64.zip"
$geckodriverZip = "geckodriver.zip"
$geckodriverPath = ".\venv\Scripts"

# Download and extract geckodriver
Invoke-WebRequest -Uri $geckodriverUrl -OutFile $geckodriverZip
Expand-Archive $geckodriverZip -DestinationPath $geckodriverPath -Force
Remove-Item $geckodriverZip

# Add geckodriver to PATH
$env:PATH = "$geckodriverPath;$env:PATH"


# Run all tests by specifying each file manually
pytest test_addfriend.py test_createevent.py test_profileflow.py test_register.py test_registerlogin.py

# Deactivate virtual environment
deactivate

Write-Host "Tests completed. Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown') 