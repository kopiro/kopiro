#!/bin/sh
if [ "$REBUILD" == "1" ]; then
	composer install
fi
supervisord -c /etc/supervisor/conf.d/supervisord.conf