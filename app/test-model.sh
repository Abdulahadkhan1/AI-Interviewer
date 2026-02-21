#!/bin/bash

# Your API key
API_KEY="YOUR_API_KEY_HERE"

# Models to test
models=(
  "gemini-1.5-flash-latest"
  "gemini-1.5-flash"
  "gemini-1.5-pro"
  "gemini-pro"
  "gemini-2.0-flash-exp"
)

echo "Testing models..."
echo "===================="

for model in "${models[@]}"; do
  echo "Testing: $model"
  
  response=$(curl -s -w "\n%{http_code}" -X POST \
    "https://generativelanguage.googleapis.com/v1beta/models/$model:generateContent?key=$API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"contents": [{"parts": [{"text": "hi"}]}]}')
  
  status_code=$(echo "$response" | tail -n 1)
  
  if [ "$status_code" -eq 200 ]; then
    echo "✅ $model - WORKS"
  else
    echo "❌ $model - FAILED (Status: $status_code)"
  fi
  echo ""
done