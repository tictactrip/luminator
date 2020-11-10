import * as nock from 'nock';
import { ELuminatiCountry, EStrategyMode, Luminator } from '../../src';

describe('Luminator', () => {
  const countryKeys: string[] = Object.values(ELuminatiCountry);
  const luminatiConfig = {
    zone: 'tictactrip',
    password: 'secret',
  };

  describe('#constructor', () => {
    it('should throw an error if a strategy has been set without any countries', async () => {
      let error: Error;
      try {
        new Luminator({
          luminatiConfig,
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

      const luminator: Luminator = new Luminator({
        luminatiConfig,
        axiosConfig: {
          headers: {
            'User-Agent': userAgent,
          },
        },
      });

      const { data } = await luminator.setIp().fetch({
        method: 'get',
        baseURL: 'https://lumtest.com',
        url: '/myip.json',
      });

      expect(data).toStrictEqual(response1);

      request1Mock.done();
    });
  });

  describe('#setIp', () => {
    let luminator: Luminator;

    const regexPatternAllCountries = `${countryKeys.join('|')}`;

    beforeEach(() => {
      luminator = new Luminator({ luminatiConfig });
    });

    it('should create an agent with a random countries and sessionId', async () => {
      const agent: Luminator = luminator.setIp();

      expect(agent).toBeInstanceOf(Luminator);
      expect(typeof agent.sessionId).toEqual('number');
      expect(agent.country).toMatch(new RegExp(regexPatternAllCountries));
      expect(agent.axios.defaults.httpsAgent.proxy.host).toBe('zproxy.lum-superproxy.io');
      expect(agent.axios.defaults.httpsAgent.proxy.port).toBe(22225);
      expect(agent.axios.defaults.httpsAgent.proxy.rejectUnauthorized).toBe(false);
      expect(agent.axios.defaults.httpsAgent.proxy.auth).toMatch(
        new RegExp(
          `${luminatiConfig.zone}-session-([0-9])*-country-(${regexPatternAllCountries}):${luminatiConfig.password}`,
        ),
      );
    });

    it('should create an agent with a specific country and a random sessionId', async () => {
      const agent: Luminator = luminator.setIp({ countries: [ELuminatiCountry.FRANCE] });

      expect(agent).toBeInstanceOf(Luminator);
      expect(typeof agent.sessionId).toEqual('number');
      expect(agent.country).toMatch(/fr/);
      expect(agent.axios.defaults.httpsAgent.proxy.host).toBe('zproxy.lum-superproxy.io');
      expect(agent.axios.defaults.httpsAgent.proxy.port).toBe(22225);
      expect(agent.axios.defaults.httpsAgent.proxy.rejectUnauthorized).toBe(false);
      expect(agent.axios.defaults.httpsAgent.proxy.auth).toMatch(
        new RegExp(`${luminatiConfig.zone}-session-([0-9])*-country-fr:${luminatiConfig.password}`),
      );
    });

    it('should create an agent with a specific country and a specific sessionId', async () => {
      const sessionId = 123456789;

      const agent: Luminator = luminator.setIp({ countries: [ELuminatiCountry.FRANCE], sessionId });

      expect(agent).toBeInstanceOf(Luminator);
      expect(agent.sessionId).toEqual(123456789);
      expect(agent.country).toMatch(/fr/);
      expect(agent.axios.defaults.httpsAgent.proxy.host).toBe('zproxy.lum-superproxy.io');
      expect(agent.axios.defaults.httpsAgent.proxy.port).toBe(22225);
      expect(agent.axios.defaults.httpsAgent.proxy.rejectUnauthorized).toBe(false);
      expect(agent.axios.defaults.httpsAgent.proxy.auth).toMatch(
        new RegExp(`${luminatiConfig.zone}-session-${sessionId}-country-fr:${luminatiConfig.password}`),
      );
    });

    it('should create an agent with a random countries and a specific sessionId', async () => {
      const sessionId = 123456789;

      const agent: Luminator = luminator.setIp({ sessionId });

      expect(agent).toBeInstanceOf(Luminator);
      expect(agent.sessionId).toEqual(123456789);
      expect(agent.country).toMatch(new RegExp(regexPatternAllCountries));
      expect(agent.axios.defaults.httpsAgent.proxy.host).toBe('zproxy.lum-superproxy.io');
      expect(agent.axios.defaults.httpsAgent.proxy.port).toBe(22225);
      expect(agent.axios.defaults.httpsAgent.proxy.rejectUnauthorized).toBe(false);
      expect(agent.axios.defaults.httpsAgent.proxy.auth).toMatch(
        new RegExp(
          `${luminatiConfig.zone}-session-${sessionId}-country-(${regexPatternAllCountries}):${luminatiConfig.password}`,
        ),
      );
    });

    it('should throw an error if no countries have been given (only countries attribute)', async () => {
      let error: Error;
      try {
        luminator.setIp({ countries: [] });
      } catch (e) {
        error = e;
      }

      expect(error).toStrictEqual(new Error('"countries" array cannot be empty'));
    });

    it('should throw an error if no countries have been given (sessionId and countries attribute)', async () => {
      let error: Error;
      try {
        luminator.setIp({ sessionId: 123, countries: [] });
      } catch (e) {
        error = e;
      }

      expect(error).toStrictEqual(new Error('"countries" array cannot be empty'));
    });

    it('should throw an error if fetch() has been called without previously used setIp() or set a strategy', async () => {
      let error: Error;
      try {
        await luminator.fetch({
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
      const luminator: Luminator = new Luminator({
        luminatiConfig,
        strategy: {
          mode: EStrategyMode.CHANGE_IP_EVERY_REQUESTS,
          countries: [ELuminatiCountry.FRANCE, ELuminatiCountry.SPAIN],
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

          const result1 = await luminator.fetch({
            method: 'get',
            baseURL: 'http://lumtest.com',
            url: '/myip.json',
          });

          const result2 = await luminator.fetch({
            method: 'get',
            baseURL: 'http://lumtest.com',
            url: '/myip.json',
          });

          expect(typeof luminator.sessionId).toEqual('number');
          expect(luminator.country).toMatch(/fr|es/);
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

          const result1 = await luminator.fetch({
            method: 'get',
            baseURL: 'https://lumtest.com',
            url: '/myip.json',
          });

          const result2 = await luminator.fetch({
            method: 'get',
            baseURL: 'https://lumtest.com',
            url: '/myip.json',
          });

          expect(typeof luminator.sessionId).toEqual('number');
          expect(luminator.country).toMatch(/fr|es/);
          expect(result1.data).toStrictEqual(response1);
          expect(result2.data).toStrictEqual(response2);

          request1Mock.done();
          request2Mock.done();
        });
      });
    });
  });
});
