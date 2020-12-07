import { ICreateProxyConfig, ICreateProxy, ECountry } from './types';
import {AxiosInstance} from "axios";

export abstract class Provider {
  public axios: AxiosInstance;

  /**
   * @description Returns session id.
   * @returns {number}
   */
  public abstract getSessionId(): number;

  /**
   * @description Returns country.
   * @returns {ECountry}
   */
  public abstract getCountry(): ECountry;

  /**
   * @description Creates proxy agents with a random country and sessionId.
   * @param {ICreateProxy} params
   * @returns {ICreateProxyConfig}
   */
  public abstract createAgentsWithRandomCountryAndSessionId(params: ICreateProxy): ICreateProxyConfig;

  /**
   * @description Creates proxy agents with specific countries and a specific sessionId.
   * @param {ICreateProxy} params
   * @returns {ICreateProxyConfig}
   */
  public abstract createAgentsSpecificCountryAndSessionsId(params: ICreateProxy): ICreateProxyConfig;

  /**
   * @description Create proxy agents with a specific country and a random sessionId.
   * @param {ICreateProxy} params
   * @returns {ICreateProxyConfig}
   */
  public abstract createAgentsSpecificCountriesAndRandomSessionId(params: ICreateProxy): ICreateProxyConfig;

  /**
   * @description Creates proxy agents with a random country and a specific sessionId
   * @param {ICreateProxy} params
   * @returns {ICreateProxyConfig}
   */
  public abstract createAgentsRandomCountryAndSpecificSessionId(params: ICreateProxy): ICreateProxyConfig;
}
