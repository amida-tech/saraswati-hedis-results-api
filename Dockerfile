FROM node:18.19.0-bookworm-slim

WORKDIR /app

COPY ./package.json .
COPY ./yarn.lock .
COPY .env.example /app/.env 
COPY ./src ./src
COPY ./initialize ./initialize

RUN yarn
EXPOSE 4000
CMD [ "yarn", "start" ]