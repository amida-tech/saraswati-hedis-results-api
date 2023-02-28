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
    fullInfo[info.measureType] = info.info;

    // eslint-disable-next-line max-len
    const foundLinkObj = measureLinks.filter((measureLink) => info.measureType.includes(measureLink.measure));
    if (foundLinkObj.length !== 0) {
      const { link } = foundLinkObj[0];
      fullInfo[info.measureType] = { ...fullInfo[info.measureType], link };
    }
  }
  return fullInfo;
};

module.exports = {
  createInfoObject, measureLinks,
};
