/* eslint-env jest */
const fs = require('fs');
const path = require('path');

const {
  getMembers,
  searchMembers,
  getMemberInfo,
  postBulkMembers,
  postMember,
} = require('../../src/controllers/member.controller');

const data = JSON.parse(fs.readFileSync(`${path.resolve()}/test/resources/bulk-data.json`));

jest.mock('../../src/config/dao', () => {
  const originalModule = jest.requireActual('../../src/config/dao');
  return {
    __esModule: true,
    ...originalModule,
    findMembers: jest.fn(() => []),
    searchMembers: jest.fn(() => []),
    insertMember: jest.fn(() => {}),
    insertMembers: jest.fn(() => []),
  };
});

describe('## member.controller.js', () => {
  describe('Test getMembers function', () => {
    it('Should call response.send', async () => {
      const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
      await getMembers({}, response, jest.fn());
      expect(response.send).toHaveBeenCalled();
    });
  });

  describe('Test getMemberInfo', () => {
    it('Should call response.send', async () => {
      const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
      await getMemberInfo({ }, response, jest.fn());
      expect(response.send).toHaveBeenCalled();
    });
  });

  describe('Test searchMembers', () => {
    it('Should call response.send', async () => {
      const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
      await searchMembers({ }, response, jest.fn());
      expect(response.send).toHaveBeenCalled();
    });
  });

  describe('Test postBulkMembers upload', () => {
    it('Should call response.send', async () => {
      const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
      await postBulkMembers({ body: data }, response, jest.fn());
      expect(response.send).toHaveBeenCalled();
    });
  });

  describe('Test postMember function', () => {
    it('Should call response.send', async () => {
      const response = { send: jest.fn().mockReturnValue(Promise.resolve()) };
      await postMember({ body: data }, response, jest.fn());
      expect(response.send).toHaveBeenCalled();
    });
  });
});
