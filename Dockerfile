FROM node:16.14.2-alpine3.15

WORKDIR /app

COPY ./package.json .
COPY ./yarn.lock .
COPY .env.example /app/.env 
COPY ./src ./src

RUN yarn
EXPOSE 4000
CMD [ "yarn", "start" ]