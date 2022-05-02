/* eslint-disable no-underscore-dangle */
const createInfoObject = (infoList) => {
  const fullInfo = {};
  for (let i = 0; i < infoList.length; i += 1) {
    const info = infoList[i];
    fullInfo[info._id] = info[info._id];
  }
  return fullInfo;
};

module.exports = {
  createInfoObject,
};
