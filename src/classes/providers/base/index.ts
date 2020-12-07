import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios';

interface IBaseConfig {
  axiosConfig?: AxiosRequestConfig;
}

export class Base {
  public axios: AxiosInstance;

  /**
   * @constructor
   * @param {IBaseConfig} config
   */
  constructor(config: IBaseConfig) {
    if (config.axiosConfig) {
      this.axios = axios.create({ ...config.axiosConfig, proxy: false });
    } else {
      this.axios = axios.create({ proxy: false });
    }
  }

  /**
   * @description Sends request.
   * @param {AxiosRequestConfig} axiosRequestConfig
   * @returns {AxiosPromise}
   */
  sendRequest(axiosRequestConfig: AxiosRequestConfig): AxiosPromise {
    if (!this.axios.defaults.httpsAgent && !this.axios.defaults.httpAgent) {
      throw new Error('Your are trying to send a request without setting a Strategy or calling setIp().');
    }

    return this.axios(axiosRequestConfig);
  }

  /**
   * @returns Returns a number between two included numbers.
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  protected randomNumber(min: number, max: number): number {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }
}
