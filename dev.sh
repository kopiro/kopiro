#!/bin/bash

on_exit() {
	if [ -n "$server_pid" ] && kill -0 "$server_pid" 2>/dev/null; then
		kill -9 "$server_pid"
	fi
}
trap on_exit SIGTERM EXIT

./node_modules/.bin/serve build &
server_pid=$!

npm run build

fswatch -o ./press ./img ./src ./media ./script.js ./style.css ./img | while read; do
	npm run build
done
