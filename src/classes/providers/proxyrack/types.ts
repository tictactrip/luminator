import { AxiosRequestConfig } from 'axios';
import { EStrategyMode } from '../base/types';

type TProxyrackProviderConfigStategyChangeIpEveryRequest = {
  username: string;
  password: string;
  host: string;
  port: number;
};

type TProxyrackProviderConfigStategyManual = {
  username: string;
  password: string;
  host: string;
  ports: number[];
};

interface IProxyrackCommonConfig {
  axiosConfig?: AxiosRequestConfig;
}

interface IProxyrackConfigStategyChangeIpEveryRequest extends IProxyrackCommonConfig {
  proxy: TProxyrackProviderConfigStategyChangeIpEveryRequest;
  strategy: EStrategyMode.CHANGE_IP_EVERY_REQUESTS;
}

interface IProxyrackConfigStategyManual extends IProxyrackCommonConfig {
  proxy: TProxyrackProviderConfigStategyManual;
  strategy: EStrategyMode.MANUAL;
}

type TProxyrackConfig = IProxyrackConfigStategyChangeIpEveryRequest | IProxyrackConfigStategyManual;

export { TProxyrackConfig, IProxyrackConfigStategyChangeIpEveryRequest, IProxyrackConfigStategyManual };
