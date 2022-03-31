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
    Returns array of all measures in `measures` colleection

  POST /measures
    Body: Single JSON object of patient data
    Inserts patient data into `measures` colleciton

  POST /measures/bulk
    Body: Array of one or more JSON objects of patient data
    Inserts all patient data into `measures` collection

  GET /measures/info
    Returns a single JSON object of everything in the `hedis_info` collection
