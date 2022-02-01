function getDelimiter(kafkaBrokers) {
    let arrayDelimiter = ' ';
    if (kafkaBrokers.includes(', ')) {
      arrayDelimiter = ', ';
    } else if (kafkaBrokers.includes(',')) {
      arrayDelimiter = ',';
    }
    return arrayDelimiter;
  }
  
  module.exports = {getDelimiter};