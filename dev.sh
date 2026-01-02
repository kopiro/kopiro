#!/bin/bash

on_exit() {
	kill -9 $server_pid
}
trap SIGTERM on_exit

./node_modules/.bin/serve build &
server_pid=$!

npm run build

fswatch -o src public | while read; do
	npm run build
done