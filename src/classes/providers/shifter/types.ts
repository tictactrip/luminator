import { AxiosRequestConfig } from 'axios';
import { IProviderConfig, EStrategyMode } from '../base/types';

type TShifterStrategy = TShifterStrategyChangeIpEveryRequest;

enum EShifterCountry {
  FRANCE = 'fr',
  BELGIUM = 'be',
  SWITZERLAND = 'ch',
}

interface IShifterCountryPortMapping {
  fr: number[];
  be: number[];
  ch: number[];
}

interface IShifterConfig {
  proxy: IProviderConfig;
  axiosConfig?: AxiosRequestConfig;
  strategy?: TShifterStrategy;
}

interface IShifterChangeIp {
  countries?: EShifterCountry[];
}

type TShifterStrategyChangeIpEveryRequest = {
  mode: EStrategyMode.CHANGE_IP_EVERY_REQUESTS;
  mapping?: IShifterCountryPortMapping;
};

export { TShifterStrategy, IShifterConfig, EShifterCountry, IShifterChangeIp, IShifterCountryPortMapping };
