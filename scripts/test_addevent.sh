#!/bin/bash

# Base URL of your API
BASE_URL="http://localhost:5000"

# Event data to be sent in the request
EVENT_DATA=$(cat <<EOF
{
  "user_id": 1,
  "title": "Team Meeting",
  "description": "Discuss the project roadmap.",
  "start_time": "2024-12-02T14:00:00",
  "end_time": "2024-12-02T15:00:00",
  "visibility": true,
  "comments": ["Looking forward to it!", "Don't forget to bring the reports."]
}
EOF
)
echo "hello"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -d "$EVENT_DATA" \
  "$BASE_URL/addevent")

# Extract the HTTP status code
HTTP_STATUS=$(echo "$RESPONSE" | grep -oP '(?<=HTTP_STATUS:)\d+')

RESPONSE_BODY=$(echo "$RESPONSE" | sed -e 's/HTTP_STATUS:[0-9]\+//')

echo "Status Code: $HTTP_STATUS"
echo "Response Body: $RESPONSE_BODY"

if [ "$HTTP_STATUS" -eq 201 ]; then
  echo "Event added successfully."
else
  echo "Failed to add event."
fi
