/* eslint-env jest */
const {
  getMemberInfo,
} = require('../../src/controllers/member.controller');

jest.mock('../../src/config/dao', () => {
  const originalModule = jest.requireActual('../../src/config/dao');
  return {
    __esModule: true,
    ...originalModule,
    findMeasures: jest.fn(() => []),
  };
});

describe('## member.controller.js', () => {
  describe('Test getMemberInfo', () => {
    it('Should call response.send', async () => {
      const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
      await getMemberInfo({ }, response, jest.fn());
      expect(response.send).toHaveBeenCalled();
    });
  });
});
