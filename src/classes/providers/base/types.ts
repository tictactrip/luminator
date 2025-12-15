import { HttpsProxyAgent } from 'https-proxy-agent';
import { HttpProxyAgent } from 'http-proxy-agent';
import { AxiosRequestConfig } from 'axios';
import { IAxiosRetryConfig } from 'axios-retry';

enum EStrategyMode {
  MANUAL = 'MANUAL',
  CHANGE_IP_EVERY_REQUESTS = 'CHANGE_IP_EVERY_REQUESTS',
}

interface IBaseConfig {
  axiosConfig?: AxiosRequestConfig;
  retryConfig?: IAxiosRetryConfig;
}

interface ICreateProxyConfig {
  httpsAgent: HttpsProxyAgent<string>;
  httpAgent: HttpProxyAgent<string>;
}

interface IProviderConfig {
  host: string;
  port: number;
}

export { EStrategyMode, IBaseConfig, ICreateProxyConfig, IProviderConfig };
