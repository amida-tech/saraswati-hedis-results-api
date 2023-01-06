/* eslint-env jest */
const fs = require('fs');
const path = require('path');
const request = require('supertest');

const userProfileBaseURL = 'http://localhost:4000/api/v1/user/profile';
const adminBaseURL = 'http://localhost:4000/api/v1/admin';

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

describe('User Profile Test', () => {
  describe('"GET" - Get User Profile By Email', () => {
    const testUser = {
      ...data[0],
    };
    beforeAll(async () => {
      await request(adminBaseURL).post('/users').query().send(testUser);
    });
    afterAll(async () => {
      await request(adminBaseURL).delete('/users').query({ email: 'TestUser@amida.com' });
    });
    it('should return statusCode 200, status message in Json object to say "Success"', async () => {
      const response = await request(userProfileBaseURL).get('/email').query({ email: testUser.email });
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('Success');
      expect(response.body.message).toBe(`Found user preferences by given email: ${testUser.email}`);
      expect(response.body.userCount).toBe(1);
    });
    it('Message should be "Found users", UserCount Greater than 0, found users equal UserCount', async () => {
      const response = await request(userProfileBaseURL).get('/email').query({ email: testUser.email });
      expect(response.body.message).toBe(`Found user preferences by given email: ${testUser.email}`);
      expect(response.body.userCount).toBe(1);
      expect(response.body.userPrefrence.length === response.body.userCount).toBe(true);
      expect(response.body.userPrefrence.length === 1).toBe(true);
    });
    it('Message should be "USER NOT FOUND", UserCount should equal 0, does not return user when email is not in system', async () => {
      const response = await request(userProfileBaseURL).get('/email').query({ email: 'User@amida.com' });
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe('Failed');
      expect(response.body.message).toBe('USER NOT FOUND');
    });
  });
  describe('"PUT" - Update User Profile By Email', () => {
    const testUser = {
      ...data[0],
    };
    beforeAll(async () => {
      await request(adminBaseURL).post('/users').send(testUser);
    });
    afterAll(async () => {
      await request(adminBaseURL).delete('/users').query({ email: 'TestUser@amida.com' });
    });
    it('should return statusCode 200, status message in Json object to say "Success", with success message', async () => {
      testUser.firstName = 'Amida';
      testUser.lastName = 'Developer';
      testUser.region = 'US - New York';
      testUser.role = 'Test - User';
      testUser.userGroup = 'General';
      testUser.picture = 'https://lh3.googleusercontent.com/ogw/AOh-ky2QAvQ4d3_vPfYmspbP-WSp1QbutpDbIQNf2skw=s32-c-mo';
      testUser.companyName = 'Amida Technology Solutions';

      const userSettings = {
        profileFeatures: {
          starRatingAccess: true,
          ratingsAndTrendsAccess: true,
          predictionsAccess: true,
          tableFiltersAccess: true,
          measureAccess: true,
          healthcareTypes: {
            providersAcesss: true,
            plansAccess: true,
            practitionersAccess: true,
          },
          reportsAccess: {
            memberInfoAccess: false,
            memberPolicyInfoAccess: false,
            reportAccess: false,
          },
        },
        measureList: ['aab', 'adde', 'apme', 'asfe', 'bcs', 'ccs', 'cise', 'col', 'cou'],
        providerList: ['Norton Hill Carecenter', 'Cancer Treatment & Care'],
        plansList: [
          'Health Maintenance Organization (HMO)',
          'Preferred Provider Organization (PPO)',
        ],
        filters: {
          filterClassification: 'Classic',
          filterNames: [
            'Domains of Care',
            'Percent Range',
            'Star Rating',
            'Payors (Payers)',
            'Healthcare Providers',
            'Healthcare Coverages',
            'Healthcare Practitioners',
          ],
        },

      };
      const userPreferences = {
        displayMode: 'dark',
        language: 'EN',
        timezone: 'Eastern Standard Time - (EST)',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '24-Hour',
      };
      testUser.userSettings = userSettings;
      testUser.userPreferences = userPreferences;
      testUser.lastUpdated = new Date(Date.now());

      const response = await request(userProfileBaseURL).put('/').query({ email: testUser.email }).send(testUser);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('Success');
      expect(response.body.message).toBe(`Successful update of user preferences by given email: ${testUser.email}`);

      const changesToUserResponse = await request(userProfileBaseURL).get('/email').query({ email: testUser.email });
      const updatedUser = changesToUserResponse.body.userPrefrence[0];
      expect(updatedUser.firstName).toBe('Amida');
      expect(updatedUser.lastName).toBe('Developer');
      expect(updatedUser.region).toBe('US - New York');
      expect(updatedUser.role).toBe('Test - User');
      expect(updatedUser.userGroup).toBe('General');
      expect(updatedUser.picture).toBe('https://lh3.googleusercontent.com/ogw/AOh-ky2QAvQ4d3_vPfYmspbP-WSp1QbutpDbIQNf2skw=s32-c-mo');
      expect(updatedUser.companyName).toBe('Amida Technology Solutions');
      expect(updatedUser.userSettings).toMatchObject(userSettings);
      expect(updatedUser.userPreferences).toMatchObject(userPreferences);
      expect(updatedUser.userHistory).toMatchObject(testUser.userHistory);
    });
  });
});
