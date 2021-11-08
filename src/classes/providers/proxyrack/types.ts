import { AxiosRequestConfig } from 'axios';
import { EStrategyMode } from '../base/types';

type TProxyrackProviderConfigStrategyChangeIpEveryRequest = {
  username: string;
  password: string;
  host: string;
  port: number;
};

type TProxyrackProviderConfigStrategyManual = {
  username: string;
  password: string;
  host: string;
  ports: number[];
};

interface IProxyrackCommonConfig {
  axiosConfig?: AxiosRequestConfig;
}

interface IProxyrackConfigStategyChangeIpEveryRequest extends IProxyrackCommonConfig {
  proxy: TProxyrackProviderConfigStrategyChangeIpEveryRequest;
  strategy: EStrategyMode.CHANGE_IP_EVERY_REQUESTS;
}

interface IProxyrackConfigStategyManual extends IProxyrackCommonConfig {
  proxy: TProxyrackProviderConfigStrategyManual;
  strategy: EStrategyMode.MANUAL;
}

type TProxyrackConfig = IProxyrackConfigStategyChangeIpEveryRequest | IProxyrackConfigStategyManual;

export { TProxyrackConfig, IProxyrackConfigStategyChangeIpEveryRequest, IProxyrackConfigStategyManual };
