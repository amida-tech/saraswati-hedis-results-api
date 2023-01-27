/* eslint-env jest */
const request = require('supertest');

const userBaseURL = 'http://localhost:4000/api/v1/user';
const token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImEyOWFiYzE5YmUyN2ZiNDE1MWFhNDMxZTk0ZmEzNjgwYWU0NThkYTUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2NzMzNjM5NjksImF1ZCI6IjM3MDI3MTk5MTczLTBnaDV0bHJxNjRyanE5bTA4YWFuY2E0ajdhNGpqcTVpLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE2OTk2Njg5NDY2MTA0Mjc3MTc2IiwiaGQiOiJhbWlkYS5jb20iLCJlbWFpbCI6InRpbS5qYWNrcmVlY2VAYW1pZGEuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF6cCI6IjM3MDI3MTk5MTczLTBnaDV0bHJxNjRyanE5bTA4YWFuY2E0ajdhNGpqcTVpLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwibmFtZSI6IlRpbSBKYWNrcmVlY2UiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUVkRlRwNnA1N0RsQ2VKR1hES3RvX0lQRDJQV25tVERhNTBwczhFZFFFTE09czk2LWMiLCJnaXZlbl9uYW1lIjoiVGltIiwiZmFtaWx5X25hbWUiOiJKYWNrcmVlY2UiLCJpYXQiOjE2NzMzNjQyNjksImV4cCI6MTY3MzM2Nzg2OSwianRpIjoiNzM4ZTFmNmFkY2MyZDllODk1MmJiZjEwNTZmNGQ1MjUyMmNlZjFhNSJ9.ZANeS5Tkmh7OkccaolgwAS4SMxh2Zh405cZdJ6j1FMwXqsttzozdsPvdnKUo07KIHpKd56htfQQRaXX30yzsTr6-R65OGC6BPd3G3iXFKnLMwpsVv46aAV5_rCFclR01kUUfYnWZSqh0eHTu7dpmdPQ4Cm6284XguiMtMWT23y4W4ZlxN51a7ARJ213bjJxgkMCA58wlUHnDVRq-Q6P-5IRG0tJsQFETWyVjHnSFK4hEZhaJO_pM09oiPev7M9TwdNY61NWBQzaLuBVpMslaj_p3W7GxODU6YXD19OZ77tc4C9lUSZXWv0loq4_wg31NPFS_V_hoV3l_UbWgUpoCVQ';

jest.mock('../../src/config/dao', () => {
  const originalModule = jest.requireActual('../../src/config/dao');
  return {
    __esModule: true,
    ...originalModule,
    getUsers: jest.fn(() => []),
    getUsersByEmail: jest.fn(() => []),
    addUsers: jest.fn(() => {}),
    updateUserByEmail: jest.fn(() => {}),
    deleteUsersByEmail: jest.fn(() => {}),
  };
});
describe('User Profile Test', () => {
  describe('"Post" - Login Users', () => {
    beforeAll(async () => {
      await request(userBaseURL).post('/login').send({ token });
    });
    afterAll(async () => {
      await request(userBaseURL).delete('/').query({ email: 'tim.jackreece@amida.com' });
    });
    it('should return statusCode 200, status message in Json object to say "Success"', async () => {
      const response = await request(userBaseURL).get('/').query({ email: 'tim.jackreece@amida.com' });
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('Success');
      expect(response.body.message).toBe('User found with given email: tim.jackreece@amida.com');
      expect(response.body.user.length).toBe(1);
    });
    it('Message should be "User Not Found", does not return user when email is not in system', async () => {
      const response = await request(userBaseURL).get('/').query({ email: 'tim.jackreece@aida.com' });
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe('Failed');
      expect(response.body.message).toBe('User Not Found');
    });
  });

  describe('"Get" - Get User By Email', () => {
    beforeAll(async () => {
      await request(userBaseURL).post('/login').send({ token });
    });
    afterAll(async () => {
      await request(userBaseURL).delete('/').query({ email: 'tim.jackreece@amida.com' });
    });
    it('should return statusCode 200, status message in Json object to say "Success", with success message', async () => {
      const response = await request(userBaseURL).get('/').query({ email: 'tim.jackreece@amida.com' });
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('Success');
      expect(response.body.message).toBe('User found with given email: tim.jackreece@amida.com');
      expect(response.body.user.length).toBe(1);
      expect(response.body.user[0].email).toBe('tim.jackreece@amida.com');
      expect(response.body.user[0].clientID).toBe('37027199173-0gh5tlrq64rjq9m08aanca4j7a4jjq5i.apps.googleusercontent.com');
      expect(response.body.user[0].firstName).toBe('Tim');
      expect(response.body.user[0].lastName).toBe('Jackreece');
      expect(response.body.user[0].role).toBe('User');
      expect(response.body.user[0].userGroup).toBe('General');
      expect(response.body.user[0].picture).toBe('https://lh3.googleusercontent.com/a/AEdFTp6p57DlCeJGXDKto_IPD2PWnmTDa50ps8EdQELM=s96-c');
      expect(response.body.user[0].companyDomain).toBe('amida.com');
      expect(response.body.user[0].active).toBe(true);
    });
  });
});
