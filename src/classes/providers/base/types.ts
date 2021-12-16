import * as HttpsProxyAgent from 'https-proxy-agent';
import { HttpProxyAgent } from 'http-proxy-agent';
import { AxiosRequestConfig } from 'axios';

enum EStrategyMode {
  MANUAL = 'MANUAL',
  CHANGE_IP_EVERY_REQUESTS = 'CHANGE_IP_EVERY_REQUESTS',
}

interface IBaseConfig {
  axiosConfig?: AxiosRequestConfig;
}

interface ICreateProxyConfig {
  httpsAgent: HttpsProxyAgent;
  httpAgent: HttpProxyAgent;
}

interface IProviderConfig {
  host: string;
  port: number;
}

export { EStrategyMode, IBaseConfig, ICreateProxyConfig, IProviderConfig };
