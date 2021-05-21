import { AxiosRequestConfig } from 'axios';
import { EStrategyMode, IProviderConfig } from '../base/types';

interface IProxyrackProviderConfig extends IProviderConfig {
  username: string;
  password: string;
}

interface IProxyrackConfig {
  proxy: IProxyrackProviderConfig;
  axiosConfig?: AxiosRequestConfig;
  strategy?: TProxyrackStrategy;
}

type TProxyrackStrategy = TProxyrackStrategyChangeIpEveryRequest;

type TProxyrackStrategyChangeIpEveryRequest = {
  mode: EStrategyMode.CHANGE_IP_EVERY_REQUESTS;
};

export { IProxyrackConfig, TProxyrackStrategy, TProxyrackStrategyChangeIpEveryRequest };
