import * as nock from 'nock';
import { EStrategyMode, Proxyrack } from '../../src';

describe('Proxyrack', () => {
  const proxy = {
    username: 'tictactrip',
    password: 'secret',
    host: 'megaproxy.rotating.proxyrack.net',
    port: 222,
  };

  describe('#constructor', () => {
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

      const proxyrack: Proxyrack = new Proxyrack({
        proxy,
        axiosConfig: {
          headers: {
            'User-Agent': userAgent,
          },
        },
      });

      const { data } = await proxyrack.setIp().fetch({
        method: 'get',
        baseURL: 'https://lumtest.com',
        url: '/myip.json',
      });

      expect(data).toStrictEqual(response1);

      request1Mock.done();
    });
  });

  describe('#setIp', () => {
    let proxyrack: Proxyrack;

    beforeEach(() => {
      proxyrack = new Proxyrack({ proxy });
    });

    it('should create an agent', async () => {
      const agent: Proxyrack = proxyrack.setIp();

      expect(agent).toBeInstanceOf(Proxyrack);
      expect(agent.axios.defaults.httpsAgent.proxy.host).toBe('zproxy.lum-superproxy.io');
      expect(agent.axios.defaults.httpsAgent.proxy.port).toBe(22225);
      expect(agent.axios.defaults.httpsAgent.proxy.rejectUnauthorized).toBe(false);
      expect(agent.axios.defaults.httpsAgent.proxy.auth).toMatch(new RegExp(`${proxy.username}:${proxy.password}`));
    });
  });

  describe('#strategy', () => {
    describe('CHANGE_IP_EVERY_REQUESTS', () => {
      const proxyrack: Proxyrack = new Proxyrack({
        proxy,
        strategy: {
          mode: EStrategyMode.CHANGE_IP_EVERY_REQUESTS,
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

          const result1 = await proxyrack.fetch({
            method: 'get',
            baseURL: 'http://lumtest.com',
            url: '/myip.json',
          });

          const result2 = await proxyrack.fetch({
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

      describe('https', () => {
        it('should change ip every request', async () => {
          const request1Mock = nock('https://lumtest.com').get('/myip.json').once().reply(200, response1);
          const request2Mock = nock('https://lumtest.com').get('/myip.json').once().reply(200, response2);

          const result1 = await proxyrack.fetch({
            method: 'get',
            baseURL: 'https://lumtest.com',
            url: '/myip.json',
          });

          const result2 = await proxyrack.fetch({
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
    });
  });
});
