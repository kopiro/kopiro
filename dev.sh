#!/bin/bash
set -ex

npm run fetch-data
npm run generate

./node_modules/.bin/serve ./public

while true; do
    fswatch -o ./src ./md ./db
    npm run generate
done
