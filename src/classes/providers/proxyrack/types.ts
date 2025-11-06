import { AxiosRequestConfig } from 'axios';
import { EStrategyMode } from '../base/types';

type TProxyrackProviderConfig = {
  username: string;
  password: string;
  host: string;
  ports: number[];
};

interface IProxyrackCommonConfig {
  axiosConfig?: AxiosRequestConfig;
}

interface TProxyrackConfig extends IProxyrackCommonConfig {
  proxy: TProxyrackProviderConfig;
  strategy: EStrategyMode.MANUAL | EStrategyMode.CHANGE_IP_EVERY_REQUESTS;
}

export { TProxyrackConfig, TProxyrackProviderConfig };
