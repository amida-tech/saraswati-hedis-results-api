const measureInfo = require('../../initialize/hedis-info.json');

const measureLinks = [];

measureInfo.forEach((measure) => {
  if (!measure.measureType.split('').includes('-')) {
    measureLinks.push(
      { measure: measure.measureType, link: measure.info.link },
    );
  }
});

const createInfoObject = (infoList) => {
  const fullInfo = {};
  for (let i = 0; i < infoList.length; i += 1) {
    const info = infoList[i];
    // eslint-disable-next-line no-underscore-dangle
    const measureType = info._id;
    fullInfo[measureType] = info[measureType];

    // eslint-disable-next-line max-len
    const foundLinkObj = measureLinks.filter((measureLink) => measureType === measureLink.measure);
    if (foundLinkObj) {
      const { link } = foundLinkObj;
      fullInfo[measureType] = { ...fullInfo[measureType], link };
    }
  }
  return fullInfo;
};

module.exports = {
  createInfoObject, measureLinks,
};
