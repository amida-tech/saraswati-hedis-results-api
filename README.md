# saraswati-hedis-results-api
The purpose of this API is to ingest HEDIS data from pyspark, save it, and then use it to populate the [Sarawati Dashboard](https://github.com/amida-tech/saraswati-dashboard).

## Set up
1. Make sure you have Postgres set up on your machine; if not and you're on a mac, this [guide](https://www.robinwieruch.de/postgres-sql-macos-setup) might be helpful
2. Run `cp .env.example .env` and change `UNIQUE_NAME_PG_USER` and `UNIQUE_NAME_PG_PASSWD` to your postgres username and password
3. Create a db called `hedisdb` (or whatever you like, just make sure it's specified in your .env file).
4. run `yarn` and then `yarn develop`
5. You can either test the main GET endpoint by [setting up the dashboard](https://github.com/amida-tech/saraswati-dashboard/pull/1) and ensuring that it displays data, or you can hit `localhost:4000/api/v1/measures/` (GET) in postman/browser
