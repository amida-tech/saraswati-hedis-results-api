# saraswati-hedis-results-api
The purpose of this API is to ingest HEDIS data from pyspark, save it, and then use it to populate the [Sarawati Dashboard](https://github.com/amida-tech/saraswati-dashboard).

## Set up
1. Make sure you have Mongo set up on your machine; if not follow [this guide](https://docs.mongodb.com/manual/administration/install-community/) to install and get up and runnning.

Or, run `docker pull mongo` and then `docker run -p 27017:27017 mongo` to setup a fast instance.

2. Run `cp .env.example .env` 
4. run `yarn` and then `yarn start`
5. Using postman, hit `POST localhost:4000/api/v1/measures/bulk` with the data in `src/config/seedData.json` to seed the db
6. Using the browser or postman, you can view all of that data with `GET localhost:4000/api/v1/measures/`
7. Using postman, you can also add individual measures with `POST localhost:4000/api/v1/measures/` but that isn't a use case we have currently.

