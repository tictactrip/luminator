import { AxiosRequestConfig } from 'axios';
import { EStrategyMode, IProviderConfig } from '../base/types';

interface IProxyrackConfig {
  proxy: IProviderConfig;
  axiosConfig?: AxiosRequestConfig;
  strategy?: TProxyrackStrategy;
}

type TProxyrackStrategy = TProxyrackStrategyChangeIpEveryRequest;

type TProxyrackStrategyChangeIpEveryRequest = {
  mode: EStrategyMode.CHANGE_IP_EVERY_REQUESTS;
};

export { IProxyrackConfig, TProxyrackStrategy, TProxyrackStrategyChangeIpEveryRequest };
