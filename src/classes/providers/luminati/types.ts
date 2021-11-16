import { AxiosRequestConfig } from 'axios';
import { IProviderConfig, EStrategyMode } from '../base/types';

type TLuminatiStrategy = TLuminatiStrategyChangeIpEveryRequest;

enum ELuminatiCountry {
  UNITED_STATES = 'us',
  GREAT_BRITAIN = 'gb',
  ALBANIA = 'al',
  ARGENTINA = 'ar',
  ARMENIA = 'am',
  AUSTRALIA = 'au',
  AUSTRIA = 'at',
  AZERBAIJAN = 'az',
  BANGLADESH = 'bd',
  BELARUS = 'by',
  BELGIUM = 'be',
  BOLIVIA = 'bo',
  BRAZIL = 'br',
  BULGARIA = 'bg',
  CAMBODIA = 'kh',
  CANADA = 'ca',
  CHILE = 'cl',
  CHINA = 'cn',
  COLOMBIA = 'co',
  COSTA_RICA = 'cr',
  CROATIA_HRVATSKA = 'hr',
  CYPRUS = 'cy',
  CZECH_REPUBLIC = 'cz',
  DENMARK = 'dk',
  DOMINICAN_REPUBLIC = 'do',
  ECUADOR = 'ec',
  EGYPT = 'eg',
  ESTONIA = 'ee',
  FINLAND = 'fi',
  FRANCE = 'fr',
  GEORGIA = 'ge',
  GERMANY = 'de',
  GREECE = 'gr',
  GUATEMALA = 'gt',
  HONG_KONG = 'hk',
  HUNGARY = 'hu',
  ICELAND = 'is',
  INDIA = 'in',
  INDONESIA = 'id',
  IRELAND = 'ie',
  ISLE_OF_MAN = 'im',
  ISRAEL = 'il',
  ITALY = 'it',
  JAMAICA = 'jm',
  JAPAN = 'jp',
  JORDAN = 'jo',
  KAZAKHSTAN = 'kz',
  KYRGYZSTAN = 'kg',
  LAOS = 'la',
  LATVIA = 'lv',
  LITHUANIA = 'lt',
  LUXEMBOURG = 'lu',
  MALAYSIA = 'my',
  MEXICO = 'mx',
  MOLDOVA = 'md',
  NETHERLANDS = 'nl',
  NEW_ZEALAND = 'nz',
  NORWAY = 'no',
  PORTUGAL = 'pt',
  PERU = 'pe',
  PHILIPPINES = 'ph',
  RUSSIA = 'ru',
  SAUDI_ARABIA = 'sa',
  SINGAPORE = 'sg',
  SOUTH_KOREA = 'kr',
  SPAIN = 'es',
  SRI_LANKA = 'lk',
  SWEDEN = 'se',
  SWITZERLAND = 'ch',
  TAIWAN = 'tw',
  TAJIKISTAN = 'tj',
  THAILAND = 'th',
  TURKEY = 'tr',
  TURKMENISTAN = 'tm',
  UKRAINE = 'ua',
  UNITED_ARAB_EMIRATES = 'ae',
  UZBEKISTAN = 'uz',
  VIETNAM = 'vn',
}

interface ILuminatiProviderConfig extends IProviderConfig {
  username: string;
  password: string;
}

interface ILuminatiConfig {
  proxy: ILuminatiProviderConfig;
  axiosConfig?: AxiosRequestConfig;
  strategy?: TLuminatiStrategy;
}

interface ILuminatiCreateProxy {
  sessionId: number;
  country: ELuminatiCountry;
}

interface ILuminatiChangeIp {
  sessionId?: number;
  countries?: ELuminatiCountry[];
}

type TLuminatiStrategyChangeIpEveryRequest = {
  mode: EStrategyMode.CHANGE_IP_EVERY_REQUESTS;
  countries: ELuminatiCountry[];
};

export {
  ELuminatiCountry,
  EStrategyMode,
  TLuminatiStrategy,
  ILuminatiCreateProxy,
  ILuminatiChangeIp,
  ILuminatiConfig,
  ILuminatiProviderConfig,
};
