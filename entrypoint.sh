#!/bin/sh

set -ex

if [ ! -f /app/vendor/autoload.php ]; then
	composer install
	composer dump-autoload
fi

(while (true); do
	php /app/update.php
	sleep 3600
done) &

if [ "$DEV" = "1" ]; then
	echo "set \$no_cache 1;" > /etc/nginx/microcache.conf;
else
	echo "set \$no_cache 0;" > /etc/nginx/microcache.conf;
fi

supervisord -c /etc/supervisor/conf.d/supervisord.conf