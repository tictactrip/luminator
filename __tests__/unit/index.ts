import { Luminator, ELuminatiCountry } from '../../src';

describe('Luminator', () => {
  // tslint:disable-next-line:mocha-no-side-effect-code
  const countryKeys: string[] = Object.values(ELuminatiCountry);
  const luminatiConfig = {
    zone: "lum-customer-tictactrip-zone-luminatordevtoremove",
    password: "rpxcdioddewh"
  };

  describe('#changeIp', () => {
    let luminator: Luminator;

    beforeAll(() => {
      luminator = new Luminator({ luminatiConfig });
    });

    it('should create an agent with a random country and sessionId', async () => {
      luminator.changeIp();

      expect(luminator.axios.defaults.httpsAgent.options.host).toBe('zproxy.lum-superproxy.io');
      expect(luminator.axios.defaults.httpsAgent.options.port).toBe(22225);
      expect(luminator.axios.defaults.httpsAgent.options.rejectUnauthorized).toBe(false);
      expect(luminator.axios.defaults.httpsAgent.options.auth).toMatch(new RegExp(`${luminatiConfig.zone}-session-([0-9])*-country-(${countryKeys.join('|')}):${luminatiConfig.password}`));
    });

    it('should create an agent with a specific country and a random sessionId', async () => {
      luminator.changeIp({country: ELuminatiCountry.FRANCE});

      expect(luminator.axios.defaults.httpsAgent.options.host).toBe('zproxy.lum-superproxy.io');
      expect(luminator.axios.defaults.httpsAgent.options.port).toBe(22225);
      expect(luminator.axios.defaults.httpsAgent.options.rejectUnauthorized).toBe(false);
      expect(luminator.axios.defaults.httpsAgent.options.auth).toMatch(new RegExp(`${luminatiConfig.zone}-session-([0-9])*-country-fr:${luminatiConfig.password}`));
    });

    it('should create an agent with a specific country and a specific sessionId', async () => {
      const sessionId: number = 123456789;

      luminator.changeIp({country: ELuminatiCountry.FRANCE, sessionId });

      expect(luminator.axios.defaults.httpsAgent.options.host).toBe('zproxy.lum-superproxy.io');
      expect(luminator.axios.defaults.httpsAgent.options.port).toBe(22225);
      expect(luminator.axios.defaults.httpsAgent.options.rejectUnauthorized).toBe(false);
      expect(luminator.axios.defaults.httpsAgent.options.auth).toMatch(new RegExp(`${luminatiConfig.zone}-session-${sessionId}-country-fr:${luminatiConfig.password}`));
    });

    it('should create an agent with a random country and a specific sessionId', async () => {
      const sessionId: number = 123456789;

      luminator.changeIp({ sessionId });

      expect(luminator.axios.defaults.httpsAgent.options.host).toBe('zproxy.lum-superproxy.io');
      expect(luminator.axios.defaults.httpsAgent.options.port).toBe(22225);
      expect(luminator.axios.defaults.httpsAgent.options.rejectUnauthorized).toBe(false);
      expect(luminator.axios.defaults.httpsAgent.options.auth).toMatch(new RegExp(`${luminatiConfig.zone}-session-${sessionId}-country-(${countryKeys.join('|')}):${luminatiConfig.password}`));
    });
  });
});
