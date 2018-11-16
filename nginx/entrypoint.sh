#!/bin/sh
set -ex
if [ "$DEV" = "1" ]; then
	echo "set \$no_cache 1;" > /etc/nginx/microcache.conf;
else
	echo "set \$no_cache 0;" > /etc/nginx/microcache.conf;
fi
nginx -g "daemon off;"