const measureInfo = require('../../initialize/hedis-info.json');

const measureLinks = [];

measureInfo.forEach((measure) => {
  if (!measure.measureTypes.split('').includes('-')) {
    measureLinks.push(
      { measure: measure.measureTypes, link: measure.info.link },
    );
  }
});

const createInfoObject = (infoList) => {
  const fullInfo = {};
  for (let i = 0; i < infoList.length; i += 1) {
    const info = infoList[i];
    fullInfo[info.measureTypes] = info.info;

    // eslint-disable-next-line max-len
    const foundLinkObj = measureLinks.filter((measureLink) => info.measureTypes.includes(measureLink.measure));
    if (foundLinkObj.length !== 0) {
      const { link } = foundLinkObj[0];
      fullInfo[info.measureTypes] = { ...fullInfo[info.measureTypes], link };
    }
  }
  return fullInfo;
};

module.exports = {
  createInfoObject, measureLinks,
};
