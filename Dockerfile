FROM node:13.10.1-alpine3.11

WORKDIR /app

COPY ./package.json .
COPY ./yarn.lock .
COPY .env.example /app/.env 
COPY ./src ./src

RUN yarn
EXPOSE 4000
CMD [ "yarn", "start" ]