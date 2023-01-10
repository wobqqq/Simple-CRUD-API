import request from 'supertest';
import app from '../../..';
import userRepository from '../../../src/repositories/UserRepository';
import { db } from '../../../src/services/DB';
import {
  notValidUuid,
  notFoundUuid,
  notValidUserDataList,
  validUserDataList,
} from './fakers/UserFaker';

const [validCreateUserData, validUpdateUserData] = validUserDataList;
const appRequest = request(app);

describe('Test user API endpoints', () => {
  beforeEach(() => {
    db.createQuery({
      type: 'drop',
      table: 'users',
    });
  });

  afterAll(async () => {
    if (app === null) {
      return;
    }

    await app.close();
  });

  describe('Get users', () => {
    it('Return status code 200 if the request is valid', async () => {
      const response = await appRequest
        .get('/api/users')
        .send();
      const expectData = 200;
      const responseData = response.statusCode;

      expect(expectData).toEqual(responseData);
    });

    it('Return empty array if the request is valid', async () => {
      const response = await appRequest
        .get('/api/users')
        .send();
      const expectData: Object[] = [];
      const responseData = response.body.data;

      expect(expectData).toEqual(responseData);
    });

    it('Return array of users if the request is valid', async () => {
      const userPromises = validUserDataList.map(async (item) => userRepository.create(item));
      const users = await Promise.all(userPromises);
      const response = await appRequest
        .get('/api/users')
        .send();
      const expectData = users;
      const responseData = response.body.data;

      expect(expectData).toEqual(responseData);
    });
  });

  describe('Get user', () => {
    it('Return status code 200 if the request is valid', async () => {
      const user = await userRepository.create(validCreateUserData);
      const response = await appRequest
        .get(`/api/users/${user.id}`)
        .send();
      const expectData = 200;
      const responseData = response.statusCode;

      expect(expectData).toEqual(responseData);
    });

    it('Return status code 400 if the request is not valid', async () => {
      const response = await appRequest
        .get(`/api/users/${notValidUuid}`)
        .send();
      const expectStatusCode = 400;
      const responseStatusCode = response.statusCode;

      expect(expectStatusCode).toEqual(responseStatusCode);
    });

    it('Return status code 404 if data is not found', async () => {
      const response = await appRequest
        .get(`/api/users/${notFoundUuid}`)
        .send();
      const expectData = 404;
      const responseData = response.statusCode;

      expect(expectData).toEqual(responseData);
    });

    it('Return user data if the request is valid ', async () => {
      const user = await userRepository.create(validCreateUserData);
      const response = await appRequest
        .get(`/api/users/${user.id}`)
        .send();
      const expectData = user;
      const responseData = response.body.data;

      expect(expectData).toEqual(responseData);
    });
  });

  describe('Create user', () => {
    it('Return status code 201 if the request is valid', async () => {
      const response = await appRequest
        .post('/api/users')
        .send(validCreateUserData);
      const expectStatusCode = 201;
      const responseStatusCode = response.statusCode;

      expect(expectStatusCode).toEqual(responseStatusCode);
    });

    notValidUserDataList.forEach((item) => {
      it(`Return status code 400 if the ${item.describe}`, async () => {
        const notValidCreateUserData = item.data;
        const response = await appRequest
          .post('/api/users')
          .send(notValidCreateUserData);
        const expectStatusCode = 400;
        const responseStatusCode = response.statusCode;

        expect(expectStatusCode).toEqual(responseStatusCode);
      });
    });

    it('Return user data if the request is valid ', async () => {
      const [response] = await Promise.all([appRequest
        .post('/api/users')
        .send(validCreateUserData)]);
      const expectStatusCode = 201;
      const responseStatusCode = response.statusCode;

      expect(expectStatusCode).toEqual(responseStatusCode);
    });
  });

  describe('Update user', () => {
    it('Return status code 200 if the request is valid', async () => {
      const user = await userRepository.create(validCreateUserData);
      const response = await appRequest
        .put(`/api/users/${user.id}`)
        .send(validUpdateUserData);
      const expectData = 200;
      const responseData = response.statusCode;

      expect(expectData).toEqual(responseData);
    });

    it('Return status code 400 if the UUID is valid', async () => {
      const response = await appRequest
        .put(`/api/users/${notValidUuid}`)
        .send(validUpdateUserData);
      const expectStatusCode = 400;
      const responseStatusCode = response.statusCode;

      expect(expectStatusCode).toEqual(responseStatusCode);
    });

    notValidUserDataList.forEach((item) => {
      it(`Return status code 400 if the ${item.describe}`, async () => {
        const notValidCreateUserData = item.data;
        const user = await userRepository.create(validCreateUserData);
        const response = await appRequest
          .put(`/api/users/${user.id}`)
          .send(notValidCreateUserData);
        const expectStatusCode = 400;
        const responseStatusCode = response.statusCode;

        expect(expectStatusCode).toEqual(responseStatusCode);
      });
    });

    it('Return status code 404 if data is not found', async () => {
      const response = await appRequest
        .put(`/api/users/${notFoundUuid}`)
        .send(validUpdateUserData);
      const expectStatusCode = 404;
      const responseStatusCode = response.statusCode;

      expect(expectStatusCode).toEqual(responseStatusCode);
    });

    it('Return user data if the request is valid ', async () => {
      const user = await userRepository.create(validCreateUserData);
      const response = await appRequest
        .put(`/api/users/${user.id}`)
        .send(validUpdateUserData);
      const expectData = Object.assign(validUpdateUserData, { id: response.body.data.id });
      const responseData = response.body.data;

      expect(expectData).toEqual(responseData);
    });
  });

  describe('Delete user', () => {
    it('Return status code 204 if the request is valid', async () => {
      const user = await userRepository.create(validCreateUserData);
      const response = await appRequest
        .delete(`/api/users/${user.id}`)
        .send();
      const expectStatusCode = 204;
      const responseStatusCode = response.statusCode;

      expect(expectStatusCode).toEqual(responseStatusCode);
    });

    it('Return status code 400 if the UUID is not valid', async () => {
      const response = await appRequest
        .put(`/api/users/${notValidUuid}`)
        .send();
      const expectStatusCode = 400;
      const responseStatusCode = response.statusCode;

      expect(expectStatusCode).toEqual(responseStatusCode);
    });

    it('Return status code 404 if data is not found', async () => {
      const response = await appRequest
        .delete(`/api/users/${notFoundUuid}`)
        .send();
      const expectStatusCode = 404;
      const responseStatusCode = response.statusCode;

      expect(expectStatusCode).toEqual(responseStatusCode);
    });
  });
});
