import { generateTestReport } from '../exports/member-report';

const generateTest = async () => {
  try {
    generateTestReport();
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  generateTest,
};
