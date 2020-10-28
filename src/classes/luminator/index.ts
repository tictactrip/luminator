import axios, { AxiosInstance } from 'axios';
import * as HttpsProxyAgent from 'https-proxy-agent';
import { replacer } from '../../utils/replacer';
import { ELuminatiCountry, IConfig, ICreateProxy, ILuminatiConfig } from './types';

/**
 * @description Luminator class.
 */
class Luminator {
  public axios: AxiosInstance;
  public httpsProxyAgent: HttpsProxyAgent;

  private readonly luminatiConfig: ILuminatiConfig;
  private readonly luminatiProxy: string = 'zproxy.lum-superproxy.io';

  /**
   * @constructor
   * @param {IConfig} config
   */
  constructor(config: IConfig) {
    this.luminatiConfig = config.luminatiConfig;
    this.httpsProxyAgent = new HttpsProxyAgent(config.httpsProxyAgent);

    if(config.axiosConfig) {
      this.axios = axios.create({...config.axiosConfig, proxy: false, httpsAgent: this.httpsProxyAgent});
    } else {
      this.axios = axios.create({proxy: false, httpsAgent: this.httpsProxyAgent});
    }
  }

  /**
   * @param params
   */
  changeIp(params?: {country?: ELuminatiCountry, sessionId?: number}): Luminator {

    // Creates a random sessionId and country proxy agent
    if(!params) {
      const countries: string[] = Object.keys(ELuminatiCountry);
      const randomCountryKey: string = countries[this.randomNumber(0, countries.length)];

      this.axios.defaults.httpsAgent = this.createProxyAgent({
        country: ELuminatiCountry[randomCountryKey],
        sessionId: this.randomNumber(0, 99999999),
      });

      return this;
    }

    // Creates a specific agent
    if(params.country && params.sessionId) {
      this.axios.defaults.httpsAgent = this.createProxyAgent({country: params.country, sessionId: params.sessionId});

      return this;
    }


    if(params.country){
      this.axios.defaults.httpsAgent = this.createProxyAgent({
        country: params.country,
        sessionId: this.randomNumber(0, 99999999),
      });
    }

    if(params.sessionId){


      this.axios.defaults.httpsAgent = this.createProxyAgent({
        country: params.country,
        sessionId: params.sessionId,
      });
    }
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
    const { zone, password, port} = this.luminatiConfig;
    const { sessionId, country } = params;

    const auth: string = replacer('{zone}{sessionId}{country}:${password}', {
      zone,
      session: sessionId ? `-session-${sessionId}-` : '',
      country: country ? `-country-${country}-` : '',
      password,
    });

    return new HttpsProxyAgent({
      host: this.luminatiProxy,
      port,
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
