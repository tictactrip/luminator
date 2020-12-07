import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios';
import * as HttpsProxyAgent from 'https-proxy-agent';
import { HttpProxyAgent } from 'http-proxy-agent';
import { ICreateProxyConfig, EStrategyMode } from '../base/types';
import { replacer } from '../../../utils/replacer';
import { Base } from '../base';
import { ILuminatiConfig, TStrategy } from './types';
import { config } from '../../../config';
import { ELuminatiCountry, ILuminatiCreateProxy, ILuminatiChangeIp } from './types';

/**
 * @description Luminati proxy provider.
 * @extends {Base}
 */
export class Luminati extends Base {
  private readonly config: ILuminatiConfig;
  public axios: AxiosInstance;

  public sessionId: number;
  public country: ELuminatiCountry;

  private readonly strategy: TStrategy;

  /**
   * @constructor
   * @param {ILuminatiConfig} config
   */
  constructor(config: ILuminatiConfig) {
    super();
    this.config = config;
    this.strategy = config.strategy;

    // Throw an error is country array is empty
    if (this.strategy && this.strategy.mode === EStrategyMode.CHANGE_IP_EVERY_REQUESTS) {
      Luminati.checkIfCountriesArrayIsntEmpty(this.strategy.countries);
    }

    if (config.axiosConfig) {
      this.axios = axios.create({ ...config.axiosConfig, proxy: false });
    } else {
      this.axios = axios.create({ proxy: false });
    }
  }

  /**
   * @description Generate a new agent.
   * @param {ILuminatiChangeIp} [params] - Params to handle multiple strategies.
   * @returns {Luminati}
   */
  setIp(params?: ILuminatiChangeIp): Luminati {
    // Creates an agent with a random countries and sessionId
    if (!params) {
      const { httpAgent, httpsAgent } = this.createProxyAgents({
        country: this.getRandomCountry(),
        sessionId: this.randomNumber(config.session.randomLimit.min, config.session.randomLimit.max),
      });

      this.axios.defaults.httpsAgent = httpsAgent;
      this.axios.defaults.httpAgent = httpAgent;

      return this;
    }

    // Creates an agent with specific countries and a specific sessionId
    if (params.countries && params.sessionId) {
      Luminati.checkIfCountriesArrayIsntEmpty(params.countries);

      const { httpsAgent, httpAgent } = this.createProxyAgents({
        country: this.getRandomCountry(params.countries),
        sessionId: params.sessionId,
      });

      this.axios.defaults.httpsAgent = httpsAgent;
      this.axios.defaults.httpAgent = httpAgent;

      return this;
    }

    // Create an agent with specific countries and a random sessionId
    if (params.countries) {
      Luminati.checkIfCountriesArrayIsntEmpty(params.countries);

      const { httpAgent, httpsAgent } = this.createProxyAgents({
        country: this.getRandomCountry(params.countries),
        sessionId: this.randomNumber(config.session.randomLimit.min, config.session.randomLimit.max),
      });

      this.axios.defaults.httpsAgent = httpsAgent;
      this.axios.defaults.httpAgent = httpAgent;

      return this;
    }

    // Creates an agent with a random country and a specific sessionId
    const { httpsAgent, httpAgent } = this.createProxyAgents({
      country: this.getRandomCountry(),
      sessionId: params.sessionId,
    });

    this.axios.defaults.httpsAgent = httpsAgent;
    this.axios.defaults.httpAgent = httpAgent;

    return this;
  }

  /**
   * @description Sends request.
   * @param {AxiosRequestConfig} axiosRequestConfig
   * @returns {AxiosPromise}
   */
  fetch(axiosRequestConfig: AxiosRequestConfig): AxiosPromise {
    if (this.strategy && this.strategy.mode === EStrategyMode.CHANGE_IP_EVERY_REQUESTS) {
      this.setIp({ countries: this.strategy.countries });
    }

    return this.sendRequest(axiosRequestConfig);
  }

  /**
   * @description Returns a random country.
   * @params {ELuminatiCountry} [countries] - List of countries
   * @returns {ELuminatiCountry}
   */
  private getRandomCountry(countries?: ELuminatiCountry[]): ELuminatiCountry {
    let countrykeys: string[];
    if (countries) {
      countrykeys = Object.entries(ELuminatiCountry)
        .map(([key, value]: [string, ELuminatiCountry]) => {
          if (countries.includes(value)) {
            return key;
          }
        })
        .filter(Boolean);
    } else {
      countrykeys = Object.keys(ELuminatiCountry);
    }

    const randomCountryKey: string = countrykeys[this.randomNumber(0, countrykeys.length - 1)];

    return ELuminatiCountry[randomCountryKey];
  }

  /**
   * @description Checks if country array isn't empty.
   * @param {ELuminatiCountry[]} countries
   * @throws {Error} Will throw an error if countries is empty
   * @returns {void}
   */
  private static checkIfCountriesArrayIsntEmpty(countries: ELuminatiCountry[]): void {
    if (!countries.length) {
      throw new Error('"countries" array cannot be empty');
    }
  }

  /**
   * @description Create https and http proxies.
   * @param {ILuminatiCreateProxy} params
   * @returns {ICreateProxyConfig}
   */
  private createProxyAgents(params: ILuminatiCreateProxy): ICreateProxyConfig {
    const { sessionId, country } = params;

    const auth: string = replacer('{zone}{sessionId}{country}:{password}', {
      zone: this.config.proxy.username,
      sessionId: `-session-${sessionId}`,
      country: `-country-${country}`,
      password: this.config.proxy.password,
    });

    const proxy = {
      host: this.config.proxy.host,
      port: this.config.proxy.port,
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
