import { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios';
import * as HttpsProxyAgent from 'https-proxy-agent';
import { HttpProxyAgent } from 'http-proxy-agent';
import { ICreateProxyConfig, EStrategyMode } from '../base/types';
import { Base } from '../base';
import {
  IShifterConfig,
  TShifterStrategy,
  EShifterCountry,
  IShifterChangeIp,
  IShifterCountryPortMapping,
} from './types';

/**
 * @description Schifter proxy provider.
 * @extends {Base}
 */
export class Shifter extends Base {
  public axios: AxiosInstance;
  public country: EShifterCountry;

  private readonly config: IShifterConfig;
  private readonly strategy: TShifterStrategy;

  /**
   * @constructor
   * @param config
   */
  constructor(config: IShifterConfig) {
    super({ axiosConfig: config.axiosConfig });
    this.config = config;
    this.strategy = config.strategy;

    if (this.strategy && this.strategy.mode === EStrategyMode.CHANGE_IP_EVERY_REQUESTS) {
      this.isCountryPortMappingEmpty(this.strategy.mapping);
    }
  }

  /**
   * @description Create and set proxy agents. A different port matches a
   * different country / IP
   * @param {IShifterChangeIp} [params] Params to handle multiple strategies
   * @returns
   */
  setIp(params?: IShifterChangeIp): Shifter {
    let proxyConfig: ICreateProxyConfig;

    if (!params) {
      proxyConfig = this.createProxyAgents({
        port: this.getRandomPort(),
      });
    } else if (params.countries) {
      proxyConfig = this.createProxyAgents({
        port: this.getRandomPort(params.countries),
      });
    }

    this.axios.defaults.httpsAgent = proxyConfig.httpsAgent;
    this.axios.defaults.httpAgent = proxyConfig.httpAgent;

    return this;
  }

  private getRandomPort(countries?: EShifterCountry[]): number {
    const ports: number[] = this.config.strategy.mapping[this.getRandomCountry(countries)];

    return ports[this.randomNumber(0, ports.length - 1)];
  }

  private getRandomCountry(countries?: EShifterCountry[]): string {
    let countryKeys: string[];

    if (countries) {
      countryKeys = Object.values(EShifterCountry).filter((country) => countries.includes(country));
    } else {
      countryKeys = Object.values(EShifterCountry);
    }

    const randomCountryKey: string = countryKeys[this.randomNumber(0, countryKeys.length - 1)];

    return randomCountryKey;
  }

  private isCountryPortMappingEmpty(mapping: IShifterCountryPortMapping): void {
    if (!Object.keys(mapping).length) {
      throw new Error('A port-to-country mapping has to be provided');
    }
  }

  /**
   * @description Sends request.
   * @param axiosRequestConfig
   * @returns {AxiosPromise}
   */
  fetch(axiosRequestConfig: AxiosRequestConfig): AxiosPromise {
    if (this.strategy && this.strategy.mode === EStrategyMode.CHANGE_IP_EVERY_REQUESTS) {
      this.setIp();
    }

    return this.sendRequest(axiosRequestConfig);
  }

  private createProxyAgents(params): ICreateProxyConfig {
    const proxy = {
      host: this.config.proxy.host,
      port: params.port,
    };

    return {
      httpsAgent: new HttpsProxyAgent({ ...proxy, rejectUnauthorized: false }),
      httpAgent: new HttpProxyAgent({ ...proxy, rejectUnauthorized: false }),
    };
  }
}
