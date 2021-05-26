import * as nock from 'nock';
import {
  EShifterCountry,
  EStrategyMode,
  IProviderConfig,
  TShifterCountryPortMapping,
  TShifterStrategy,
  Shifter,
} from '../../src';

const getMappingPorts = (mapping: TShifterCountryPortMapping): number[] => {
  return Object.values(mapping).reduce((acc, ports) => [...acc, ...ports], []);
};

describe('Shifter', () => {
  const proxy: IProviderConfig = {
    host: '50.14.52.12',
    port: 12355,
  };

  const mapping: TShifterCountryPortMapping = {
    fr: [12356, 12359, 12360],
    be: [12357],
    ch: [12358, 12361],
  };

  const strategy: TShifterStrategy = {
    mode: EStrategyMode.CHANGE_IP_EVERY_REQUESTS,
    mapping,
  };

  describe('#constructor', () => {
    describe('when is not given a mapping with a single country', () => {
      it('should throw an error if a mapping has been set without any countries', async () => {
        let error: Error;

        try {
          new Shifter({
            proxy,
            strategy: {
              ...strategy,
              mapping: {},
            },
          });
        } catch (e) {
          error = e;
        }

        expect(error).toStrictEqual(new Error('A port-to-country mapping has to be provided.'));
      });
    });
  });

  describe('#setIp', () => {
    let shifter: Shifter;

    beforeEach(() => {
      shifter = new Shifter({ proxy, strategy });
    });

    describe('when not given any specific country to target', () => {
      it('creates a properly formed proxy agent', () => {
        const agent: Shifter = shifter.setIp();

        const expectedProxyAgent = {
          host: proxy.host,
          port: expect.any(Number),
          rejectUnauthorized: false,
        };

        expect(agent.axios.defaults.httpsAgent.proxy).toMatchObject(expectedProxyAgent);
        expect(agent.axios.defaults.httpAgent.proxy).toMatchObject(expectedProxyAgent);
      });

      it('creates a proxy agent having a random port among the given mapping', () => {
        const agent: Shifter = shifter.setIp();

        expect(getMappingPorts(mapping)).toEqual(expect.arrayContaining([agent.axios.defaults.httpsAgent.proxy.port]));
        expect(getMappingPorts(mapping)).toEqual(expect.arrayContaining([agent.axios.defaults.httpAgent.proxy.port]));
      });
    });

    describe('when given one or more specific countries to target', () => {
      it('creates a properly formed proxy agent', () => {
        const agent: Shifter = shifter.setIp();

        const expectedProxyAgent = {
          host: proxy.host,
          port: expect.any(Number),
          rejectUnauthorized: false,
        };

        expect(agent.axios.defaults.httpsAgent.proxy).toMatchObject(expectedProxyAgent);
        expect(agent.axios.defaults.httpAgent.proxy).toMatchObject(expectedProxyAgent);
      });

      it('create a proxy agent having a port matching one of the options in the mapping', () => {
        const country: EShifterCountry = EShifterCountry.FRANCE;
        const agent: Shifter = shifter.setIp({ countries: [country] });

        expect(mapping[country]).toEqual(expect.arrayContaining([agent.axios.defaults.httpsAgent.proxy.port]));
        expect(mapping[country]).toEqual(expect.arrayContaining([agent.axios.defaults.httpAgent.proxy.port]));
      });

      it('create a proxy agent having a port matching several of the options in the mapping', () => {
        const countries: EShifterCountry[] = [EShifterCountry.FRANCE, EShifterCountry.BELGIUM];
        const mappedPorts: number[] = countries.map((c) => mapping[c]).reduce((acc, c) => [...acc, ...c], []);
        const agent: Shifter = shifter.setIp({ countries: countries });

        expect(mappedPorts).toEqual(expect.arrayContaining([agent.axios.defaults.httpsAgent.proxy.port]));
        expect(mappedPorts).toEqual(expect.arrayContaining([agent.axios.defaults.httpAgent.proxy.port]));
      });
    });
  });

  describe('#strategy', () => {
    describe('when strategy is set to CHANGE_IP_EVERY_REQUESTS', () => {
      let shifter: Shifter;

      beforeEach(() => {
        shifter = new Shifter({ proxy, strategy });
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

          const result1 = await shifter.fetch({
            method: 'get',
            baseURL: 'http://lumtest.com',
            url: '/myip.json',
          });

          const result2 = await shifter.fetch({
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

          const result1 = await shifter.fetch({
            method: 'get',
            baseURL: 'https://lumtest.com',
            url: '/myip.json',
          });

          const result2 = await shifter.fetch({
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
