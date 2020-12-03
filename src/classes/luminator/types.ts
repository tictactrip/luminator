import { AxiosRequestConfig } from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { HttpProxyAgent } from 'http-proxy-agent';
import { Luminati } from '../providers/luminati';
import { ECountry, IProviderConfig } from '../providers/base/types';

enum EStrategyMode {
  CHANGE_IP_EVERY_REQUESTS = 'CHANGE_IP_EVERY_REQUESTS',
}

type TStrategyChangeIpEveryRequest = {
  mode: EStrategyMode.CHANGE_IP_EVERY_REQUESTS;
  countries: ECountry[];
};

type TStrategy = TStrategyChangeIpEveryRequest;

interface IConfig {
  proxy: IProviderConfig;
  provider: EProvider;
  axiosConfig?: AxiosRequestConfig;
  strategy?: TStrategy;
}

interface IChangeIp {
  countries?: ECountry[];
  sessionId?: number;
}

interface ICreateProxyAgents {
  httpsAgent: HttpsProxyAgent;
  httpAgent: HttpProxyAgent;
}

enum EProvider {
  LUMINATI,
}

type TProvider = Luminati;

export {
  EStrategyMode,
  EProvider,
  TProvider,
  TStrategy,
  TStrategyChangeIpEveryRequest,
  IConfig,
  ICreateProxyAgents,
  // ICreateProxy,
  IChangeIp,
};
