#!/bin/bash

# building frontend
cd frontend
npm i

export VITE_API_URL=https://api.capstone.ian-turner.xyz
npm run build

# sending frontend files
rsync -ra ./build/ --exclude node_modules root@capstone.ian-turner.xyz:/frontend/

cd ..

# sending backend files
rsync -ra ./backend/ --exclude __pycache__ ./scripts/start_backend.sh \
    root@capstone.ian-turner.xyz:/backend/

# building and starting docker container
ssh root@capstone.ian-turner.xyz "cd /backend && sh start_backend.sh"