export SSH_PRIVATE_KEY=`cat ~/.ssh/github_actions`

act --container-architecture linux/amd64 \
    --secret SSH_PRIVATE_KEY="$SSH_PRIVATE_KEY" \
    --var SERVER_HOSTNAME="capstone.ian-turner.xyz" \
    --var BACKEND_URL="https://api.capstone.ian-turner.xyz" \
    --var FRONTEND_URL="https://capstone.ian-turner.xyz"