#!/bin/sh

if [ "$REBUILD" == "1" ]; then
	composer install
	composer dump-autoload
fi

(while (true); do
	php /app/update.php
	sleep 3600
done) &

supervisord -c /etc/supervisor/conf.d/supervisord.conf