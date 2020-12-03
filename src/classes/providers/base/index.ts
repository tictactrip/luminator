import { ICreateProxyConfig, ICreateProxy } from './types';

export abstract class Provider {
  /**
   * @description Create https and http proxies.
   * @param {ICreateProxy} params
   * @returns {ICreateProxyConfig}
   */
  public abstract createProxyAgents(params: ICreateProxy): ICreateProxyConfig;
}
