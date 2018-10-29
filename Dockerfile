FROM php:7.1-fpm-alpine

WORKDIR /app
ENTRYPOINT entrypoint
EXPOSE 80

RUN set -ex && apk add --no-cache --update \
unzip \
nano \
nginx \
supervisor

RUN docker-php-ext-install pdo_mysql
RUN mkdir -p /run/nginx && \
mkdir -p /tmp/nginx && \
chown -R www-data:www-data /tmp/nginx && \
chown -R www-data:www-data /var/tmp/nginx && \
chown -R www-data:www-data /var/lib/nginx

RUN curl -sS -k https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer

COPY composer.json composer.json
RUN composer install

COPY ./conf/php-fpm-pool.conf /usr/local/etc/php-fpm.d/zzzz-docker.conf
COPY ./conf/php.ini /usr/local/etc/php/php.ini
COPY ./conf/nginx.conf /etc/nginx/nginx.conf
COPY ./conf/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

COPY ./entrypoint.sh /bin/entrypoint
RUN chmod +x /bin/entrypoint

COPY . .
RUN chown -R www-data:www-data .

RUN composer dump-autoload