import { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { HttpProxyAgent } from 'http-proxy-agent';
import { ICreateProxyConfig, EStrategyMode, IProviderConfig } from '../base/types';
import { Base } from '../base';
import {
  EShifterCountry,
  IShifterConfig,
  IShifterChangeIp,
  TShifterStrategy,
  TShifterCountryPortMapping,
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
   * @param {IShifterConfig} config
   */
  constructor(config: IShifterConfig) {
    super({ axiosConfig: config.axiosConfig });
    this.config = config;
    this.strategy = config.strategy;

    this.isCountryPortMappingEmpty(this.strategy.mapping);

    if (!this.strategy.mode) {
      this.strategy.mode == EStrategyMode.CHANGE_IP_EVERY_REQUESTS;
    }
  }

  /**
   * @description Create and set proxy agents. A different port matches a
   * different country / IP.
   * @param {IShifterChangeIp} params Params to handle multiple strategies.
   * @returns {Shifter} An instance of a shifter proxy provider.
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

  /**
   * @description Picks a random port from a list of matching countries.
   * @param {EShifterCountry[]} countries A list of verified countries.
   * @returns {number} A port number.
   */
  private getRandomPort(countries?: EShifterCountry[]): number {
    const ports: number[] = this.config.strategy.mapping[this.getRandomCountry(countries)];

    return ports[this.randomNumber(0, ports.length - 1)];
  }

  /**
   * @description Picks a random country among a given list of them.
   * @param {EShifterCountry[]} countries A list of verified countries.
   * @returns {string} A single country from the given list.
   */
  private getRandomCountry(countries?: EShifterCountry[]): string {
    let countryKeys: string[];

    if (countries) {
      countryKeys = Object.values(EShifterCountry).filter((country) => countries.includes(country));
    } else {
      countryKeys = Object.keys(this.config.strategy.mapping);
    }

    return countryKeys[this.randomNumber(0, countryKeys.length - 1)];
  }

  /**
   * @description Checks weither or not the mapping contains a single entry.
   * @param {TShifterCountryPortMapping} mapping country to port mapping.
   * @throws {Error} Will throw if mapping has no entries.
   */
  private isCountryPortMappingEmpty(mapping: TShifterCountryPortMapping): void {
    if (!Object.keys(mapping).length) {
      throw new Error('A port-to-country mapping has to be provided.');
    }
  }

  /**
   * @description Sends a request.
   * @param {AxiosRequestConfig} axiosRequestConfig
   * @returns {AxiosPromise}
   */
  fetch(axiosRequestConfig: AxiosRequestConfig): AxiosPromise {
    if (this.strategy && this.strategy.mode === EStrategyMode.CHANGE_IP_EVERY_REQUESTS) {
      this.setIp();
    }

    return this.sendRequest(axiosRequestConfig);
  }

  /**
   * @description Creates both an HTTP and HTTPS proxy
   * @param { port: number } params
   * @returns {ICreateProxyConfig}
   */
  private createProxyAgents(params: { port: number }): ICreateProxyConfig {
    const proxy: IProviderConfig = {
      host: this.config.proxy.host,
      port: params.port,
    };

    return {
      httpsAgent: new HttpsProxyAgent(`http://${proxy.host}:${proxy.port}`),
      httpAgent: new HttpProxyAgent(`http://${proxy.host}:${proxy.port}`),
    };
  }
}
