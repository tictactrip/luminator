import axios, { AxiosResponse, AxiosStatic } from 'axios';

jest.mock('axios');

import { Luminator } from '../../src';

interface IAxiosMock extends AxiosStatic {
  mockResolvedValue: Function
  mockRejectedValue: Function
}


const mockAxios = axios as IAxiosMock;

/**
 * build an AxiosResponse with given status and failMessage
 * @param status
 */
function failWith(status: number): AxiosResponse {
  return ({
    config: undefined,
    request: undefined,
    data: {
      message: `FAILED ${status}`,
    },
    status: status,
    statusText: status.toString(),
    headers: undefined,
  });
}

/**
 * build an AxiosResponse with given status and success message
 * @param status
 */
function successWith(status: number): AxiosResponse {
  return ({
    config: undefined,
    request: undefined,
    data: {
      message: `SUCCESS with ${status}`,
    },
    status: status,
    statusText: status.toString(),
    headers: undefined,
  });
}

describe('Luminator', () => {
  let agent: Luminator = new Luminator('USERNAME', 'password');

  describe('Should return response with status 200, and fail with the 404 error', () => {
    it('Should return response', async () => {
      mockAxios.mockResolvedValue(successWith(200));
      const spy: jest.SpyInstance = jest.spyOn(agent, 'switchSessionId');
      const response = await agent.fetch({
        method: 'GET',
        url: 'https://lumtest.com/myip.json',
      });
      expect(response).toStrictEqual(successWith(200));
      expect(spy).toHaveBeenCalled();
    });

    it('Should fail with 404 status, with error message MAX_FAILURES_REQ', async () => {
      mockAxios.mockRejectedValue(failWith(404));
      try {
        const response = await agent.fetch({
          method: 'GET',
          url: 'https://lumtest.com/myip.json',
        });
        expect(response.data).toStrictEqual({
          message: 'FAILED 404',
        });
      } catch (e) {
        expect(e.status).toBe(404);
      }
    });
  });

  describe('Should call switchSessionId', () => {
    beforeEach(() => {
      agent = new Luminator('USERNAME', 'password');
    });

    Luminator.STATUS_CODE_FOR_RETRY.forEach((status: number) => {
      it(`Should call switchSessionId with ${status} status, and to be called 20 times`, async () => {
        mockAxios.mockRejectedValue(failWith(status));
        const spy: jest.SpyInstance = jest.spyOn(agent, 'switchSessionId');
        try {
          await agent.fetch({
            method: 'GET',
            url: 'https://lumtest.com/myip.json',
          });
        } catch (e) {
          expect(spy).toHaveBeenCalledTimes(6);
          expect(e.message).toBe('MAX_FAILURES_REQ threshold reached');
        }
      });
    });

    it(`Should switch session id when the query threshold is reached`, async () => {
      mockAxios.mockResolvedValue(successWith(200));
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
});
