import * as axios from 'axios';

import { Luminator } from '../../src';

jest.mock('axios');

interface IAxiosMock extends axios.AxiosStatic {
  mockResolvedValue: Function
  mockRejectedValue: Function
}

const mockAxios = axios.default as IAxiosMock;

/**
 * @description Builds an AxiosResponse with given status and failMessage.
 * @param status {number}
 * @param message {string}
 * @return {AxiosError}
 */
function failWith(status: number, message: string): axios.AxiosError {
  return {
    name: '',
    message,
    config: {},
    code: '',
    request: {},
    response: respondWith(status, message),
    isAxiosError: true,
  };
}

/**
 * @description Builds an AxiosResponse with given status and success message.
 * @param status {number}
 * @param message {string}
 * @return {AxiosResponse}
 */
function respondWith(status: number, message: string): axios.AxiosResponse {
  return ({
    config: undefined,
    request: undefined,
    data: {
      message,
    },
    status: status,
    statusText: status.toString(),
    headers: undefined,
  });
}

/**
 * @description successful test case assertion.
 * @param agent {Luminator}
 */
const assertSuccessfulCase = async (agent: Luminator) => {
  const mockedResponse = respondWith(200, `SUCCESS with 200`);
  mockAxios.mockResolvedValue(mockedResponse);
  const response = await agent.fetch({
    method: 'GET',
    url: 'https://lumtest.com/myip.json',
  });
  expect(response).toStrictEqual(mockedResponse);
};

describe('Luminator', () => {
  let agent: Luminator = new Luminator('USERNAME', 'password');

  describe('Should return response with status 200, and fail with the 404 error', () => {
    it('Should return response', async () => {
      await assertSuccessfulCase(agent)
    });

    it('Should fail with 404 status, with error message MAX_FAILURES_REQ', async () => {
      const err = failWith(404, `failed status 404`);
      mockAxios.mockRejectedValue(err);

      try {
        await agent.fetch({
          method: 'GET',
          url: 'https://lumtest.com/myip.json',
        });
      } catch (e) {
        expect(e).toEqual(err);
      }
    });
  });

  describe('Should call switchSessionId', () => {
    beforeEach(() => {
      agent = new Luminator('USERNAME', 'password');
    });

    Luminator.STATUS_CODE_FOR_RETRY.forEach((status: number) => {
      it(`Should call switchSessionId with ${status} status, and to be called 20 times`, async () => {
        mockAxios.mockRejectedValue(failWith(status, `failed with ${status}`));
        const spy: jest.SpyInstance = jest.spyOn(agent, 'switchSessionId');

        try {
          await agent.fetch({
            method: 'GET',
            url: 'https://lumtest.com/myip.json',
          });
        } catch (e) {
          expect(spy).toHaveBeenCalledTimes(7);
          expect(e).toEqual(new Error('MAX_FAILURES_REQ threshold reached'));
        }
        // success for the next successful request
        await assertSuccessfulCase(agent);
      });
    });

    it(`Should switch session id when the query threshold is reached`, async () => {
      mockAxios.mockResolvedValue(respondWith(200, `SUCCESS with 200`));
      const spy: jest.SpyInstance = jest.spyOn(agent, 'switchSessionId');

      for (let i = 0; i <= 30; i += 1) {
        await agent.fetch({
          method: 'GET',
          url: 'https://lumtest.com/myip.json',
        });
      }

      expect(spy).toHaveBeenCalledTimes(2);
    });
  });

  describe('Should throw all errors which are not an axios error', () => {
    it('Should throw non axios responses error', async () => {
      mockAxios.mockRejectedValue(new Error('NON_AXIOS_ERROR'));
      try {
        await agent.fetch({
          method: 'GET',
          url: 'https://lumtest.com/myip.json',
        });
      } catch (e) {
        expect(e).toEqual(new Error('NON_AXIOS_ERROR'));
      }
    });
  });
});
