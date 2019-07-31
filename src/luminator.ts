import * as axios from 'axios';
import * as crypto from 'crypto';
import * as dns from 'dns';
import * as HttpsProxyAgent from 'https-proxy-agent';

interface IProxyManagerOption {
  host: string;
  port: number;
  auth: string;
}

interface ILuminatorConfig {
  superProxy: string;
  country: string;
  port: number;
}

/**
 * {@inheritDoc}
 * @description Luminator class.
 */
class Luminator {
  public static DEFAULT_CONFIG: ILuminatorConfig = { superProxy: 'NL', country: 'fr', port: 22225 };
  public static STATUS_CODE_FOR_RETRY: number[] = [403, 429, 502, 503];
  private static readonly USER_AGENT: string =
    'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';
  private static readonly SWITCH_IP_EVERY_N_REQ: number = 30;
  private static readonly MAX_FAILURES: number = 3;
  private static readonly REQ_TIMEOUT: number = 60 * 1000;
  private static readonly MAX_FAILURES_REQ: number = 4;
  private failuresCountRequests: number = 0;
  private totalRequestsCounter: number = 0;
  private failCount: number = 0;
  private readonly username: string;
  private readonly password: string;
  private readonly superProxy: string;
  private readonly country: string;
  private readonly port: number;
  private superProxyHost: string;
  private proxyManagerOptions: IProxyManagerOption;
  private sessionId: number;

  constructor(username: string, password: string, config: ILuminatorConfig = Luminator.DEFAULT_CONFIG) {
    this.username = username;
    this.password = password;
    this.superProxy = config.superProxy;
    this.country = config.country;
    this.port = config.port;
    this.switchSessionId();
  }

  /**
   * @description Generate a random id.
   * @return {number}
   */
  private static getSessionId(): number {
    return Math.trunc(crypto.randomBytes(8).readUInt32LE(1) / 0xffffffff * 1000000);
  }

  /**
   * @description return status if it is a valid AxiosError
   * @return {number}
   * @throws non axios error {Error}
   * @param error {axios.AxiosError}
   */
  private static getStatusFromAxiosError (error: axios.AxiosError): number {
    try {
      return error.response.status;
    } catch (e) {
      throw error
    }
  }

  /**
   * @description Method that take an AxiosRequestConfig and:
   * - return AxiosResponse when the server respond with a 200 status,
   * - throw an error if a status is not in the STATUS_CODE_FOR_RETRY
   * - retry if the status is in STATUS_CODE_FOR_RETRY and refresh sessionId:
   *    - if the server respond with a 200 status it returns AxiosResponse
   *    - if it reach the setted threshold it throw an error
   * @param params {AxiosRequestConfig}
   * @throws {Error}
   * @return {Promise<AxiosResponse>}
   */
  public async fetch(params: axios.AxiosRequestConfig): Promise<axios.AxiosResponse> {
    if (this.failuresCountRequests >= Luminator.MAX_FAILURES_REQ) {
      throw new Error('MAX_FAILURES_REQ threshold reached');
    }

    if (this.totalRequestsCounter >= Luminator.SWITCH_IP_EVERY_N_REQ) {
      this.switchSessionId();
    }

    if (!this.haveGoodSuperProxy()) {
      await this.switchSuperProxy();
    }

    let response: axios.AxiosResponse;

    try {
      response = await axios.default(this.getAxiosRequestConfig(params));
      this.onSuccessfulQuery();
    } catch (err) {
      this.onFailedQuery(err as axios.AxiosError);
    }

    return response !== undefined ? response : this.fetch(params);
  }

  /**
   * @description set a sessionId: int
   * reset totalRequestsCounter
   * update super proxyu url with the new session
   * @return {void}
   */
  public switchSessionId(): void {
    this.sessionId = Luminator.getSessionId();
    this.totalRequestsCounter = 0;
    this.updateProxyManagerOptions();
  }

  /**
   * @description Reset the counter of fail count and increment the counter of total requests.
   * @return {void}
   */
  private onSuccessfulQuery(): void {
    this.failCount = 0;
    this.totalRequestsCounter += 1;
    this.failuresCountRequests = 0;
  }

  /**
   * @description it is not a handled status code throw err
   * else switch ID and increment fail count
   * and increment the counter of total requests
   * @throws {Error}
   * @return void
   */
  private onFailedQuery(error: axios.AxiosError): void {
    this.failuresCountRequests += 1;
    const status: number = Luminator.getStatusFromAxiosError(error);

    if (Luminator.STATUS_CODE_FOR_RETRY.includes(status) === false) {
      this.totalRequestsCounter += 1;
      throw error;
    }

    this.switchSessionId();
    this.failCount += 1;
  }

  /**
   * @description Builds AxiosRequestConfig for the query.
   * @param params {AxiosRequestConfig}
   * @return {AxiosRequestConfig}
   */
  private getAxiosRequestConfig(params: axios.AxiosRequestConfig): axios.AxiosRequestConfig {
    return {
      timeout: Luminator.REQ_TIMEOUT,
      headers: { 'User-Agent': Luminator.USER_AGENT },
      httpsAgent: new HttpsProxyAgent(this.proxyManagerOptions),
      ...params,
    };
  }

  /**
   * @description Checks if it has a proxy host and max failure threshold not reached.
   * @return {boolean}
   */
  private haveGoodSuperProxy(): boolean {
    return this.superProxyHost !== undefined && this.failCount < Luminator.MAX_FAILURES;
  }

  /**
   * @description Returns username Luminati format.
   * @return {string}
   */
  private getUsername(): string {
    return `${this.username}-country-${this.country}-session-${this.sessionId}`;
  }

  /**
   * @description Set proxyManagerOptions.
   * @return {void}
   */
  private updateProxyManagerOptions(): void {
    this.proxyManagerOptions = {
      host: this.superProxyHost,
      port: this.port,
      auth: `${this.getUsername()}:${this.password}`
    };
  }

  /**
   * @description Get the dns address from the luminati hostname.
   * @return {Promise<dns.LookupAddress>}
   */
  private getSuperProxyHost(): Promise<dns.LookupAddress> {
    return dns.promises.lookup(
      `session-${this.sessionId}-servercountry-${this.superProxy}.zproxy.lum-superproxy.io`,
    );
  }

  /**
   * @description Switch session id and get dns address for the new sessionId
   * set the superProxyHost and update the proxyManagerOptions.
   * @return {Promise<void>}
   */
  private async switchSuperProxy(): Promise<void> {
    this.switchSessionId();
    const { address }: dns.LookupAddress = await this.getSuperProxyHost();
    this.superProxyHost = address;
    this.updateProxyManagerOptions();
  }
}

export {
  Luminator,
  IProxyManagerOption,
  ILuminatorConfig,
};
