import { AxiosRequestConfig } from 'axios';
import { EStrategyMode } from '../base/types';

interface IStormProxiesConfig {
  axiosConfig?: AxiosRequestConfig;
  strategy: TStormProxiesStrategy;
}

type ProxyMappingIpPort = {
  host: string;
  port: number;
};

type TStormProxiesStrategy = {
  mode?: EStrategyMode.CHANGE_IP_EVERY_REQUESTS;
  mapping: ProxyMappingIpPort[];
};

export { TStormProxiesStrategy, IStormProxiesConfig, ProxyMappingIpPort };
