# DeepSeek
### Development Environment
To start the development environment, first install
[Docker](https://www.docker.com/), start it,
then run (in the project directory) the command
```
docker compose up
```
To stop it, use Ctrl-C, and then run
```
docker compose down
```
If any changes are made to `requirements.txt` or `Dockerfile`,
then remove the image before rebuilding it by using
```
docker image rm IMAGE_NAME
```
You can get a list of all images by running
```
docker image ls
```
and a list of all containers by running
```
docker ps -a
```
You can clear all containers and images by running
```
docker system prune -af
```
This is useful if you want to clean and restart the environment.

All of these commands may have to be run using `sudo` in Linux.
