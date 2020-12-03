import { Provider } from '../base';
import { ICreateProxy, ICreateProxyConfig, IProviderConfig } from '../base/types';
import { replacer } from '../../../utils/replacer';

/**
 * @description Luminati proxy provider.
 */
export class Luminati implements Provider {
  private readonly config: IProviderConfig;

  /**
   * @constructor
   * @param {IProviderConfig} config
   */
  constructor(config: IProviderConfig) {
    this.config = config;
  }

  /**
   * @description Create https and http proxies.
   * @param {ICreateProxy} params
   * @returns {ICreateProxyConfig}
   */
  public createProxyAgents(params: ICreateProxy): ICreateProxyConfig {
    const { sessionId, country } = params;

    const auth: string = replacer('{zone}{sessionId}{country}:{password}', {
      zone: this.config.username,
      sessionId: `-session-${sessionId}`,
      country: `-country-${country}`,
      password: this.config.password,
    });

    return {
      proxy: {
        host: this.config.host,
        port: this.config.port,
        auth,
      },
      country,
      session: sessionId,
    };
  }
}
