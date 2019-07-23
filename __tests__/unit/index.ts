import axios, { AxiosResponse, AxiosStatic } from 'axios';
import { Luminator } from '../../src';

interface IAxiosMock extends AxiosStatic {
  mockResolvedValue: Function
  mockRejectedValue: Function
}

jest.mock('axios');
const mockAxios = axios as IAxiosMock;

const fail404: AxiosResponse = {
  config: undefined,
  request: undefined,
  data: {
    message: "FAILED 404"
  },
  status: 404,
  statusText: '404',
  headers: undefined
};

describe("Your context", () => {
  it("Should work with simple query", async () => {
    mockAxios.mockResolvedValue({ data: {
        response: "this is my result"
      }});
    try {
      const agent = new Luminator("USERNAME", 'password');
      const response = await agent.fetch({
        method:'GET',
        url:'https://lumtest.com/myip.json'
      });
      expect(response).toStrictEqual({
        data: {
          response: "this is my result"
        }
      });
    } catch (e) {
        expect(e).toBeUndefined()
    }
  });

  it("Should fail with 404 status", async (done) => {
    mockAxios.mockRejectedValue(fail404);
    try {
      const agent = new Luminator("USERNAME", 'password');
      const response = await agent.fetch({
        method:'GET',
        url:'https://lumtest.com/myip.json'
      });
      expect(response.data).toStrictEqual({
        message: "FAILED 404"
      });
    } catch (e) {
      expect(e.message).toBe("MAX_FAILURES_REQ threshold reached")
      done();
    }
    done();
  });
});
