import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as dns from 'dns';
import * as HttpsProxyAgent from 'https-proxy-agent';

type Proxy = {
  host: string,
  port: number,
  auth: {
    username: string,
    password: string
  },
}

interface IProxyManagerOption {
  host: string,
  port: number,
  auth: string
}

/**
 * luminator doc
 */
export class Luminator {
  public static STATUS_CODE_FOR_RETRY: number[] = [403, 429, 502, 503];
  private static readonly USER_AGENT: string =
    'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';
  private static readonly SWITCH_IP_EVERY_N_REQ: number = 30;
  private static readonly MAX_FAILURES: number = 3;
  private static readonly REQ_TIMEOUT: number = 60 * 1000;
  private static readonly MAX_FAILURES_REQ: number = 11;
  private failuresCountReq: number = 0;
  private nReqForExitNode: number = 0;
  private failCount: number = 0;
  private readonly username: string;
  private readonly password: string;
  private readonly superProxy: string;
  private readonly country: string;
  private readonly port: number;

  private superProxyHost: string;
  private superProxyUrl: Proxy;
  private sessionId: number;

  constructor(username: string, password: string, superProxy: string = 'NL', country: string = 'fr', port: number = 22225) {
    this.username = username;
    this.password = password;
    this.superProxy = superProxy;
    this.country = country;
    this.port = port;
    this.switchSessionId();
  }

  private static statusCodeRequiresExitNodeSwitch(statusCode: number): boolean {
    return [403, 429, 502, 503].includes(statusCode);
  }

  private static getRandomNumber(): number {
    return Math.random();
  }

  private static getSessionId(): number {
    return Math.trunc(Luminator.getRandomNumber() * 1000000);
  }

  public async fetch(params: AxiosRequestConfig): Promise<AxiosResponse> {
    if (this.failuresCountReq >= Luminator.MAX_FAILURES_REQ) {
      throw new Error('MAX_FAILURES_REQ threshold reached');
    } // break with too much failure
    if (this.nReqForExitNode >= Luminator.SWITCH_IP_EVERY_N_REQ) {
      await this.switchSessionId();
    }

    if (!this.haveGoodSuperProxy()) {
      await this.switchSuperProxy();
    }



    try {
      const response = await axios(this.getAxiosRequestConfig(params));
      this.failCount = 0;
      this.nReqForExitNode += 1;
      this.failuresCountReq = 0;

      return response;
    } catch (err) {
      this.failuresCountReq += 1;
      if (err.response && !Luminator.statusCodeRequiresExitNodeSwitch(err.response.status)) { // this could be 404 or other website error
        this.nReqForExitNode += 1;

        throw err;
      }
      this.switchSessionId();
      this.failCount += 1;

      return this.fetch(params);
    }
  }

  public switchSessionId(): void {
    this.sessionId = Luminator.getSessionId();
    this.nReqForExitNode = 0;
    this.updateSuperProxyUrl();
  }

  private getProxyOptions(): IProxyManagerOption {
    return {
      host: this.superProxyUrl.host,
      port: this.superProxyUrl.port,
      auth: `${this.superProxyUrl.auth.username}:${this.superProxyUrl.auth.password}`,
    }
  }

  private getAxiosRequestConfig(params: AxiosRequestConfig): AxiosRequestConfig {
    return {
      timeout: Luminator.REQ_TIMEOUT,
      headers: { 'User-Agent': Luminator.USER_AGENT },
      httpsAgent: new HttpsProxyAgent(this.getProxyOptions()),
      ...params,
    }
  }

  private haveGoodSuperProxy(): boolean {
    return this.superProxyHost && this.failCount < Luminator.MAX_FAILURES;
  }

  private getUsername(): string {
    return `${this.username}-country-${this.country}-session-${this.sessionId}`;
  }

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

  private getSuperProxyHost(): Promise<dns.LookupAddress> {
    return dns.promises.lookup(
      `session-${this.sessionId}-servercountry-${this.superProxy}.zproxy.lum-superproxy.io`,
    );
  }

  private async switchSuperProxy(): Promise<void> {
    this.switchSessionId();
    const address: dns.LookupAddress = await this.getSuperProxyHost();
    this.superProxyHost = address.address;
    this.updateSuperProxyUrl();
  }
}
