import * as HttpsProxyAgent from 'https-proxy-agent';
import { HttpProxyAgent } from 'http-proxy-agent';
import { Provider } from '../base';
import { ECountry, ICreateProxy, ICreateProxyConfig, IProviderConfig } from '../base/types';
import { replacer } from '../../../utils/replacer';

/**
 * @description Proxyrack proxy provider.
 */
export class Proxyrack implements Provider {
  private readonly config: IProviderConfig;
  public sessionId: number;
  public country: ECountry;

  /**
   * @constructor
   * @param {IProviderConfig} config
   */
  constructor(config: IProviderConfig) {
    this.config = config;
  }

  /**
   * @description Returns session id.
   * @returns {number}
   */
  getSessionId(): number {
    throw new Error('Unavailable method for this provider.');
  }

  /**
   * @description Returns country.
   * @returns {ECountry}
   */
  getCountry(): ECountry {
    throw new Error('Unavailable method for this provider.');
  }

  /**
   * @description Creates proxy agents with a random country and sessionId.
   * @param {ICreateProxy} params
   * @returns {ICreateProxyConfig}
   */
  public createAgentsWithRandomCountryAndSessionId(params: ICreateProxy): ICreateProxyConfig {
    return this.createProxyAgents(params);
  }

  /**
   * @description Creates proxy agents with specific countries and a specific sessionId.
   * @param {ICreateProxy} params
   * @returns {ICreateProxyConfig}
   */
  public createAgentsSpecificCountryAndSessionsId(params: ICreateProxy): ICreateProxyConfig {
    throw new Error('Unavailable method for this provider.');
  }

  /**
   * @description Create proxy agents with a specific country and a random sessionId.
   * @param {ICreateProxy} params
   * @returns {ICreateProxyConfig}
   */
  public createAgentsSpecificCountriesAndRandomSessionId(params: ICreateProxy): ICreateProxyConfig {
    throw new Error('Unavailable method for this provider.');
  }

  /**
   * @description Creates proxy agents with a random country and a specific sessionId
   * @param {ICreateProxy} params
   * @returns {ICreateProxyConfig}
   */
  public createAgentsRandomCountryAndSpecificSessionId(params: ICreateProxy): ICreateProxyConfig {
    throw new Error('Unavailable method for this provider.');
  }

  /**
   * @description Create https and http proxies.
   * @param {ICreateProxy} params
   * @returns {ICreateProxyConfig}
   */
  private createProxyAgents(params: ICreateProxy): ICreateProxyConfig {
    const auth: string = replacer('{username}:{password}', {
      username: this.config.username,
      password: this.config.password,
    });

    const proxy = {
      host: this.config.host,
      port: this.config.port,
      auth,
    };

    return {
      httpsAgent: new HttpsProxyAgent({ ...proxy, rejectUnauthorized: false }),
      httpAgent: new HttpProxyAgent({ ...proxy, rejectUnauthorized: false }),
    };
  }
}
