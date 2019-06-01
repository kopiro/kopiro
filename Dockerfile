FROM node:10
WORKDIR /app
VOLUME /app/db
RUN npm -g install yarn
COPY package.json yarn.lock ./
RUN yarn install && yarn cache clean
COPY . ./
ENTRYPOINT [ "yarn", "run", "prod" ]