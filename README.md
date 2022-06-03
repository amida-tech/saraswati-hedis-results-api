# saraswati-hedis-results-api
The purpose of this API is to ingest HEDIS data from pyspark, save it, and then use it to populate the [Sarawati Dashboard](https://github.com/amida-tech/saraswati-dashboard).

## Set up
1. Make sure you have Mongo set up on your machine; if not follow [this guide](https://docs.mongodb.com/manual/administration/install-community/) to install and get up and runnning.

Or, run `docker pull mongo` and then `docker run -d --name=mongo --network cp-all-in-one-community_default -p 27017:27017 mongo` to setup a fast instance.

2. Run `cp .env.example .env` 
3. Run `yarn` and then `yarn start`
4. Run `node test-data-generator.js -d 30`

Or, using postman, hit `POST localhost:4000/api/v1/measures/bulk` with the data in `test/seed-data` folder to seed the db

5. Using the browser or postman, you can view all of that data with `GET localhost:4000/api/v1/measures/`
6. Using postman, you can also add individual measures with `POST localhost:4000/api/v1/measures/` but that isn't a use case we have currently.
7. You can search for individual results using any combination of the parameters for `GET localhost:4000/api/v1/measures/search?measurementType=<type>&memberId=<id>`
8. To add the measure results, copy the JSON from `test/result-data/measure-results.json` place in the body for `POST http://localhost:4000/api/v1/measures/storeResults`
9. After measure results are created predicition data can be created through `saraswati-time-series` with `GET http://localhost:5050/get_predictions/<measure>`
10. Metadata will be automatically pushed to the mongo collection on start-up.  To refresh your data stop HeRA, drop the `hedis_info` collection, and then restart HeRA. To do that manually go to `initialize/hedis-info.json` for the body and `POST http://localhost:4000/api/v1/measures/info`

## Red Panda or Kafka
Due to recent changes, you need to run this event streaming.

`docker run -d --pull=always --name=redpanda1 --network cp-all-in-one-community_default -p 9092:9092 -p 9644:9644 docker.vectorized.io/vectorized/redpanda:latest redpanda start --overprovisioned --smp 1 --memory 1G --reserve-memory 0M --node-id 0 --check=false`

If you have issues, try using the advertised endpoints (normally these would go into a config file but dev purposes, it's fine):
`docker run -d --pull=always --name=redpanda1 --network cp-all-in-one-community_default -p 9092:9092 -p 9644:9644 docker.vectorized.io/vectorized/redpanda:latest redpanda start --overprovisioned --smp 1 --memory 1G --reserve-memory 0M --node-id 0 --check=false --kafka-addr "PLAINTEXT://0.0.0.0:29092,OUTSIDE://0.0.0.0:9092" --advertise-kafka-addr "PLAINTEXT://redpanda1:29092,OUTSIDE://redpanda1:9092"`
