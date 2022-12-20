/* eslint-env jest */
const fs = require('fs');
const path = require('path');
const request = require('supertest');

const userBaseURL = 'http://localhost:4000/api/v1/user/profile';
const adminBaseURL = 'http://localhost:4000/api/v1/admin';
const {
  getUserProfileByEmail,
  updateUserProfile,
} = require('../../src/controllers/profile.controller');

const data = JSON.parse(fs.readFileSync(`${path.resolve()}/test/testUser-data/testUsers.json`));

jest.mock('../../src/config/dao', () => {
  const originalModule = jest.requireActual('../../src/config/dao');
  return {
    __esModule: true,
    ...originalModule,
    getUsers: jest.fn(() => []),
    addUsers: jest.fn(() => []),
    getUsersByEmail: jest.fn(() => {}),
    getUsersByID: jest.fn(() => []),
    updateUserByEmail: jest.fn(() => []),
  };
});

describe('Admin Routes Test', () => {
  describe('"GET"- Get All Users', () => {
    const testUser = {
      ...data[0],
    };
    beforeAll(async () => {
      await request(adminBaseURL).post('/users').send(testUser);
    });
    afterAll(async () => {
      await request(adminBaseURL).delete('/users').query({ email: 'TestTest@amida.com' });
    });
    it('should return statusCode 200, status message in Json object to say "Success"', async () => {
      const response = await request(adminBaseURL).get('/users');
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('Success');
    });
    it('Message should be "Found users", UserCount Greater than 0, found users equal UserCount', async () => {
      const response = await request(adminBaseURL).get('/users');
      expect(response.body.message).toBe('Found users');
      expect(response.body.userCount).toBeGreaterThan(0);
      expect(response.body.users.length === response.body.userCount).toBe(true);
      expect(response.body.users.length >= 1).toBe(true);
    });
  });
  describe('"GET"- Get User By Email', () => {
    const testUser = {
      ...data[0],
    };
    beforeAll(async () => {
      await request(adminBaseURL).post('/users').query().send(testUser);
    });
    afterAll(async () => {
      await request(adminBaseURL).delete('/users').query({ email: 'TestTest@amida.com' });
    });
    it('should return statusCode 200, status message in Json object to say "Success"', async () => {
      const response = await request(adminBaseURL).get('/users/email').query({ email: testUser.email });
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('Success');
    });
    it('Message should be "Found users", UserCount Greater than 0, found users equal UserCount', async () => {
      const response = await request(adminBaseURL).get('/users/email').query({ email: testUser.email });
      expect(response.body.message).toBe(`Found user by given email: ${testUser.email}`);
      expect(response.body.userCount).toBe(1);
      expect(response.body.user.length === response.body.userCount).toBe(true);
      expect(response.body.user.length === 1).toBe(true);
    });
  });
  describe('"PUT"- Update User By Email', () => {
    const testUser = {
      ...data[0],
    };
    beforeAll(async () => {
      await request(adminBaseURL).post('/users').query().send(testUser);
    });
    afterAll(async () => {
      await request(adminBaseURL).delete('/users').query({ email: 'TestTest@amida.com' });
    });
    it('should return statusCode 200, status message in Json object to say "Success", with success message', async () => {
      testUser.firstName = 'Amida';
      testUser.lastName = 'Developer';
      testUser.updated_on = new Date();

      const response = await request(adminBaseURL).put('/users').send(testUser);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('Success');
      expect(response.body.message).toBe(`Successful update of user by given email: ${testUser.email}`);

      const responseChanges = await request(adminBaseURL).get('/users/email').query({ email: testUser.email });
      const updatedUser = responseChanges.body.user[0];

      expect(updatedUser.firstName).toBe('Amida');
      expect(updatedUser.lastName).toBe('Developer');
      expect(updatedUser.updated_on).toBeLessThan(Date.now());
    });
  });
  describe('"POST"- Add User By Email', () => {
    const testUser = {
      ...data[0],
    };
    afterAll(async () => {
      await request(adminBaseURL).delete('/users').query({ email: 'TestTest@amida.com' });
    });
    it('should return statusCode 200, status message in Json object to say "Success", with success message', async () => {
      const response = await request(adminBaseURL).post('/users').query().send(testUser);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('Success');
      expect(response.body.message).toBe(`User registration to database with given email: ${testUser.email}`);

      const responseChanges = await request(adminBaseURL).get('/users/email').query({ email: testUser.email });
      const updatedUser = responseChanges.body.user[0];

      expect(updatedUser.email).toBe('TestTest@amida.com');
      expect(updatedUser.firstName).toBe('Test');
      expect(updatedUser.lastName).toBe('Test');
      expect(updatedUser.role).toBe('Test - Test - SuperAdmin');
      expect(updatedUser.companyName).toBe('Amida Technology Solutions');
      expect(updatedUser.active).toBe(true);
    });
  });
  describe('"DELETE"- Delete User By Email', () => {
    const testUser = {
      ...data[0],
    };
    beforeAll(async () => {
      await request(adminBaseURL).post('/users').query().send(testUser);
    });
    it('should return statusCode 200, status message in Json object to say "Success", with delete message', async () => {
      const response = await request(adminBaseURL).delete('/users').query({ email: 'TestTest@amida.com' });
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('Success');
      expect(response.body.message).toBe('USER DELETED SUCCESSFULLY');
    });
    it('should return statusCode 200, status message in Json object to say "Success", with delete message', async () => {
      await request(adminBaseURL).delete('/users').query({ email: 'TestTest@amida.com' });
      const response = await request(adminBaseURL).get('/users/email').query({ email: testUser.email });
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('Failed');
      expect(response.body.message).toBe(`No found user by given email: ${testUser.email}`);
      expect(response.body.userCount).toBe(0);
      expect(response.body.user.length).toBe(0);
    });
  });
});