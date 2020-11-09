import * as nock from 'nock';
import { ELuminatiCountry, EStrategyMode, Luminator } from '../../src';

describe('Luminator', () => {
  // tslint:disable-next-line:mocha-no-side-effect-code
  const countryKeys: string[] = Object.values(ELuminatiCountry);
  const luminatiConfig = {
    zone: 'lum-customer-tictactrip-zone-luminatordevtoremove',
    password: 'pdit81p1l7jt',
  };

  describe('#changeIp', () => {
    let luminator: Luminator;

    beforeAll(() => {
      luminator = new Luminator({ luminatiConfig });
    });

    it('should create an agent with a random countries and sessionId', async () => {
      luminator.changeIp();

      expect(luminator.axios.defaults.httpsAgent.options.host).toBe('zproxy.lum-superproxy.io');
      expect(luminator.axios.defaults.httpsAgent.options.port).toBe(22225);
      expect(luminator.axios.defaults.httpsAgent.options.rejectUnauthorized).toBe(false);
      expect(luminator.axios.defaults.httpsAgent.options.auth).toMatch(
        new RegExp(
          `${luminatiConfig.zone}-session-([0-9])*-country-(${countryKeys.join('|')}):${luminatiConfig.password}`,
        ),
      );
    });

    it('should create an agent with a specific countries and a random sessionId', async () => {
      luminator.changeIp({ countries: [ELuminatiCountry.FRANCE] });

      expect(luminator.axios.defaults.httpsAgent.options.host).toBe('zproxy.lum-superproxy.io');
      expect(luminator.axios.defaults.httpsAgent.options.port).toBe(22225);
      expect(luminator.axios.defaults.httpsAgent.options.rejectUnauthorized).toBe(false);
      expect(luminator.axios.defaults.httpsAgent.options.auth).toMatch(
        new RegExp(`${luminatiConfig.zone}-session-([0-9])*-country-fr:${luminatiConfig.password}`),
      );
    });

    it('should create an agent with a specific countries and a specific sessionId', async () => {
      const sessionId = 123456789;

      luminator.changeIp({ countries: [ELuminatiCountry.FRANCE], sessionId });

      expect(luminator.axios.defaults.httpsAgent.options.host).toBe('zproxy.lum-superproxy.io');
      expect(luminator.axios.defaults.httpsAgent.options.port).toBe(22225);
      expect(luminator.axios.defaults.httpsAgent.options.rejectUnauthorized).toBe(false);
      expect(luminator.axios.defaults.httpsAgent.options.auth).toMatch(
        new RegExp(`${luminatiConfig.zone}-session-${sessionId}-country-fr:${luminatiConfig.password}`),
      );
    });

    it('should create an agent with a random countries and a specific sessionId', async () => {
      const sessionId = 123456789;

      luminator.changeIp({ sessionId });

      expect(luminator.axios.defaults.httpsAgent.options.host).toBe('zproxy.lum-superproxy.io');
      expect(luminator.axios.defaults.httpsAgent.options.port).toBe(22225);
      expect(luminator.axios.defaults.httpsAgent.options.rejectUnauthorized).toBe(false);
      expect(luminator.axios.defaults.httpsAgent.options.auth).toMatch(
        new RegExp(
          `${luminatiConfig.zone}-session-${sessionId}-country-(${countryKeys.join('|')}):${luminatiConfig.password}`,
        ),
      );
    });

    it('should throw an error if no countries have been given (only countries attribute)', async () => {
      let error: Error;
      try {
        luminator.changeIp({ countries: [] });
      } catch (e) {
        error = e;
      }

      expect(error).toStrictEqual(new Error('"countries" array cannot be empty'));
    });

    it('should throw an error if no countries have been given (sessionId and countries attribute)', async () => {
      let error: Error;
      try {
        luminator.changeIp({ sessionId: 123, countries: [] });
      } catch (e) {
        error = e;
      }

      expect(error).toStrictEqual(new Error('"countries" array cannot be empty'));
    });
  });

  describe('#strategy', function () {
    it('should change ip every requests', async () => {
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

      expect(result1.data).toStrictEqual(response1);
      expect(result2.data).toStrictEqual(response2);

      request1Mock.done();
      request2Mock.done();
    });

    it('should throw an error if no countries have been given into the constructor', async () => {
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
  });
});
