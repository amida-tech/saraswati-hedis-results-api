module.exports = function runAsyncWrapper(callback) {
  return function (req, res, next) { // eslint-disable-line func-names
    callback(req, res, next)
      .catch(next);
  };
};
