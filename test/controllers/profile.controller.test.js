/* eslint-env jest */
const fs = require('fs');
const path = require('path');
const request = require('supertest');

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

describe('Admin Routes Test', () => {
  describe('"GET"- Get User Profile By Email', () => {
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
  describe('"PUT"- Update User Profile By Email', () => {
    const testUser = {
      ...data[0],
    };
    beforeAll(async () => {
      await request(adminBaseURL).post('/users').query().send(testUser);
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
            'Payors (Payers)',
            'Healthcare Providers',
            'Healthcare Coverages',
            'Healthcare Practitioners',
          ],
        },
        starRatingAccess: true,
        profileFeatures: {
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
      };
      const userPreferences = {
        displayMode: 'dark',
        language: 'EN',
        timezone: 'Eastern Standard Time - (EST)',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '24-Hour',
      };
      const userHistory = {
        lastFilters: [],
        reportsGenerated: [],
        notifications: [
          {
            title: 'New Custom Measure added',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
            date: '2023-01-04T20:58:58.947Z',
          },
          {
            title: 'Setup - Incomplete',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
            date: '2023-01-04T20:58:58.947Z',
          },
          {
            title: 'You"ve been added to a new user group',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
            date: '2023-01-04T20:58:58.947Z',
          },
          {
            title: 'Your User Profile has been changed',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
            date: '2023-01-04T20:58:58.947Z',
          },
        ],
      };
      testUser.userSettings = userSettings;
      testUser.userPreferences = userPreferences;
      testUser.userHistory = userHistory;
      testUser.lastUpdated = new Date(Date.now());

      const response = await request(adminBaseURL).put('/users').send(testUser);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('Success');
      expect(response.body.message).toBe(`Successful update of user by given email: ${testUser.email}`);

      const changesToUserResponse = await request(adminBaseURL).get('/users/email').query({ email: testUser.email });
      const updatedUser = changesToUserResponse.body.user[0];
      expect(updatedUser.firstName).toBe('Amida');
      expect(updatedUser.lastName).toBe('Developer');
      expect(updatedUser.region).toBe('US - New York');
      expect(updatedUser.role).toBe('Test - User');
      expect(updatedUser.userGroup).toBe('General');
      expect(updatedUser.picture).toBe('https://lh3.googleusercontent.com/ogw/AOh-ky2QAvQ4d3_vPfYmspbP-WSp1QbutpDbIQNf2skw=s32-c-mo');
      expect(updatedUser.companyName).toBe('Amida Technology Solutions');
      expect(updatedUser.userSettings).toMatchObject(userSettings);
      expect(updatedUser.userPreferences).toMatchObject(userPreferences);
      expect(updatedUser.userHistory).toMatchObject(userHistory);
    });
  });
});
