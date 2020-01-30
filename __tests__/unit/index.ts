import axios, { AxiosStatic, AxiosError, AxiosResponse } from 'axios';
import { Luminator, LuminatorError } from '../../src';

jest.mock('axios');

interface IAxiosMock extends AxiosStatic {
  mockResolvedValue: Function;
  mockRejectedValue: Function;
}

const mockAxios = axios as IAxiosMock;

/**
 * @description Builds an AxiosResponse with given status and failMessage.
 * @param {number} status
 * @param {string} message
 * @return {AxiosError}
 */
function failWith(status: number, message: string): AxiosError {
  return {
    name: '',
    message,
    config: {},
    code: '',
    request: {},
    response: respondWith(status, message),
    isAxiosError: true,
    toJSON: () => ({ status, message }),
  };
}

/**
 * @description Builds an AxiosResponse with given status and success message.
 * @param {number} status
 * @param {string} message
 * @return {AxiosResponse}
 */
function respondWith(status: number, message: string): AxiosResponse {
  return {
    config: undefined,
    request: undefined,
    data: {
      message,
    },
    status: status,
    statusText: status.toString(),
    headers: undefined,
  };
}

/**
 * @description Successful test case assertion.
 * @param {Luminator} agent
 * @return {Promise<void>}
 */
const assertSuccessfulCase = async (agent: Luminator): Promise<void> => {
  const mockedResponse = respondWith(200, `SUCCESS with 200`);
  mockAxios.mockResolvedValue(mockedResponse);
  const response = await agent.fetch({
    method: 'GET',
    url: 'https://lumtest.com/myip.json',
  });

  expect(response).toStrictEqual(mockedResponse);
  expect(mockAxios).toHaveBeenCalled();
};

describe('Luminator', () => {
  let agent: Luminator = new Luminator('USERNAME', 'password');

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('Should return response with status 200, and fail with the 404 error', () => {
    it('Should return response', async () => {
      await assertSuccessfulCase(agent);
    });

    it('Should fail with 404 status, with error message MAX_FAILURES_REQ', async () => {
      const responseError = failWith(404, `failed status 404`);
      mockAxios.mockRejectedValue(responseError);

      let err: Error;

      try {
        await agent.fetch({
          method: 'GET',
          url: 'https://lumtest.com/myip.json',
        });
      } catch (e) {
        err = e;
      }

      expect(err).toEqual(responseError);
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

        let err: Error;

        try {
          await agent.fetch({
            method: 'GET',
            url: 'https://lumtest.com/myip.json',
          });
        } catch (e) {
          err = e;
        }

        expect(spy).toHaveBeenCalledTimes(7);
        expect(err).toEqual(
          new LuminatorError('MAX_FAILURES_REQ threshold reached'),
        );

        // Success for the next successful request
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
      mockAxios.mockRejectedValue(new LuminatorError('NON_AXIOS_ERROR'));

      let err: LuminatorError;

      try {
        await agent.fetch({
          method: 'GET',
          url: 'https://lumtest.com/myip.json',
        });
      } catch (e) {
        err = e;
      }

      expect(err).toEqual(new LuminatorError('NON_AXIOS_ERROR'));
    });
  });
});
