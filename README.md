# CalendarMedia
CalendarMedia is a unique social web app designed to help users connect through shared events. Instead of focusing on just posts and photos like a more conventional social media, CalendarMedia centers around a user's calendar and their events. This allows the user to discover and share events that friends or nearby users are attending. With CalendarMedia, users can easily create and customize their own events and invite others to join them. The app features an interface where individuals can explore local happenings, from casual gatherings to community festivals. Users can also follow friends to stay updated on their activities. By prioritizing events over traditional social media content, CalendarMedia encourages real-world interactions and helps users make the most of their lives outside of other apps that facilitate exclusively online interaction.

## Development Environment

### About
The dev environment uses [Docker Compose](https://docs.docker.com/compose/)
to start a python server, javascript frontend, and mongodb database.
It creates Docker containers and installs the required packages into
those containers so that all developers will be using the same versions.

### Setup
1. Install and start [Docker](https://docs.docker.com/engine/install/)
2. Clone the repository and navigate to the project directory
3. Run the command `docker compose up`
    - Alternatively, run `docker compose up -d` to start without attaching
    and then run `docker compose logs --follow` to attach to logs
4. To stop the environment press `Ctrl-C` in the terminal
5. To clean the environment run the command `docker system prune -af`
    - Do this to fix any environment issues or after changing package requirements

### Testing
1. Make sure docker container is running
2. Enter the command `docker exec -it deepseek-frontend npx vitest` to test the frontend
    - Testing folder is located at frontend/src/\_\_tests\_\_
3. Enter the command `sh scripts/test_backend.sh` to test the backend
   ![test](assets/backend_testing.gif)

4. The project includes automated Selenium tests located in the `/testing` directory. These tests cover core functionality like user registration, login, event creation, and friend management.

#### Requirements
- Python 3.x
- Firefox browser installed
- Virtual environment (recommended)

#### Running the Tests

**Windows (PowerShell)**
```powershell
cd testing
.\run_tests.ps1
```

**Linux/MacOS**
```bash
cd testing
chmod +x run_tests.sh
./run_tests.sh
```

#### Available Tests
- `test_register.py` - Tests user registration
- `test_registerlogin.py` - Tests registration and login flow with error cases
- `test_createevent.py` - Tests event creation functionality
- `test_profileflow.py` - Tests profile management features
- `test_addfriend.py` - Tests friend request and acceptance flow

### Resources
- [Docker guide](https://docs.docker.com/get-started/docker-overview/)
- [React guide](https://react.dev/)
- [Unit testing in Flask](https://www.digitalocean.com/community/tutorials/unit-test-in-flask)

## Deployment

The application is deployed using the following services:

-   **Frontend:** [Vercel](https://vercel.com/)
-   **Backend:** [Render](https://render.com/)
-   **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas)

### Frontend (Vercel)

1.  Connect your Git repository (e.g., GitHub, GitLab, Bitbucket) to Vercel.
2.  Configure the project settings:
    -   **Framework Preset:** `Vite`
    -   **Build Command:** `npm run build`
    -   **Output Directory:** `build`
    -   **Install Command:** `npm install`
3.  Set up environment variables if needed (e.g., `VITE_API_BASE_URL` pointing to your Render backend URL).
4.  Deploy the project. Vercel will automatically build and deploy upon pushes to the connected branch (e.g., `main`).

### Backend (Render)

1.  Create a new Web Service on Render.
2.  Connect your Git repository.
3.  Configure the service settings:
    -   **Environment:** `Python 3`
    -   **Root Directory:** `backend` (or wherever your backend Dockerfile is located)
    -   **Build Command:** `cd backend && pip install -r requirements.txt`
    -   **Start Command:** `cd backend && gunicorn app:app`
4.  Add environment variables:
    -   `MONGO_URI`: Your MongoDB Atlas connection string.
    -   `MONGO_DBNAME`: The name of your database in Atlas (e.g., `appdb`).
    -   Any other required variables (e.g., `JWT_SECRET`).
5.  Deploy the service. Render will build the Docker image and start the service. Ensure the Dockerfile correctly exposes the port Render expects (usually 10000, but check Render's documentation).

### Database (MongoDB Atlas)

1.  Create a free or paid cluster on [MongoDB Atlas](https://cloud.mongodb.com/).
2.  Configure database access:
    -   Create a database user with read/write privileges to the target database.
    -   Configure network access to allow connections from Render's IP addresses or allow access from anywhere (`0.0.0.0/0`).
3.  Get the connection string (select "Connect" -> "Drivers" and choose the Python driver version). Replace `<password>` with the user's password.
4.  Use this connection string as the `MONGO_URI` environment variable in your Render backend service.
5.  Ensure the text index for the `users` collection is created (should already be called whenever app is built):

## Authors
- Tristan Shillingford (trshillingford@gmail.com)
- Jacob Robertson (jacobr10183@gmail.com)
- Dominic Colin Gaines (dcolingaines@gmail.com)
- Ian Turner (i.r.turner55@gmail.com)
- Joe Zelinsky (jzelinsky1818@gmail.com)
