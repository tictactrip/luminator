import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import { IBaseConfig } from './types';

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

    // Configure axios-retry with sensible defaults and allow overrides from config.retryConfig
    const defaultRetryOptions = {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      shouldResetTimeout: true,
      retryCondition: axiosRetry.isNetworkOrIdempotentRequestError,
    };

    const retryOptions = config.retryConfig ? { ...defaultRetryOptions, ...config.retryConfig } : defaultRetryOptions;

    axiosRetry(this.axios, retryOptions);
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
