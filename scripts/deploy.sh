cd frontend
echo 'REACT_APP_API_URL=http://api.capstone.ian-turner.xyz' > .env
npm i
npm run build
cd ..
rsync -a . --exclude 'frontend/node_modules' root@capstone.ian-turner.xyz:/app
ssh root@capstone.ian-turner.xyz 'cd /app && docker-compose -f docker-compose.prod.yml up -d'
