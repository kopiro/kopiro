FROM node:10
WORKDIR /app
VOLUME /app/db
RUN npm -g install yarn
COPY package.json yarn.lock ./
RUN yarn install
COPY . ./
RUN yarn build
ENTRYPOINT [ "yarn", "run", "prod" ]