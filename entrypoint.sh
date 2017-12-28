#!/bin/sh
if [ "$REBUILD" == "1" ]; then
	rm -rf /app/vendor && ln -svf /composer/vendor
	rm -rf /app/node_modules && ln -svf /node/node_modules /app/node_modules
	npm run build
fi
supervisord -c /etc/supervisor/conf.d/supervisord.conf