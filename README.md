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
2. Enter the command `docker exec -it deepseek-frontend npm test` to test the frontend
    - Testing folder is located at frontend/src/\_\_tests\_\_
3. Enter the command `docker exec -it deepseek-backend pytest` to test the backend

### Resources
- [Docker guide](https://docs.docker.com/get-started/docker-overview/)
- [React guide](https://react.dev/)
- [Unit testing in Flask](https://www.digitalocean.com/community/tutorials/unit-test-in-flask)

## Authors
- Tristan Shillingford (trshillingford@gmail.com)
- Jacob Robertson (jacobr10183@gmail.com)
- Dominic Colin Gaines (dcolingaines@gmail.com)
- Ian Turner (i.r.turner55@gmail.com)
