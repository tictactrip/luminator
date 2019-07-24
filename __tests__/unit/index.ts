import axios, { AxiosResponse, AxiosStatic } from 'axios';
import { Luminator } from '../../src';

interface IAxiosMock extends AxiosStatic {
  mockResolvedValue: Function
  mockRejectedValue: Function
}

jest.mock('axios');
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


describe('Test luminator', () => {
  describe('Test the Happy case, and the 404 error', () => {
    const agent = new Luminator('USERNAME', 'password');

    it('Should work with simple query', async () => {
      mockAxios.mockResolvedValue({
        data: {
          response: 'this is my result',
        },
      });
      try {
        const response = await agent.fetch({
          method: 'GET',
          url: 'https://lumtest.com/myip.json',
        });
        expect(response).toStrictEqual({
          data: {
            response: 'this is my result',
          },
        });
      } catch (e) {
        expect(e).toBeUndefined();
      }
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
        const message: string = e.message;
        expect(message).toBe('MAX_FAILURES_REQ threshold reached');
      }
    });
  });


  describe('Should call switchSessionId with [403, 429, 502, 503] status, and to be called 20 times', () => {
    const agent = new Luminator('USERNAME', 'password');
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

          expect(spy).toHaveBeenCalledTimes(20);
        }
      });
    });
  });
});
