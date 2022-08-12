/* eslint-disable no-underscore-dangle */


const measureLinks = [
  { measure: 'aab', link: 'https://www.ncqa.org/hedis/measures/avoidance-of-antibiotic-treatment-for-acute-bronchitis-bronchiolitis/' },
  { measure: 'adde', link: 'https://www.ncqa.org/hedis/measures/follow-up-care-for-children-prescribed-adhd-medication/' },
  { measure: 'aise', link: 'https://www.ncqa.org/hedis/measures/adult-immunization-status/' },
  { measure: 'apme', link: 'https://www.ncqa.org/hedis/measures/metabolic-monitoring-for-children-and-adolescents-on-antipsychotics/' },
  { measure: 'asfe', link: 'https://www.ncqa.org/hedis/measures/unhealthy-alcohol-use-screening-and-follow-up/' },
  { measure: 'bcse', link: 'https://www.ncqa.org/hedis/measures/breast-cancer-screening/' },
  { measure: 'ccs', link: 'https://www.ncqa.org/hedis/measures/cervical-cancer-screening/' },
  { measure: 'cise', link: 'https://www.ncqa.org/hedis/measures/childhood-immunization-status/' },
  { measure: 'cole', link: 'https://www.ncqa.org/hedis/measures/colorectal-cancer-screening/' },
  { measure: 'cou', link: 'https://www.ncqa.org/hedis/measures/risk-of-continued-opioid-use/' },
  { measure: 'cwp', link: 'https://www.ncqa.org/hedis/measures/appropriate-testing-for-pharyngitis/' },
  { measure: 'dmse', link: 'https://www.ncqa.org/hedis/measures/utilization-of-the-phq-9-to-monitor-depression-symptoms-for-adolescents-and-adults/' },
  { measure: 'drre', link: 'https://www.ncqa.org/hedis/measures/depression-remission-or-response-for-adolescents-and-adults/' },
  { measure: 'dsfe', link: 'https://www.ncqa.org/hedis/measures/depression-screening-and-follow-up-for-adolescents-and-adults/' },
  { measure: 'fum', link: 'https://www.ncqa.org/hedis/measures/follow-up-after-emergency-department-visit-for-mental-illness/' },
  { measure: 'imae', link: 'https://www.ncqa.org/hedis/measures/immunizations-for-adolescents/' },
  { measure: 'pdse', link: 'https://www.ncqa.org/hedis/measures/postpartum-depression-screening-and-follow-up/' },
  { measure: 'pnde', link: 'https://www.ncqa.org/hedis/measures/prenatal-depression-screening-and-followup/' },
  { measure: 'prse', link: 'https://www.ncqa.org/hedis/measures/prenatal-immunization-status/' },
  { measure: 'psa', link: 'https://www.ncqa.org/hedis/measures/non-recommended-psa-based-screening-in-older-men/' },
  { measure: 'uop', link: 'https://www.ncqa.org/hedis/measures/use-of-opioids-from-multiple-providers/' },
  { measure: 'uri', link: 'https://www.ncqa.org/hedis/measures/appropriate-treatment-for-upper-respiratory-infection/' },
];

const createInfoObject = (infoList) => {
  const fullInfo = {};
  for (let i = 0; i < infoList.length; i += 1) {
    const info = infoList[i];
    fullInfo[info._id] = info[info._id];

    const foundLinkObj = measureLinks.filter((measureLink) => info._id.includes(measureLink.measure))
    if (foundLinkObj.length !== 0){
      const link = foundLinkObj[0].link
      fullInfo[info._id] = {...fullInfo[info._id], link}
    }
  }
  return fullInfo;
};

module.exports = {
  createInfoObject, measureLinks,
};
