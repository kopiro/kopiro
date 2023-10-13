#!/bin/bash
set -ex

npm run fetch-data
npm run generate

# When pressing CTRL+C, kill all child processes.
trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT

./node_modules/.bin/serve ./public &

while true; do
    fswatch -o ./src ./md ./db
    npm run generate
done

