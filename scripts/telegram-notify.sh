
#!/bin/sh

# Telegram notification script for Scanarr
# This script sends notifications to a Telegram bot

BOT_TOKEN=$1
CHAT_ID=$2
MESSAGE=$3

if [ -z "$BOT_TOKEN" ] || [ -z "$CHAT_ID" ] || [ -z "$MESSAGE" ]; then
  echo "Error: Missing required parameters"
  echo "Usage: telegram-notify.sh <bot_token> <chat_id> <message>"
  exit 1
fi

# URL encode the message
MESSAGE_ENCODED=$(echo "$MESSAGE" | sed 's/ /%20/g; s/!/%21/g; s/"/%22/g; s/#/%23/g; s/\$/%24/g; s/\&/%26/g; s/'\''/%27/g; s/(/%28/g; s/)/%29/g; s/\*/%2A/g; s/+/%2B/g; s/,/%2C/g; s/-/%2D/g; s/\./%2E/g; s/\//%2F/g; s/:/%3A/g; s/;/%3B/g; s//%3C/g; s/=/%3D/g; s/>/%3E/g; s/?/%3F/g; s/@/%40/g; s/\[/%5B/g; s/\\/%5C/g; s/\]/%5D/g; s/\^/%5E/g; s/_/%5F/g; s/`/%60/g; s/{/%7B/g; s/|/%7C/g; s/}/%7D/g; s/~/%7E/g; s/€/%E2%82%AC/g')

# Send notification to Telegram
HTTP_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
  --connect-timeout 30 \
  --max-time 60 \
  --retry 5 \
  --retry-delay 5 \
  --retry-max-time 60 \
  "https://api.telegram.org/bot$BOT_TOKEN/sendMessage?chat_id=$CHAT_ID&text=$MESSAGE_ENCODED&parse_mode=HTML")

# Log the result
if [ "$HTTP_RESPONSE" -eq 200 ]; then
  echo "Successfully sent Telegram notification"
  exit 0
else
  echo "Failed to send Telegram notification. HTTP response code: $HTTP_RESPONSE"
  exit 1
fi
