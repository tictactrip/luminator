import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { HttpProxyAgent } from 'http-proxy-agent';
import { EStrategyMode, ICreateProxyConfig } from '../base/types';
import { replacer } from '../../../utils/replacer';
import { Base } from '../base';
import { TProxyrackConfig } from './types';
import { URL } from 'node:url';

/**
 * @description Proxyrack proxy provider.
 */
export class Proxyrack extends Base {
  private readonly config: TProxyrackConfig;
  private setIpInitialized: boolean;

  /**
   * @constructor
   * @param {TProxyrackConfig} config
   */
  constructor(config: TProxyrackConfig) {
    super({ axiosConfig: config.axiosConfig });

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

    if (this.config.strategy === EStrategyMode.CHANGE_IP_EVERY_REQUESTS) {
      return this.setIp().sendRequest(axiosRequestConfig);
    } else {
      return this.sendRequest(axiosRequestConfig);
    }
  }

  /**
   * @description Create and set proxy agents.
   * @returns {Proxyrack}
   */
  setIp(): Proxyrack {
    const { httpAgent, httpsAgent }: ICreateProxyConfig = this.createProxyAgents();

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

    let port: number;
    if (this.config.strategy === EStrategyMode.CHANGE_IP_EVERY_REQUESTS) {
      port = this.config.proxy.port;
    } else {
      const randomArrayIndex: number = Math.floor(Math.random() * (this.config.proxy.ports.length - 1));
      port = this.config.proxy.ports[randomArrayIndex];
    }

    const proxy = {
      host: this.config.proxy.host,
      port,
      auth,
    };

    return {
      httpsAgent: new HttpsProxyAgent(new URL(`https://${proxy.host}:${proxy.port}`)),
      httpAgent: new HttpProxyAgent(new URL(`http://${proxy.host}:${proxy.port}`)),
    };
  }
}
