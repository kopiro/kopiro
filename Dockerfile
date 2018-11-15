FROM node:10
WORKDIR /app
ENTRYPOINT [ "npm", "start" ]
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm i
COPY ./routes routes
COPY ./views views
COPY README.md README.md
COPY app.js app.js
COPY server.js server.js
COPY updater.js updater.js