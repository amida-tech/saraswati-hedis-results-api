/* eslint-disable no-underscore-dangle */
const measureInfo = require('../../initialize/hedis-info.json');

let measureLinks = []

measureInfo.forEach((measure) => {
  if (!measure._id.split('').includes('-')) {
    measureLinks.push(
      { "measure": measure._id, "link": measure[measure._id].link}
    )
  }
})

const createInfoObject = (infoList) => {
  const fullInfo = {};
  for (let i = 0; i < infoList.length; i += 1) {
    const info = infoList[i];
    fullInfo[info._id] = info[info._id];

    // eslint-disable-next-line max-len
    const foundLinkObj = measureLinks.filter((measureLink) => info._id.includes(measureLink.measure));
    if (foundLinkObj.length !== 0) {
      const { link } = foundLinkObj[0];
      fullInfo[info._id] = { ...fullInfo[info._id], link };
    }
  }
  return fullInfo;
};

module.exports = {
  createInfoObject, measureLinks,
};
