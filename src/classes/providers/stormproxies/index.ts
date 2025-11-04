import { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { HttpProxyAgent } from 'http-proxy-agent';
import { ICreateProxyConfig } from '../base/types';
import { Base } from '../base';
import { IStormProxiesConfig, ProxyMappingIpPort, TStormProxiesStrategy } from './types';

/**
 * @description StormProxies proxy provider.
 * @extends {Base}
 */
export class StormProxies extends Base {
  public axios: AxiosInstance;

  private readonly strategy: TStormProxiesStrategy;

  constructor(config: IStormProxiesConfig) {
    super({ axiosConfig: config.axiosConfig });
    this.strategy = config.strategy;

    this.isHostIpPortMappingProvided(this.strategy.mapping);
  }

  /**
   * Create and set proxy agents. A different port matches a
   * different country / IP.
   */
  setIp(): StormProxies {
    const { host, port } = this.getRandomIpPort();

    const { httpAgent, httpsAgent } = this.createProxyAgents({
      port,
      host,
    });

    this.axios.defaults.httpsAgent = httpsAgent;
    this.axios.defaults.httpAgent = httpAgent;

    return this;
  }

  /**
   * Picks a random host:port from given mapping.
   */
  private getRandomIpPort(): ProxyMappingIpPort {
    return this.strategy.mapping[this.randomNumber(0, this.strategy.mapping.length - 1)];
  }

  /**
   * Checks ip:port mapping is provided.
   */
  private isHostIpPortMappingProvided(mapping: ProxyMappingIpPort[]): void {
    if (!mapping.length) {
      throw new Error('A {IP}:{PORT} mapping has to be provided.');
    }
  }

  /**
   * Sends a request.
   */
  fetch(axiosRequestConfig: AxiosRequestConfig): AxiosPromise {
    this.setIp();

    return this.sendRequest(axiosRequestConfig);
  }

  /**
   * Creates both an HTTP and HTTPS proxy
   */
  private createProxyAgents(params: ProxyMappingIpPort): ICreateProxyConfig {
    return {
      httpsAgent: new HttpsProxyAgent(`http://${params.host}:${params.port}`),
      httpAgent: new HttpProxyAgent(`http://${params.host}:${params.port}`),
    };
  }
}
