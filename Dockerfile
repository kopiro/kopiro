FROM nginx:stable-alpine
WORKDIR /www
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./build /www