import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as dns from 'dns';
import * as HttpsProxyAgent from 'https-proxy-agent';

type Proxy = {
  host: string;
  port: number;
  auth: {
    username: string;
    password: string;
  },
}

interface IProxyManagerOption {
  host: string;
  port: number;
  auth: string;
}
// 'NL' 'fr' 22225
interface ILuminatorConfig {
  superProxy: string;
  country: string;
  port: number;
}


/**
 * Luminator doc
 */
class Luminator {
  public static DEFAULT_CONFIG: ILuminatorConfig = {superProxy: 'NL', country: 'fr', port:22225 };
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
  private superProxyUrl: Proxy;
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
   *  generate a random int ID
   */
  private static getSessionId(): number {
    return Math.trunc(Math.random() * 1000000);
  }

  /**
   * method that take an AxiosRequestConfig and:
   * - return AxiosResponse when the server respond with a 200 status,
   * - throw an error if a status is not in the STATUS_CODE_FOR_RETRY
   * - retry if the status is in STATUS_CODE_FOR_RETRY and refresh sessionId:
   *    - if the server respond with a 200 status it returns AxiosResponse
   *    - if it reach the setted threshold it throw an error
   * return Promise<AxiosResponse>
   * @param params: AxiosRequestConfig
   */
  public async fetch(params: AxiosRequestConfig): Promise<AxiosResponse> {
    if (this.failuresCountRequests >= Luminator.MAX_FAILURES_REQ) {
      throw new Error('MAX_FAILURES_REQ threshold reached');
    }
    if (this.totalRequestsCounter >= Luminator.SWITCH_IP_EVERY_N_REQ) {
      await this.switchSessionId();
    }
    if (!this.haveGoodSuperProxy()) {
      await this.switchSuperProxy();
    }

    let response: AxiosResponse;
    try {
      response = await axios(this.getAxiosRequestConfig(params));
      this.onSuccessfulQuery();
    } catch (err) {
      this.failuresCountRequests += 1;
      if (!Luminator.STATUS_CODE_FOR_RETRY.includes(err.status)) {
        this.totalRequestsCounter += 1;
        throw err;
      }
      this.switchSessionId();
      this.failCount += 1;
    }

    return response || this.fetch(params);
  }

  /**
   * set a sessionId: int
   * reset totalRequestsCounter
   * update super proxyu url with the new session
   */
  public switchSessionId(): void {
    this.sessionId = Luminator.getSessionId();
    this.totalRequestsCounter = 0;
    this.updateSuperProxyUrl();
  }

  /**
   * reset the counter of fail count
   * and increment the counter of total requests
   */
  private onSuccessfulQuery(): void {
    this.failCount = 0;
    this.totalRequestsCounter += 1;
    this.failuresCountRequests = 0;
  }

  /**
   * build ProxyManagerOption for the httpsProxyAgent
   */
  private getProxyOptions(): IProxyManagerOption {
    return {
      host: this.superProxyUrl.host,
      port: this.superProxyUrl.port,
      auth: `${this.superProxyUrl.auth.username}:${this.superProxyUrl.auth.password}`,
    };
  }

  /**
   * build AxiosRequestConfig for the query
   */
  private getAxiosRequestConfig(params: AxiosRequestConfig): AxiosRequestConfig {
    return {
      timeout: Luminator.REQ_TIMEOUT,
      headers: { 'User-Agent': Luminator.USER_AGENT },
      httpsAgent: new HttpsProxyAgent(this.getProxyOptions()),
      ...params,
    };
  }

  /**
   * check if it has a proxy host and max failure threshold not reached
   */
  private haveGoodSuperProxy(): boolean {
    return this.superProxyHost && this.failCount < Luminator.MAX_FAILURES;
  }

  /**
   * return username Luminati format
   */
  private getUsername(): string {
    return `${this.username}-country-${this.country}-session-${this.sessionId}`;
  }

  /**
   *  set superProxyUrl
   */
  private updateSuperProxyUrl(): void {
    this.superProxyUrl = {
      host: this.superProxyHost,
      port: this.port,
      auth: {
        username: this.getUsername(),
        password: this.password,
      },
    };
  }

  /**
   * get the dns address from the luminati hostname
   */
  private getSuperProxyHost(): Promise<dns.LookupAddress> {
    return dns.promises.lookup(
      `session-${this.sessionId}-servercountry-${this.superProxy}.zproxy.lum-superproxy.io`,
    );
  }

  /**
   * switch session id and get dns address for the new sessionId
   * set the superProxyHost and update the superProxyUrl
   */
  private async switchSuperProxy(): Promise<void> {
    this.switchSessionId();
    const { address }: dns.LookupAddress = await this.getSuperProxyHost();
    this.superProxyHost = address;
    this.updateSuperProxyUrl();
  }
}

export {
  Luminator,
  IProxyManagerOption,
  Proxy,
};
