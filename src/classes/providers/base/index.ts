import { ICreateProxyAgents, ICreateProxy } from './types';

export abstract class Provider {
  /**
   * @description Create https and http proxies.
   * @param {ICreateProxy} params
   * @returns {ICreateProxyAgents}
   */
  public abstract createProxyAgents(params: ICreateProxy): ICreateProxyAgents;
}


