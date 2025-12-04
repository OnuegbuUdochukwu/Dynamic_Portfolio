#!/bin/bash

# AICommit - Generate commit messages using local Ollama
# Usage: ./aicommit.sh [--dry-run]

set -e

# Configuration
OLLAMA_URL="http://localhost:11434"
MODEL="llama3:latest"
DRY_RUN=false

# Parse arguments
if [ "$1" == "--dry-run" ]; then
    DRY_RUN=true
fi

# Check if Ollama is running
echo "🔍 Checking Ollama connection..."
if ! curl -s "${OLLAMA_URL}/api/tags" > /dev/null 2>&1; then
    echo "❌ Error: Ollama is not running on ${OLLAMA_URL}"
    echo "Please start Ollama and try again."
    exit 1
fi
echo "✅ Ollama is running"

# Get git diff
echo "📝 Analyzing staged changes..."
DIFF=$(git diff --cached --no-color)

if [ -z "$DIFF" ]; then
    echo "❌ No staged changes found. Please stage your changes first with 'git add'"
    exit 1
fi

# Show a summary of changes
echo "📊 Changes to commit:"
git diff --cached --stat

# Prepare the prompt
PROMPT="You are an expert at writing concise, clear Git commit messages. Based on the following git diff, generate a single line commit message that:
1. Starts with a verb in imperative mood (e.g., Add, Fix, Update, Remove)
2. Is no longer than 72 characters
3. Clearly describes what changed
4. Follows conventional commits format when appropriate (e.g., 'feat:', 'fix:', 'docs:')

Git diff:
\`\`\`
${DIFF}
\`\`\`

Respond with ONLY the commit message, nothing else. Do not include quotes, explanations, or any other text."

# Call Ollama API
echo ""
echo "🤖 Generating commit message with ${MODEL}..."

RESPONSE=$(curl -s "${OLLAMA_URL}/api/generate" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"${MODEL}\",
    \"prompt\": $(echo "$PROMPT" | jq -Rs .),
    \"stream\": false
  }")

# Extract the generated message
COMMIT_MSG=$(echo "$RESPONSE" | jq -r '.response' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | head -1)

if [ -z "$COMMIT_MSG" ]; then
    echo "❌ Error: Failed to generate commit message"
    echo "Response: $RESPONSE"
    exit 1
fi

echo ""
echo "✨ Generated commit message:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "$COMMIT_MSG"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Dry run mode
if [ "$DRY_RUN" = true ]; then
    echo "🔍 Dry run mode - commit message generated successfully"
    exit 0
fi

# Ask user for confirmation
read -p "Use this commit message? (y/n): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    git commit -m "$COMMIT_MSG"
    echo "✅ Committed successfully!"
else
    echo "❌ Commit cancelled"
    exit 1
fi
