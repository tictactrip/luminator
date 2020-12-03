import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios';
import { config } from '../../config';
import { EProvider, EStrategyMode, IChangeIp, IConfig, TProvider, TStrategy } from './types';
import { Luminati } from '../providers/luminati';
import { ECountry, IProviderConfig } from '../providers/base/types';
// import {Proxyrack} from "../providers/proxyrack";

/**
 * @description Luminator class.
 */
export class Luminator {
  public axios: AxiosInstance;

  private readonly strategy: TStrategy;
  private readonly provider: TProvider;

  /**
   * @constructor
   * @param {IConfig} config
   */
  constructor(config: IConfig) {
    this.strategy = config.strategy;
    this.provider = Luminator.getProvider(config.provider, config.proxy);

    // Throw an error is country array is empty
    if (this.strategy && this.strategy.mode === EStrategyMode.CHANGE_IP_EVERY_REQUESTS) {
      Luminator.checkIfCountriesArrayIsntEmpty(this.strategy.countries);
    }

    if (config.axiosConfig) {
      this.axios = axios.create({ ...config.axiosConfig, proxy: false });
    } else {
      this.axios = axios.create({ proxy: false });
    }
  }

  /**
   * @description Returns session id.
   * @returns {number}
   */
  getSessionId(): number {
    return this.provider.getSessionId();
  }

  /**
   * @description Returns country.
   * @returns {ECountry}
   */
  getCountry(): ECountry {
    return this.provider.getCountry();
  }

  /**
   * @description Generate a new agent.
   * @param {IChangeIp} [params] - Params to handle multiple strategies.
   * @returns {Luminator}
   */
  setIp(params?: IChangeIp): Luminator {
    // Creates an agent with a random countries and sessionId
    if (!params) {
      const { httpAgent, httpsAgent } = this.provider.createAgentsWithRandomCountryAndSessionId({
        country: this.getRandomCountry(),
        sessionId: Luminator.randomNumber(config.session.randomLimit.min, config.session.randomLimit.max),
      });

      this.axios.defaults.httpsAgent = httpsAgent;
      this.axios.defaults.httpAgent = httpAgent;

      return this;
    }

    // Creates an agent with specific countries and a specific sessionId
    if (params.countries && params.sessionId) {
      Luminator.checkIfCountriesArrayIsntEmpty(params.countries);

      const { httpsAgent, httpAgent } = this.provider.createAgentsSpecificCountryAndSessionsId({
        country: this.getRandomCountry(params.countries),
        sessionId: params.sessionId,
      });

      this.axios.defaults.httpsAgent = httpsAgent;
      this.axios.defaults.httpAgent = httpAgent;

      return this;
    }

    // Create an agent with specific countries and a random sessionId
    if (params.countries) {
      Luminator.checkIfCountriesArrayIsntEmpty(params.countries);

      const { httpAgent, httpsAgent } = this.provider.createAgentsSpecificCountriesAndRandomSessionId({
        country: this.getRandomCountry(params.countries),
        sessionId: Luminator.randomNumber(config.session.randomLimit.min, config.session.randomLimit.max),
      });

      this.axios.defaults.httpsAgent = httpsAgent;
      this.axios.defaults.httpAgent = httpAgent;

      return this;
    }

    // Creates an agent with a random country and a specific sessionId
    const { httpsAgent, httpAgent } = this.provider.createAgentsRandomCountryAndSpecificSessionId({
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

    if (!this.axios.defaults.httpsAgent && !this.axios.defaults.httpAgent) {
      throw new Error('Your are trying to send a request without setting a Strategy or calling setIp().');
    }

    return this.axios(axiosRequestConfig);
  }

  /**
   * @description Returns a random country.
   * @params {ECountry} [countries] - List of countries
   * @returns {ECountry}
   */
  private getRandomCountry(countries?: ECountry[]): ECountry {
    let countrykeys: string[];
    if (countries) {
      countrykeys = Object.entries(ECountry)
        .map(([key, value]: [string, ECountry]) => {
          if (countries.includes(value)) {
            return key;
          }
        })
        .filter(Boolean);
    } else {
      countrykeys = Object.keys(ECountry);
    }

    const randomCountryKey: string = countrykeys[Luminator.randomNumber(0, countrykeys.length - 1)];

    return ECountry[randomCountryKey];
  }

  /**
   * @returns Returns a number between two included numbers.
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  private static randomNumber(min: number, max: number): number {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }

  /**
   * @description Checks if country array isn't empty.
   * @param {ECountry[]} countries
   * @throws {Error} Will throw an error if countries is empty
   * @returns {void}
   */
  private static checkIfCountriesArrayIsntEmpty(countries: ECountry[]): void {
    if (!countries.length) {
      throw new Error('"countries" array cannot be empty');
    }
  }

  /**
   * @description Instantiate right provider.
   * @param {EProvider} provider
   * @param {IProviderConfig} proxy
   * @returns: {TProvider}
   */
  private static getProvider(provider: EProvider, proxy: IProviderConfig): TProvider {
    if (provider === EProvider.LUMINATI) {
      return new Luminati(proxy);
    }
    // else if (provider === EProvider.PROXYRACK) {
    //   return new Proxyrack(proxy);
    // }
  }
}
