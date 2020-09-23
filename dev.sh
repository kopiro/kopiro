#!/bin/bash
set -ex

yarn fetch-data
yarn generate

yarn serve ./public

while true; do
    fswatch -o ./src ./md ./db
    yarn generate
done
