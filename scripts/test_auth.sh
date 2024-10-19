echo 'Testing /register:'
curl -X POST 'http://localhost:5000/register' -H 'Content-Type: application/json' \
    -d '{"username": "bobsmith", "password": "bob"}'

echo '\nTesting /login:'
curl -X POST 'http://localhost:5000/login' -H 'Content-Type: application/json' \
    -d '{"username": "bobsmith", "password": "bob"}' -c data/cookies.txt

echo '\nCookies:'
cat data/cookies.txt
