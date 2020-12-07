import * as HttpsProxyAgent from 'https-proxy-agent';
import { HttpProxyAgent } from 'http-proxy-agent';
import { ICreateProxyConfig } from '../base/types';
import { replacer } from '../../../utils/replacer';
import { Base } from '../base';
import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { IProxyrackConfig } from './types';

/**
 * @description Proxyrack proxy provider.
 */
export class Proxyrack extends Base {
  private readonly config: IProxyrackConfig;
  private setIpInitialized: boolean;

  /**
   * @constructor
   * @param {IProxyrackConfig} config
   */
  constructor(config: IProxyrackConfig) {
    super();
    this.config = config;
    this.setIpInitialized = false;
  }

  /**
   * @description Sends request.
   * @param {AxiosRequestConfig} axiosRequestConfig
   * @returns {AxiosPromise}
   */
  fetch(axiosRequestConfig: AxiosRequestConfig): AxiosPromise {
    if (!this.setIpInitialized) {
      this.setIp();
    }

    return this.sendRequest(axiosRequestConfig);
  }

  /**
   * @description Create and set proxy agents.
   * @returns {Proxyrack}
   */
  setIp(): Proxyrack {
    const { httpAgent, httpsAgent } = this.createProxyAgents();

    this.axios.defaults.httpsAgent = httpsAgent;
    this.axios.defaults.httpAgent = httpAgent;

    this.setIpInitialized = true;

    return this;
  }

  /**
   * @description Create https and http proxies.
   * @returns {ICreateProxyConfig}
   */
  private createProxyAgents(): ICreateProxyConfig {
    const auth: string = replacer('{username}:{password}', {
      username: this.config.proxy.username,
      password: this.config.proxy.password,
    });

    const proxy = {
      host: this.config.proxy.host,
      port: this.config.proxy.port,
      auth,
    };

    return {
      httpsAgent: new HttpsProxyAgent({ ...proxy, rejectUnauthorized: false }),
      httpAgent: new HttpProxyAgent({ ...proxy, rejectUnauthorized: false }),
    };
  }
}
