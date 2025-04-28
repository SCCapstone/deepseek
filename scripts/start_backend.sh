#!/bin/bash

# cleaning current docker containers
docker stop $(docker ps -aq)
docker system prune -af

# building docker container
docker build . -t deepseek-backend

# starting docker container
docker run -d -p 27017:27017 -p 5000:5000 -v /data/uploads:/uploads:rw -e MONGO_HOST=127.0.0.1 \
    --network="host" -e FLASK_RUN_PORT=5000 -e FRONTEND_URL=https://capstone.ian-turner.xyz \
    -e BACKEND_URL=https://api.capstone.ian-turner.xyz -e UPLOADS_FOLDER=/uploads \
    deepseek-backend waitress-serve --host=0.0.0.0 --port=5000 app:app