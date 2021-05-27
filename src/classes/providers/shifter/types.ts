import { AxiosRequestConfig } from 'axios';
import { IProviderConfig, EStrategyMode } from '../base/types';

interface IShifterConfig {
  proxy: IProviderConfig;
  axiosConfig?: AxiosRequestConfig;
  strategy?: TShifterStrategy;
}

enum EShifterCountry {
  UNITED_STATES = 'us',
  UNITED_KINGDOM = 'gb',
  AUSTRALIA = 'au',
  CANADA = 'ca',
  GERMANY = 'de',
  ÅLAND_ISLANDS = 'ax',
  ALGERIA = 'dz',
  AMERICAN_SAMOA = 'as',
  ANDORRA = 'ad',
  ANGOLA = 'ao',
  ANGUILLA = 'ai',
  ANTARCTICA = 'aq',
  ANTIGUA_AND_BARBUDA = 'ag',
  ARGENTINA = 'ar',
  ARMENIA = 'am',
  ARUBA = 'aw',
  AUSTRIA = 'at',
  AZERBAIJAN = 'az',
  BAHAMAS = 'bs',
  BAHRAIN = 'bh',
  BANGLADESH = 'bd',
  BARBADOS = 'bb',
  BELARUS = 'by',
  BELGIUM = 'be',
  BELIZE = 'bz',
  BENIN = 'bj',
  BERMUDA = 'bm',
  BHUTAN = 'bt',
  BOLIVIA = 'bo',
  BONAIRE = 'bq',
  BOSNIA_AND_HERZEGOVINA = 'ba',
  BOTSWANA = 'bw',
  BOUVET_ISLAND = 'bv',
  BRAZIL = 'br',
  BRITISH_INDIAN_OCEAN_TERRITORY = 'io',
  BULGARIA = 'bg',
  BURKINA_FASO = 'bf',
  BURUNDI = 'bi',
  CAMBODIA = 'kh',
  CAMEROON = 'cm',
  CAPE_VERDE = 'cv',
  CAYMAN_ISLANDS = 'ky',
  CENTRAL_AFRICAN_REPUBLIC = 'cf',
  CHAD = 'td',
  CHILE = 'cl',
  CHRISTMAS_ISLAND = 'cx',
  COCOS_ISLANDS = 'cc',
  COLOMBIA = 'co',
  COMOROS = 'km',
  CONGO = 'cg',
  THE_DEMOCRATIC_REPUBLIC_OF_THE_CONGO = 'cd',
  COOK_ISLANDS = 'ck',
  COSTA_RICA = 'cr',
  CÔTE_DIVOIRE = 'ci',
  CROATIA = 'hr',
  CUBA = 'cu',
  CURAÇAO = 'cw',
  CYPRUS = 'cy',
  CZECH_REPUBLIC = 'cz',
  DENMARK = 'dk',
  DJIBOUTI = 'dj',
  DOMINICA = 'dm',
  DOMINICAN_REPUBLIC = 'do',
  ECUADOR = 'ec',
  EGYPT = 'eg',
  EL_SALVADOR = 'sv',
  EQUATORIAL_GUINEA = 'gq',
  ERITREA = 'er',
  ESTONIA = 'ee',
  ETHIOPIA = 'et',
  FALKLAND_ISLANDS = 'fk',
  FAROE_ISLANDS = 'fo',
  FIJI = 'fj',
  FINLAND = 'fi',
  FRANCE = 'fr',
  FRENCH_GUIANA = 'gf',
  FRENCH_POLYNESIA = 'pf',
  FRENCH_SOUTHERN_TERRITORIES = 'tf',
  GABON = 'ga',
  GAMBIA = 'gm',
  GEORGIA = 'ge',
  GHANA = 'gh',
  GIBRALTAR = 'gi',
  GREECE = 'gr',
  GREENLAND = 'gl',
  GRENADA = 'gd',
  GUADELOUPE = 'gp',
  GUAM = 'gu',
  GUATEMALA = 'gt',
  GUERNSEY = 'gg',
  GUINEA = 'gn',
  GUINEA_BISSAU = 'gw',
  GUYANA = 'gy',
  HAITI = 'ht',
  HEARD_ISLAND_AND_MCDONALD_ISLANDS = 'hm',
  HOLY_SEE_VATICAN_CITY_STATE = 'va',
  HONDURAS = 'hn',
  HONG_KONG = 'hk',
  HUNGARY = 'hu',
  ICELAND = 'is',
  INDIA = 'in',
  INDONESIA = 'id',
  IRAN = 'ir',
  IRELAND = 'ie',
  ISLE_OF_MAN = 'im',
  ISRAEL = 'il',
  ITALY = 'it',
  JAMAICA = 'jm',
  JAPAN = 'jp',
  JERSEY = 'je',
  JORDAN = 'jo',
  KAZAKHSTAN = 'kz',
  KIRIBATI = 'ki',
  KUWAIT = 'kw',
  KYRGYZSTAN = 'kg',
  LAO_PEOPLES_DEMOCRATIC_REPUBLIC = 'la',
  LATVIA = 'lv',
  LEBANON = 'lb',
  LESOTHO = 'ls',
  LIBERIA = 'lr',
  LIBYA = 'ly',
  LIECHTENSTEIN = 'li',
  LITHUANIA = 'lt',
  LUXEMBOURG = 'lu',
  MACAO = 'mo',
  MACEDONIA = 'mk',
  MADAGASCAR = 'mg',
  MALAWI = 'mw',
  MALAYSIA = 'my',
  MALDIVES = 'mv',
  MALI = 'ml',
  MALTA = 'mt',
  MARSHALL_ISLANDS = 'mh',
  MARTINIQUE = 'mq',
  MAURITANIA = 'mr',
  MAURITIUS = 'mu',
  MAYOTTE = 'yt',
  MEXICO = 'mx',
  FEDERATED_STATES_OF_MICRONESIA = 'fm',
  MOLDOVA = 'md',
  MONACO = 'mc',
  MONGOLIA = 'mn',
  MONTENEGRO = 'me',
  MONTSERRAT = 'ms',
  MOROCCO = 'ma',
  MOZAMBIQUE = 'mz',
  MYANMAR = 'mm',
  NAMIBIA = 'na',
  NAURU = 'nr',
  NEPAL = 'np',
  NETHERLANDS = 'nl',
  NEW_CALEDONIA = 'nc',
  NEW_ZEALAND = 'nz',
  NICARAGUA = 'ni',
  NIGER = 'ne',
  NIGERIA = 'ng',
  NIUE = 'nu',
  NORFOLK_ISLAND = 'nf',
  NORTHERN_MARIANA_ISLANDS = 'mp',
  NORWAY = 'no',
  OMAN = 'om',
  PALAU = 'pw',
  PALESTINIAN_TERRITORY = 'ps',
  PANAMA = 'pa',
  PAPUA_NEW_GUINEA = 'pg',
  PARAGUAY = 'py',
  PERU = 'pe',
  PHILIPPINES = 'ph',
  PITCAIRN = 'pn',
  POLAND = 'pl',
  PORTUGAL = 'pt',
  PUERTO_RICO = 'pr',
  QATAR = 'qa',
  RÉUNION = 're',
  ROMANIA = 'ro',
  RUSSIAN_FEDERATION = 'ru',
  RWANDA = 'rw',
  SAINT_BARTHÉLEMY = 'bl',
  SAINT_HELENA = 'sh',
  SAINT_KITTS_AND_NEVIS = 'kn',
  SAINT_LUCIA = 'lc',
  SAINT_MARTIN_FRENCH_PART = 'mf',
  SAINT_PIERRE_AND_MIQUELON = 'pm',
  SAINT_VINCENT_AND_THE_GRENADINES = 'vc',
  SAMOA = 'ws',
  SAN_MARINO = 'sm',
  SAO_TOME_AND_PRINCIPE = 'st',
  SAUDI_ARABIA = 'sa',
  SENEGAL = 'sn',
  SERBIA = 'rs',
  SEYCHELLES = 'sc',
  SIERRA_LEONE = 'sl',
  SINGAPORE = 'sg',
  SINT_MAARTEN_DUTCH_PART = 'sx',
  SLOVAKIA = 'sk',
  SLOVENIA = 'si',
  SOLOMON_ISLANDS = 'sb',
  SOMALIA = 'so',
  SOUTH_AFRICA = 'za',
  SOUTH_GEORGIA_AND_THE_SOUTH_SANDWICH_ISLANDS = 'gs',
  SOUTH_SUDAN = 'ss',
  SPAIN = 'es',
  SRI_LANKA = 'lk',
  SUDAN = 'sd',
  SURINAME = 'sr',
  SVALBARD_AND_JAN_MAYEN = 'sj',
  SWAZILAND = 'sz',
  SWEDEN = 'se',
  SWITZERLAND = 'ch',
  SYRIAN_ARAB_REPUBLIC = 'sy',
  TAIWAN = 'tw',
  TANZANIA = 'tz',
  THAILAND = 'th',
  TIMOR_LESTE = 'tl',
  TOGO = 'tg',
  TOKELAU = 'tk',
  TONGA = 'to',
  TRINIDAD_AND_TOBAGO = 'tt',
  TUNISIA = 'tn',
  TURKEY = 'tr',
  TURKS_AND_CAICOS_ISLANDS = 'tc',
  TUVALU = 'tv',
  UGANDA = 'ug',
  UKRAINE = 'ua',
  UNITED_ARAB_EMIRATES = 'ae',
  UNITED_STATES_MINOR_OUTLYING_ISLANDS = 'um',
  URUGUAY = 'uy',
  VANUATU = 'vu',
  VENEZUELA = 've',
  VIET_NAM = 'vn',
  VIRGIN_ISLANDS_BRITISH = 'vg',
  VIRGIN_ISLANDS_US = 'vi',
  WALLIS_AND_FUTUNA = 'wf',
  WESTERN_SAHARA = 'eh',
  YEMEN = 'ye',
  ZAMBIA = 'zm',
  ZIMBABWE = 'zw',
}

interface IShifterChangeIp {
  countries?: EShifterCountry[];
}

type TShifterCountryPortMapping = Partial<Record<EShifterCountry, number[]>>;

type TShifterStrategy = {
  mode?: EStrategyMode.CHANGE_IP_EVERY_REQUESTS | EStrategyMode.MANUAL;
  mapping?: TShifterCountryPortMapping;
};

export { TShifterStrategy, IShifterConfig, EShifterCountry, IShifterChangeIp, TShifterCountryPortMapping };
