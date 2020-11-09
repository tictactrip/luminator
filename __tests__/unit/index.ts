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

      const { data } = await luminator.changeIp().fetch({
        method: 'get',
        baseURL: 'https://lumtest.com',
        url: '/myip.json',
      });

      expect(data).toStrictEqual(response1);

      request1Mock.done();
    });
  });

  describe('#changeIp', () => {
    let luminator: Luminator;

    beforeAll(() => {
      luminator = new Luminator({ luminatiConfig });
    });

    it('should create an agent with a random countries and sessionId', async () => {
      const response: Luminator = await luminator.changeIp();

      expect(response).toBeInstanceOf(Luminator);
      expect(luminator.axios.defaults.httpsAgent.proxy.host).toBe('zproxy.lum-superproxy.io');
      expect(luminator.axios.defaults.httpsAgent.proxy.port).toBe(22225);
      expect(luminator.axios.defaults.httpsAgent.proxy.rejectUnauthorized).toBe(false);
      expect(luminator.axios.defaults.httpsAgent.proxy.auth).toMatch(
        new RegExp(
          `${luminatiConfig.zone}-session-([0-9])*-country-(${countryKeys.join('|')}):${luminatiConfig.password}`,
        ),
      );
    });

    it('should create an agent with a specific countries and a random sessionId', async () => {
      const response: Luminator = luminator.changeIp({ countries: [ELuminatiCountry.FRANCE] });

      expect(response).toBeInstanceOf(Luminator);
      expect(luminator.axios.defaults.httpsAgent.proxy.host).toBe('zproxy.lum-superproxy.io');
      expect(luminator.axios.defaults.httpsAgent.proxy.port).toBe(22225);
      expect(luminator.axios.defaults.httpsAgent.proxy.rejectUnauthorized).toBe(false);
      expect(luminator.axios.defaults.httpsAgent.proxy.auth).toMatch(
        new RegExp(`${luminatiConfig.zone}-session-([0-9])*-country-fr:${luminatiConfig.password}`),
      );
    });

    it('should create an agent with a specific countries and a specific sessionId', async () => {
      const sessionId = 123456789;

      const response: Luminator = luminator.changeIp({ countries: [ELuminatiCountry.FRANCE], sessionId });

      expect(response).toBeInstanceOf(Luminator);
      expect(luminator.axios.defaults.httpsAgent.proxy.host).toBe('zproxy.lum-superproxy.io');
      expect(luminator.axios.defaults.httpsAgent.proxy.port).toBe(22225);
      expect(luminator.axios.defaults.httpsAgent.proxy.rejectUnauthorized).toBe(false);
      expect(luminator.axios.defaults.httpsAgent.proxy.auth).toMatch(
        new RegExp(`${luminatiConfig.zone}-session-${sessionId}-country-fr:${luminatiConfig.password}`),
      );
    });

    it('should create an agent with a random countries and a specific sessionId', async () => {
      const sessionId = 123456789;

      const response: Luminator = luminator.changeIp({ sessionId });

      expect(response).toBeInstanceOf(Luminator);
      expect(luminator.axios.defaults.httpsAgent.proxy.host).toBe('zproxy.lum-superproxy.io');
      expect(luminator.axios.defaults.httpsAgent.proxy.port).toBe(22225);
      expect(luminator.axios.defaults.httpsAgent.proxy.rejectUnauthorized).toBe(false);
      expect(luminator.axios.defaults.httpsAgent.proxy.auth).toMatch(
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

  describe('#strategy', () => {
    describe('CHANGE_IP_EVERY_REQUESTS (HTTP)', () => {
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
    });

    describe('CHANGE_IP_EVERY_REQUESTS (HTTPS)', () => {
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

        expect(result1.data).toStrictEqual(response1);
        expect(result2.data).toStrictEqual(response2);

        request1Mock.done();
        request2Mock.done();
      });
    });
  });
});
