FROM php:7.1-fpm-alpine

WORKDIR /app
ENTRYPOINT entrypoint

RUN set -ex

RUN apk add --no-cache --update \
unzip \
nano \
nginx \
supervisor \
nodejs 

RUN mkdir -p /run/nginx

COPY ./conf/php-fpm-pool.conf /usr/local/etc/php-fpm.d/zzzz-docker.conf
COPY ./conf/php.ini /usr/local/etc/php/php.ini
COPY ./conf/nginx.conf /etc/nginx/nginx.conf
COPY ./conf/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

COPY ./entrypoint.sh /bin/entrypoint

RUN curl -sS -k https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer

COPY composer.json /composer/composer.json
RUN cd /composer && composer install

COPY package.json /node/package.json
RUN cd /node && npm install

COPY . /app
RUN rm -rf /app/vendor && ln -svf /composer/vendor /app/vendor
RUN rm -rf /app/node_modules && ln -svf /node/node_modules /app/node_modules

RUN npm run build

EXPOSE 80