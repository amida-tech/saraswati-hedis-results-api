const config = require('./config/config');
const winstonInstance = require('./config/winston');
const app = require('./config/express.js');
const { init, findMeasureResults, insertMeasureResults } = require('./config/dao');
const consumer = require('./consumer/consumer');

init().then(() => {
  consumer.kafkaRunner();
  app.listen(config.port, () => {
    winstonInstance.info(`server started on port ${config.port} (${config.env})`, {
      port: config.port,
      node_env: config.env,
    });
    findMeasureResults().then(value => {
      if (value.length === 0) {
        return;
      }
      const sortedList = value.sort((a, b) => b.date - a.date);
      let latestDate = sortedList[0].date;

      const currentDate = new Date();   
      currentDate.setHours(0);
      currentDate.setMinutes(0);
      currentDate.setSeconds(0);
      currentDate.setMilliseconds(0);

      const measureArray = [];
      sortedList.forEach((measure) => {
        if (measure.date.getTime() === latestDate.getTime()) {
          delete measure._id;
          measureArray.push(measure);
        }
      })

      let newResultList = [];
      while(latestDate < currentDate) {
        const newDate = new Date(latestDate.getTime() + (24 * 60 * 60 * 1000));
        for(let i = 0; i < measureArray.length; i += 1) {
          measureArray[i].date = newDate;
          measureArray[i].denominator = Math.floor(Math.random() * 100);
          measureArray[i].numerator = Math.floor(Math.random() * measureArray[i].denominator);
          measureArray[i].value = (measureArray[i].numerator / measureArray[i].denominator) * 100;
          measureArray[i].exclusions = Math.floor(Math.random() * 20);
          measureArray[i].initialPopulation = Math.floor(Math.random() * 200);
          if (measureArray[i].subScores) {
            for(let k = 0; k < measureArray[i].subScores.length; k += 1) {
              const subScore = measureArray[i].subScores[k];
              subScore.date = newDate;
              subScore.denominator = Math.floor(Math.random() * 100);
              subScore.numerator = Math.floor(Math.random() * subScore.denominator);
              subScore.value = (subScore.numerator / subScore.denominator) * 100;
              subScore.exclusions = Math.floor(Math.random() * 20);
              subScore.initialPopulation = Math.floor(Math.random() * 200);
            }
          }
          newResultList.push(JSON.parse(JSON.stringify(measureArray[i])));
        }
        
        latestDate = newDate;
      }
      console.log(newResultList);
      insertMeasureResults(newResultList);
      //console.log(latestDate);
    });
  });
});

module.exports = app;
