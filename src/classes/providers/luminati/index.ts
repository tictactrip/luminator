import { Provider } from '../base';
import {ECountry, ICreateProxy, ICreateProxyConfig, IProviderConfig} from '../base/types';
import { replacer } from '../../../utils/replacer';
import HttpsProxyAgent from "https-proxy-agent";
import {HttpProxyAgent} from "http-proxy-agent";

/**
 * @description Luminati proxy provider.
 */
export class Luminati implements Provider {
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
    return this.sessionId;
  }

  /**
   * @description Returns country.
   * @returns {ECountry}
   */
  getCountry(): ECountry {
    return this.country;
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
    return this.createProxyAgents(params);
  }

  /**
   * @description Create proxy agents with a specific country and a random sessionId.
   * @param {ICreateProxy} params
   * @returns {ICreateProxyConfig}
   */
  public createAgentsSpecificCountriesAndRandomSessionId(params: ICreateProxy): ICreateProxyConfig {
    return this.createProxyAgents(params);
  }

  /**
   * @description Creates proxy agents with a random country and a specific sessionId
   * @param {ICreateProxy} params
   * @returns {ICreateProxyConfig}
   */
  public createAgentsRandomCountryAndSpecificSessionId(params: ICreateProxy): ICreateProxyConfig {
    return this.createProxyAgents(params);
  }

  /**
   * @description Create https and http proxies.
   * @param {ICreateProxy} params
   * @returns {ICreateProxyConfig}
   */
  private createProxyAgents(params: ICreateProxy): ICreateProxyConfig {
    const { sessionId, country } = params;

    const auth: string = replacer('{zone}{sessionId}{country}:{password}', {
      zone: this.config.username,
      sessionId: `-session-${sessionId}`,
      country: `-country-${country}`,
      password: this.config.password,
    });

    const proxy = {
      host: this.config.host,
      port: this.config.port,
      auth,
    };

    this.sessionId = sessionId;
    this.country = country;

    return {
      httpsAgent: new HttpsProxyAgent({ ...proxy, rejectUnauthorized: false }),
      httpAgent: new HttpProxyAgent({ ...proxy, rejectUnauthorized: false }),
    };
  }
}
