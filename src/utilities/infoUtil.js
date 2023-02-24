const measureInfo = require('../../initialize/hedis-info.json');

const measureLinks = [];

measureInfo.forEach((measure) => {
  if (!measure.measureId.split('').includes('-')) {
    measureLinks.push(
      { measure: measure.measureId, link: measure.info.link },
    );
  }
});

const createInfoObject = (infoList) => {
  const fullInfo = {};
  for (let i = 0; i < infoList.length; i += 1) {
    const info = infoList[i];
    fullInfo[info.measureId] = info.info;

    const foundLinkObj = measureLinks
      .filter((measureLink) => info.measureId.includes(measureLink.measure));
    if (foundLinkObj.length !== 0) {
      const { link } = foundLinkObj[0];
      fullInfo[info.measureId] = { ...fullInfo[info.measureId], link };
    }
  }
  return fullInfo;
};

module.exports = {
  createInfoObject, measureLinks,
};
