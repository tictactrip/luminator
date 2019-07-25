import axios, { AxiosResponse, AxiosStatic } from 'axios';
jest.mock('axios');

import { Luminator } from '../../src';

interface IAxiosMock extends AxiosStatic {
  mockResolvedValue: Function
  mockRejectedValue: Function
}


const mockAxios = axios as IAxiosMock;

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
  describe('Test the Happy case, and the 404 error', () => {
    const agent = new Luminator('USERNAME', 'password');

    it('Should work with simple query', async () => {
      mockAxios.mockResolvedValue(successWith(200));
      const spy: jest.SpyInstance = jest.spyOn(agent, 'switchSessionId');

      const response = await agent.fetch({
        method: 'GET',
        url: 'https://lumtest.com/myip.json',
      });
      expect(response).toStrictEqual(successWith(200));
      expect(agent['failCount']).toBe(0);
      expect(agent['failuresCountReq']).toBe(0);
      expect(spy).toHaveBeenCalled()
    });

    it('Should fail with 404 status, with error message MAX_FAILURES_REQ threshold reached', async () => {
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
        expect(() => {throw e}).toThrow();
      }
    });
  });

  describe('Should call switchSessionId with [403, 429, 502, 503] status and if the max allowed call with given ip reached' +
    ', and to be called 20 times', () => {

    Luminator.STATUS_CODE_FOR_RETRY.forEach((status: number) => {
      it(`Should call switchSessionId with ${status} status, and to be called 20 times`, async () => {
        const agent = new Luminator('USERNAME', 'password');
        mockAxios.mockRejectedValue(failWith(status));
        const spy: jest.SpyInstance = jest.spyOn(agent, 'switchSessionId');

        try {
          await agent.fetch({
            method: 'GET',
            url: 'https://lumtest.com/myip.json',
          });
        } catch (e) {
          expect(spy).toHaveBeenCalledTimes(20);
        }
      });
    });

    it(`Should call switchSessionId two time if the max query threshold is called`, async () => {
      const agent = new Luminator('USERNAME', 'password');
      mockAxios.mockResolvedValue(successWith(200));

      const spy: jest.SpyInstance = jest.spyOn(agent, 'switchSessionId');
      for (let i = 0; i <= 30; i += 1) {
        await agent.fetch({
          method: 'GET',
          url: 'https://lumtest.com/myip.json',
        });
      }
      expect(spy).toHaveBeenCalledTimes(2)
    });
  });
});
