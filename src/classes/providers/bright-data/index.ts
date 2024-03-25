import { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { HttpProxyAgent } from 'http-proxy-agent';
import { URL } from 'node:url';
import { ICreateProxyConfig, EStrategyMode } from '../base/types';
import { replacer } from '../../../utils/replacer';
import { Base } from '../base';
import { IBrightDataConfig, TBrightDataStrategy } from './types';
import { config } from '../../../config';
import { EBrightDataCountry, IBrightDataCreateProxy, IBrightDataChangeIp } from './types';

/**
 * @description BrightData proxy provider.
 * @extends {Base}
 */
export class BrightData extends Base {
  public axios: AxiosInstance;
  public sessionId: number;
  public country: EBrightDataCountry;

  private readonly config: IBrightDataConfig;
  private readonly strategy: TBrightDataStrategy;

  /**
   * @constructor
   * @param {IBrightDataConfig} config
   */
  constructor(config: IBrightDataConfig) {
    super({ axiosConfig: config.axiosConfig });
    this.config = config;
    this.strategy = config.strategy;

    // Throw an error is country array is empty
    if (this.strategy && this.strategy.mode === EStrategyMode.CHANGE_IP_EVERY_REQUESTS) {
      BrightData.checkIfCountriesArrayIsntEmpty(this.strategy.countries);
    }
  }

  /**
   * @description Create and set proxy agents.
   * @param {IBrightDataChangeIp} [params] - Params to handle multiple strategies.
   * @returns {BrightData}
   */
  setIp(params?: IBrightDataChangeIp): BrightData {
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
      BrightData.checkIfCountriesArrayIsntEmpty(params.countries);

      const { httpsAgent, httpAgent }: ICreateProxyConfig = this.createProxyAgents({
        country: this.getRandomCountry(params.countries),
        sessionId: params.sessionId,
      });

      this.axios.defaults.httpsAgent = httpsAgent;
      this.axios.defaults.httpAgent = httpAgent;

      return this;
    }

    // Create an agent with specific countries and a random sessionId
    if (params.countries) {
      BrightData.checkIfCountriesArrayIsntEmpty(params.countries);

      const { httpAgent, httpsAgent } = this.createProxyAgents({
        country: this.getRandomCountry(params.countries),
        sessionId: this.randomNumber(config.session.randomLimit.min, config.session.randomLimit.max),
      });

      this.axios.defaults.httpsAgent = httpsAgent;
      this.axios.defaults.httpAgent = httpAgent;

      return this;
    }

    // Creates an agent with a random country and a specific sessionId
    const { httpsAgent, httpAgent }: ICreateProxyConfig = this.createProxyAgents({
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
   * @params {EBrightDataCountry} [countries] - List of countries
   * @returns {EBrightDataCountry}
   */
  private getRandomCountry(countries?: EBrightDataCountry[]): EBrightDataCountry {
    let countrykeys: string[];
    if (countries) {
      countrykeys = Object.entries(EBrightDataCountry)
        .map(([key, value]: [string, EBrightDataCountry]) => {
          if (countries.includes(value)) {
            return key;
          }
        })
        .filter(Boolean);
    } else {
      countrykeys = Object.keys(EBrightDataCountry);
    }

    const randomCountryKey: string = countrykeys[this.randomNumber(0, countrykeys.length - 1)];

    return EBrightDataCountry[randomCountryKey];
  }

  /**
   * @description Checks if country array isn't empty.
   * @param {EBrightDataCountry[]} countries
   * @throws {Error} Will throw an error if countries is empty
   * @returns {void}
   */
  private static checkIfCountriesArrayIsntEmpty(countries: EBrightDataCountry[]): void {
    if (!countries.length) {
      throw new Error('"countries" array cannot be empty');
    }
  }

  /**
   * @description Create https and http proxies.
   * @param {IBrightDataCreateProxy} params
   * @returns {ICreateProxyConfig}
   */
  private createProxyAgents(params: IBrightDataCreateProxy): ICreateProxyConfig {
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
      httpsAgent: new HttpsProxyAgent(new URL(`https://${proxy.auth}@${proxy.host}:${proxy.port}`), {
        rejectUnauthorized: false,
      }),
      httpAgent: new HttpProxyAgent(new URL(`http://${proxy.auth}@${proxy.host}:${proxy.port}`), {
        rejectUnauthorized: false,
      }),
    };
  }
}
