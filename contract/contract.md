Message Queue
  input - Kafka Message
    Topic - found in .ENV, KAFKA_QUEUE
      Body (JSON Array as string) - valid patient CQL results JSON 
    
  Output - MongoDB
    Inserts body of input to the `measures` collection

Restful API
  GET /health-check
    Returns 200 if successful

  GET /measures
    Returns array of all measures in `measures` collection

  POST /measures
    Body: Single JSON object of patient data
    Inserts patient data into `measures` colleciton

  POST /measures/bulk
    Body: Array of one or more JSON objects of patient data
    Inserts all patient data into `measures` collection

  GET /measures/info
    Returns a single JSON object of everything in the `hedis_info` collection

  POST /measures/info
    Body: Array of one or more JSON objects of hedis info for measures
    Inserts each JSON object into the `hedis_info` collection

  GET /measures/predictions
    Returns all data stored in the `model_predictions` collection

  POST /measures/predictions
    Body: Array of one or more JSON objects of model prediction data
    Inserts each JSON object into the `model_predictions` collection

  GET /predictionData/:measure
    Param: Measure code
    Returns data used by time series to generate predictions

  GET /searchResults
    Returns an array of JSON objects from the `measure_results` collection

  POST /storeResults
    Body: Array of one of more JSON objects of results from the CQL processor
    Inserts each JSON object into the `measure_results` collection

  GET /trends
    Returns an array of all calculated trend data for each measure present in the `measure_results` collection