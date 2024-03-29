import * as nock from 'nock';
import { EBrightDataCountry, EStrategyMode, BrightData } from '../../src';

describe('BrightData', () => {
  const countryKeys: string[] = Object.values(EBrightDataCountry);
  const proxy = {
    username: 'tictactrip',
    password: 'secret',
    host: 'zproxy.lum-superproxy.io',
    port: 22225,
  };

  describe('#constructor', () => {
    it('should throw an error if a strategy has been set without any countries', async () => {
      let error: Error;
      try {
        new BrightData({
          proxy,
          strategy: {
            mode: EStrategyMode.CHANGE_IP_EVERY_REQUESTS,
            countries: [],
          },
        });
      } catch (e) {
        error = e;
      }

      expect(error).toStrictEqual(new Error('"countries" array cannot be empty'));
    });

    it('should set an axios default configuration (User-Agent header)', async () => {
      const userAgent =
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36';
      const response1 = {
        ip: '216.74.105.107',
        country: 'BE',
        asn: {
          asnum: 9009,
          org_name: 'M247 Ltd',
        },
        geo: {
          city: 'Brussels',
          region: 'BRU',
          region_name: 'Brussels Capital',
          postal_code: '1000',
          latitude: 50.8336,
          longitude: 4.3337,
          tz: 'Europe/Brussels',
          lum_city: 'brussels',
          lum_region: 'bru',
        },
      };

      const request1Mock = nock('https://lumtest.com')
        .get('/myip.json')
        .matchHeader('User-Agent', userAgent)
        .once()
        .reply(200, response1);

      const brightData: BrightData = new BrightData({
        proxy,
        axiosConfig: {
          headers: {
            'User-Agent': userAgent,
          },
        },
      });

      const { data } = await brightData.setIp().fetch({
        method: 'get',
        baseURL: 'https://lumtest.com',
        url: '/myip.json',
      });

      expect(data).toStrictEqual(response1);

      request1Mock.done();
    });
  });

  describe('#setIp', () => {
    let brightData: BrightData;

    const regexPatternAllCountries = `${countryKeys.join('|')}`;

    beforeEach(() => {
      brightData = new BrightData({ proxy });
    });

    it('should create an agent with a random countries and sessionId', async () => {
      const agent: BrightData = brightData.setIp();

      expect(agent).toBeInstanceOf(BrightData);
      expect(typeof agent.sessionId).toEqual('number');
      expect(agent.country).toMatch(new RegExp(regexPatternAllCountries));
      expect(agent.axios.defaults.httpsAgent.proxy.host).toBe('zproxy.lum-superproxy.io:22225');
      expect(agent.axios.defaults.httpsAgent.proxy.port).toBe('22225');
      expect(agent.axios.defaults.httpsAgent.proxy.href).toMatch(
        new RegExp(
          `https://${proxy.username}-session-([0-9])*-country-(${regexPatternAllCountries}):${proxy.password}@zproxy.lum-superproxy.io:22225/`,
        ),
      );
    });

    it('should create an agent with a specific country and a random sessionId', async () => {
      const agent: BrightData = brightData.setIp({ countries: [EBrightDataCountry.FRANCE] });

      expect(agent).toBeInstanceOf(BrightData);
      expect(typeof agent.sessionId).toEqual('number');
      expect(agent.country).toMatch(/fr/);
      expect(agent.axios.defaults.httpsAgent.proxy.host).toBe('zproxy.lum-superproxy.io:22225');
      expect(agent.axios.defaults.httpsAgent.proxy.port).toBe('22225');
      expect(agent.axios.defaults.httpsAgent.proxy.href).toMatch(
        new RegExp(
          `https://${proxy.username}-session-([0-9])*-country-fr:${proxy.password}@zproxy.lum-superproxy.io:22225/`,
        ),
      );
    });

    it('should create an agent with a specific country and a specific sessionId', async () => {
      const sessionId = 123456789;

      const agent: BrightData = brightData.setIp({ countries: [EBrightDataCountry.FRANCE], sessionId });

      expect(agent).toBeInstanceOf(BrightData);
      expect(agent.sessionId).toEqual(123456789);
      expect(agent.country).toMatch(/fr/);
      expect(agent.axios.defaults.httpsAgent.proxy.host).toBe('zproxy.lum-superproxy.io:22225');
      expect(agent.axios.defaults.httpsAgent.proxy.port).toBe('22225');
      expect(agent.axios.defaults.httpsAgent.proxy.href).toMatch(
        new RegExp(
          `https://${proxy.username}-session-${sessionId}-country-fr:${proxy.password}@zproxy.lum-superproxy.io:22225/`,
        ),
      );
    });

    it('should create an agent with a random countries and a specific sessionId', async () => {
      const sessionId = 123456789;

      const agent: BrightData = brightData.setIp({ sessionId });

      expect(agent).toBeInstanceOf(BrightData);
      expect(agent.sessionId).toEqual(123456789);
      expect(agent.country).toMatch(new RegExp(regexPatternAllCountries));
      expect(agent.axios.defaults.httpsAgent.proxy.host).toBe('zproxy.lum-superproxy.io:22225');
      expect(agent.axios.defaults.httpsAgent.proxy.port).toBe('22225');
      expect(agent.axios.defaults.httpsAgent.proxy.href).toMatch(
        new RegExp(
          `https://${proxy.username}-session-${sessionId}-country-(${regexPatternAllCountries}):${proxy.password}@zproxy.lum-superproxy.io:22225/`,
        ),
      );
    });

    it('should throw an error if no countries have been given (only countries attribute)', async () => {
      let error: Error;
      try {
        brightData.setIp({ countries: [] });
      } catch (e) {
        error = e;
      }

      expect(error).toStrictEqual(new Error('"countries" array cannot be empty'));
    });

    it('should throw an error if no countries have been given (sessionId and countries attribute)', async () => {
      let error: Error;
      try {
        brightData.setIp({ sessionId: 123, countries: [] });
      } catch (e) {
        error = e;
      }

      expect(error).toStrictEqual(new Error('"countries" array cannot be empty'));
    });

    it('should throw an error if fetch() has been called without previously used setIp() or set a strategy', async () => {
      let error: Error;
      try {
        await brightData.fetch({
          method: 'get',
          baseURL: 'https://lumtest.com',
          url: '/myip.json',
        });
      } catch (e) {
        error = e;
      }

      expect(error).toStrictEqual(
        new Error('Your are trying to send a request without setting a Strategy or calling setIp().'),
      );
    });
  });

  describe('#strategy', () => {
    describe('CHANGE_IP_EVERY_REQUESTS', () => {
      const brightData: BrightData = new BrightData({
        proxy,
        strategy: {
          mode: EStrategyMode.CHANGE_IP_EVERY_REQUESTS,
          countries: [EBrightDataCountry.FRANCE, EBrightDataCountry.SPAIN],
        },
      });

      const response1 = {
        ip: '184.174.62.231',
        country: 'FR',
        asn: {
          asnum: 9009,
          org_name: 'M247 Ltd',
        },
        geo: {
          city: 'Paris',
          region: 'IDF',
          region_name: 'Île-de-France',
          postal_code: '75014',
          latitude: 48.8579,
          longitude: 2.3491,
          tz: 'Europe/Paris',
          lum_city: 'paris',
          lum_region: 'idf',
        },
      };

      const response2 = {
        ip: '178.171.89.101',
        country: 'ES',
        asn: {
          asnum: 9009,
          org_name: 'M247 Ltd',
        },
        geo: {
          city: 'Madrid',
          region: 'MD',
          region_name: 'Madrid',
          postal_code: '28001',
          latitude: 40.4167,
          longitude: -3.6838,
          tz: 'Europe/Madrid',
          lum_city: 'madrid',
          lum_region: 'md',
        },
      };

      describe('http', () => {
        it('should change ip every request', async () => {
          const request1Mock = nock('http://lumtest.com').get('/myip.json').once().reply(200, response1);
          const request2Mock = nock('http://lumtest.com').get('/myip.json').once().reply(200, response2);

          const result1 = await brightData.fetch({
            method: 'get',
            baseURL: 'http://lumtest.com',
            url: '/myip.json',
          });

          const result2 = await brightData.fetch({
            method: 'get',
            baseURL: 'http://lumtest.com',
            url: '/myip.json',
          });

          expect(typeof brightData.sessionId).toEqual('number');
          expect(brightData.country).toMatch(/fr|es/);
          expect(result1.data).toStrictEqual(response1);
          expect(result2.data).toStrictEqual(response2);

          request1Mock.done();
          request2Mock.done();
        });
      });

      describe('https', () => {
        it('should change ip every request', async () => {
          const request1Mock = nock('https://lumtest.com').get('/myip.json').once().reply(200, response1);
          const request2Mock = nock('https://lumtest.com').get('/myip.json').once().reply(200, response2);

          const result1 = await brightData.fetch({
            method: 'get',
            baseURL: 'https://lumtest.com',
            url: '/myip.json',
          });

          const result2 = await brightData.fetch({
            method: 'get',
            baseURL: 'https://lumtest.com',
            url: '/myip.json',
          });

          expect(typeof brightData.sessionId).toEqual('number');
          expect(brightData.country).toMatch(/fr|es/);
          expect(result1.data).toStrictEqual(response1);
          expect(result2.data).toStrictEqual(response2);

          request1Mock.done();
          request2Mock.done();
        });
      });
    });
  });
});
