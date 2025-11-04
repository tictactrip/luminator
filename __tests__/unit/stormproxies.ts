import * as nock from 'nock';
import { EStrategyMode, TStormProxiesStrategy, StormProxies, IStormProxiesConfig } from '../../src';

describe('Stormproxies', () => {
  const mapping: IStormProxiesConfig['strategy']['mapping'] = [
    { host: '123.32.35.64', port: 12355 },
    { host: '123.32.35.65', port: 12355 },
    { host: '123.32.35.66', port: 12355 },
    { host: '123.32.35.67', port: 12355 },
    { host: '123.32.35.68', port: 12355 },
    { host: '123.32.35.69', port: 12355 },
    { host: '123.32.35.70', port: 12355 },
  ];

  const strategy: TStormProxiesStrategy = {
    mode: EStrategyMode.CHANGE_IP_EVERY_REQUESTS,
    mapping,
  };

  describe('#constructor', () => {
    describe('when is not given a mapping with a single country', () => {
      it('should throw an error if a mapping has been set without any countries', async () => {
        let error: Error;

        try {
          new StormProxies({
            strategy: {
              ...strategy,
              mapping: [],
            },
          });
        } catch (e) {
          error = e;
        }

        expect(error).toStrictEqual(new Error('A {IP}:{PORT} mapping has to be provided.'));
      });
    });
  });

  describe('#strategy', () => {
    describe('when strategy is set to CHANGE_IP_EVERY_REQUESTS', () => {
      let stormProxies: StormProxies;

      beforeEach(() => {
        stormProxies = new StormProxies({ strategy: { ...strategy, mapping } });
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

      describe('using HTTP', () => {
        it("changes the caller's IP address every request", async () => {
          const request1Mock = nock('http://lumtest.com').get('/myip.json').once().reply(200, response1);
          const request2Mock = nock('http://lumtest.com').get('/myip.json').once().reply(200, response2);

          const result1 = await stormProxies.fetch({
            method: 'get',
            baseURL: 'http://lumtest.com',
            url: '/myip.json',
          });

          const result2 = await stormProxies.fetch({
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

      describe('using HTTPS', () => {
        it("changes the caller's IP address every request", async () => {
          const request1Mock = nock('https://lumtest.com').get('/myip.json').once().reply(200, response1);
          const request2Mock = nock('https://lumtest.com').get('/myip.json').once().reply(200, response2);

          const result1 = await stormProxies.fetch({
            method: 'get',
            baseURL: 'https://lumtest.com',
            url: '/myip.json',
          });

          const result2 = await stormProxies.fetch({
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
