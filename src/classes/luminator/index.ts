import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios';
import * as HttpsProxyAgent from 'https-proxy-agent';
import { replacer } from '../../utils/replacer';
import { ELuminatiCountry, IChangeIp, IConfig, ICreateProxy, ILuminatiConfig } from './types';

/**
 * @description Luminator class.
 */
export class Luminator {
  public axios: AxiosInstance;
  public httpsProxyAgent: HttpsProxyAgent;

  private readonly luminatiConfig: ILuminatiConfig;
  private readonly luminatiProxyDomain: string = 'zproxy.lum-superproxy.io';
  private readonly luminatiProxyPort: number = 22225;

  /**
   * @constructor
   * @param {IConfig} config
   */
  constructor(config: IConfig) {
    this.luminatiConfig = config.luminatiConfig;

    if(config.axiosConfig) {
      this.axios = axios.create({...config.axiosConfig, proxy: false, httpsAgent: this.httpsProxyAgent});
    } else {
      this.axios = axios.create({proxy: false, httpsAgent: this.httpsProxyAgent});
    }
  }

  /**
   * @description Generate a new agent.
   * @param {IChangeIp} params
   * @returns {Luminator}
   */
  changeIp(params?: IChangeIp): Luminator {

    // Creates an agent with a random country and sessionId
    if(!params) {
      this.axios.defaults.httpsAgent = this.createProxyAgent({
        country: this.getRandomCountry(),
        sessionId: this.randomNumber(0, 99999999),
      });

      return this;
    }

    // Creates an agent with a specific country and a specific sessionId
    if(params.country && params.sessionId) {
      this.axios.defaults.httpsAgent = this.createProxyAgent({country: params.country, sessionId: params.sessionId});

      return this;
    }

    // Create an agent with a specific country and a random sessionId
    if(params.country){
      this.axios.defaults.httpsAgent = this.createProxyAgent({
        country: params.country,
        sessionId: this.randomNumber(0, 99999999),
      });
    }

    // Creates an agent with a random country and a specific sessionId
    if(params.sessionId){
      this.axios.defaults.httpsAgent = this.createProxyAgent({
        country: this.getRandomCountry(),
        sessionId: params.sessionId,
      });
    }
  }

  fetch(axiosRequestConfig: AxiosRequestConfig): AxiosPromise {
    return this.axios(axiosRequestConfig);
  }

  /**
   * @description Returns a random country.
   * @returns {ELuminatiCountry}
   */
  private getRandomCountry(): ELuminatiCountry {
    const countries: string[] = Object.keys(ELuminatiCountry);
    const randomCountryKey: string = countries[this.randomNumber(0, countries.length)];

    return ELuminatiCountry[randomCountryKey];
  }

  /**
   * @description Create proxy.
   * @param {ICreateProxy} params
   * @returns {HttpsProxyAgent}
   */
  private createProxyAgent(params: ICreateProxy): HttpsProxyAgent {
    const { zone, password } = this.luminatiConfig;
    const { sessionId, country } = params;

    const auth: string = replacer('{zone}{sessionId}{country}:{password}', {
      zone,
      sessionId: sessionId ? `-session-${sessionId}` : '',
      country: country ? `-country-${country}` : '',
      password,
    });

    return new HttpsProxyAgent({
      host: this.luminatiProxyDomain,
      port: this.luminatiProxyPort,
      auth,
      rejectUnauthorized: false,
    });
  }

  /**
   * @returns Returns a number between two included numbers.
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  private randomNumber(min: number, max: number): number {
    // tslint:disable-next-line:insecure-random
    return Math.floor(min + Math.random() * (max + 1 - min));
  }
}
