import { Luminator, ELuminatiCountry } from '../../src';

describe('Luminator', () => {
  // tslint:disable-next-line:mocha-no-side-effect-code
  const countryKeys: string[] = Object.values(ELuminatiCountry);
  const luminatiConfig = {
    zone: 'luminati-tictactrip',
    password: 'nf8fxes1oub',
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
  });
});
