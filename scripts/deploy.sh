rsync -a . --exclude data --exclude 'frontend/node_modules' root@capstone.ian-turner.xyz:/app
ssh root@capstone.ian-turner.xyz 'cd /app && docker compose down && docker system prune -af && docker compose -f docker-compose.prod.yml up -d'
