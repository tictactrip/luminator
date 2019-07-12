import bluebird from 'bluebird'; // promises lib used by request-promise
import { lookup as lookup0 } from 'dns';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import httpsProxyAgent from 'https-proxy-agent';

const lookup = bluebird.promisify(lookup0.lookup);

type ThttpsProxyAgent = {
  hostname: string,
  port: number,
  auth: string
}

type Proxy = {
  host: string,
  port: number,
  auth: {
    username: string,
    password: string
  },
}

interface ILogger {
  error(...supportedData: any[]): void
}

class LuminatiSessionManager {
  private readonly USER_AGENT: string =
    'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';
  private readonly SWITCH_IP_EVERY_N_REQ: number = 30;
  private readonly MAX_FAILURES: number = 3;
  private readonly REQ_TIMEOUT: number = 60 * 1000;
  private readonly MAX_FAILURES_REQ: number = 40;
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
  private logger: ILogger;

  constructor(username: string, password: string, superProxy: string = 'NL', country: string = 'fr', port: number = 22225, logger: ILogger = console) {
    this.username = username;
    this.password = password;
    this.superProxy = superProxy;
    this.country = country;
    this.port = port;
    this.logger = logger;
    this.switchSessionId();
  }

  public static LOGIN(username: string, password: string): (params: AxiosRequestConfig) => Promise<AxiosResponse> {

    return new LuminatiSessionManager(username, password).start;
  }

  private static statusCodeRequiresExitNodeSwitch(statusCode: number): boolean {
    return [403, 429, 502, 503].includes(statusCode);
  }

  private static getSessionId(): number {
    return (Math.random() * 1000000) | 0;
  }

  public async start(params: AxiosRequestConfig): Promise<AxiosResponse> {
    if (this.failuresCountReq >= this.MAX_FAILURES_REQ) { // todo : throw axios response object
      throw new Error('MAX_FAILURES_REQ threshold reached');
    } // break with too much failure
    if (!this.haveGoodSuperProxy()) {
      await this.switchSuperProxy();
    }
    if (this.nReqForExitNode === this.SWITCH_IP_EVERY_N_REQ) {
      this.switchSessionId();
    }

    const httpsAgentConfig: ThttpsProxyAgent = {
      hostname: this.superProxyUrl.host,
      port: this.superProxyUrl.port,
      auth: `${this.superProxyUrl.auth.username}:${this.superProxyUrl.auth.password}`,
    };

    const options: AxiosRequestConfig = {
      timeout: this.REQ_TIMEOUT,
      headers: { 'User-Agent': this.USER_AGENT },
      proxy: false,
      httpsAgent: new httpsProxyAgent(httpsAgentConfig),
      ...params,
    };

    try {
      const response = await axios(options);
      this.failCount = 0;
      this.nReqForExitNode += 1;
      this.failuresCountReq = 0;

      return response;
    } catch (err) {
      this.failuresCountReq += 1;
      if (
        err.response &&
        !LuminatiSessionManager.statusCodeRequiresExitNodeSwitch(err.response.status)
      ) {
        // this could be 404 or other website error
        this.nReqForExitNode += 1;
        throw err;
      }
      this.switchSessionId();
      this.failCount += 1;

      return this.start(params);
    }
  }

  private haveGoodSuperProxy(): boolean {
    return this.superProxyHost && this.failCount < this.MAX_FAILURES;
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

  private switchSessionId(): void {
    this.sessionId = LuminatiSessionManager.getSessionId();
    this.nReqForExitNode = 0;
    this.updateSuperProxyUrl();
  }

  private getSuperProxyHost(): Promise<string> {
    return lookup(
      `session-${this.sessionId}'-servercountry-${this.superProxy}.zproxy.lum-superproxy.io`,
    );
  }

  private async switchSuperProxy(): Promise<boolean> {
    this.switchSessionId();
    try {
      this.superProxyHost = await this.getSuperProxyHost();
      this.updateSuperProxyUrl();

      return true;
    } catch (e) {
      this.logger.error(e.message);

      return false;
    }
  }
}
