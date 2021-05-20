import { AxiosRequestConfig } from 'axios';
import { IProviderConfig, EStrategyMode } from '../base/types';

type TShifterStrategy = TShifterStrategyChangeIpEveryRequest;

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

interface IShifterCountryPortMapping {
  us?: number[];
  gb?: number[];
  au?: number[];
  ca?: number[];
  fr?: number[];
  de?: number[];
  ax?: number[];
  dz?: number[];
  as?: number[];
  ad?: number[];
  ao?: number[];
  ai?: number[];
  aq?: number[];
  ag?: number[];
  ar?: number[];
  am?: number[];
  aw?: number[];
  at?: number[];
  az?: number[];
  bs?: number[];
  bh?: number[];
  bd?: number[];
  bb?: number[];
  by?: number[];
  be?: number[];
  bz?: number[];
  bj?: number[];
  bm?: number[];
  bt?: number[];
  bo?: number[];
  bq?: number[];
  ba?: number[];
  bw?: number[];
  bv?: number[];
  br?: number[];
  io?: number[];
  bg?: number[];
  bf?: number[];
  bi?: number[];
  kh?: number[];
  cm?: number[];
  cv?: number[];
  ky?: number[];
  cf?: number[];
  td?: number[];
  cl?: number[];
  cx?: number[];
  cc?: number[];
  co?: number[];
  km?: number[];
  cg?: number[];
  cd?: number[];
  ck?: number[];
  cr?: number[];
  ci?: number[];
  hr?: number[];
  cu?: number[];
  cw?: number[];
  cy?: number[];
  cz?: number[];
  dk?: number[];
  dj?: number[];
  dm?: number[];
  do?: number[];
  ec?: number[];
  eg?: number[];
  sv?: number[];
  gq?: number[];
  er?: number[];
  ee?: number[];
  et?: number[];
  fk?: number[];
  fo?: number[];
  fj?: number[];
  fi?: number[];
  gf?: number[];
  pf?: number[];
  tf?: number[];
  ga?: number[];
  gm?: number[];
  ge?: number[];
  gh?: number[];
  gi?: number[];
  gr?: number[];
  gl?: number[];
  gd?: number[];
  gp?: number[];
  gu?: number[];
  gt?: number[];
  gg?: number[];
  gn?: number[];
  gw?: number[];
  gy?: number[];
  ht?: number[];
  hm?: number[];
  va?: number[];
  hn?: number[];
  hk?: number[];
  hu?: number[];
  is?: number[];
  in?: number[];
  id?: number[];
  ir?: number[];
  ie?: number[];
  im?: number[];
  il?: number[];
  it?: number[];
  jm?: number[];
  jp?: number[];
  je?: number[];
  jo?: number[];
  kz?: number[];
  ki?: number[];
  kw?: number[];
  kg?: number[];
  la?: number[];
  lv?: number[];
  lb?: number[];
  ls?: number[];
  lr?: number[];
  ly?: number[];
  li?: number[];
  lt?: number[];
  lu?: number[];
  mo?: number[];
  mk?: number[];
  mg?: number[];
  mw?: number[];
  my?: number[];
  mv?: number[];
  ml?: number[];
  mt?: number[];
  mh?: number[];
  mq?: number[];
  mr?: number[];
  mu?: number[];
  yt?: number[];
  mx?: number[];
  fm?: number[];
  md?: number[];
  mc?: number[];
  mn?: number[];
  me?: number[];
  ms?: number[];
  ma?: number[];
  mz?: number[];
  mm?: number[];
  na?: number[];
  nr?: number[];
  np?: number[];
  nl?: number[];
  nc?: number[];
  nz?: number[];
  ni?: number[];
  ne?: number[];
  ng?: number[];
  nu?: number[];
  nf?: number[];
  mp?: number[];
  no?: number[];
  om?: number[];
  pw?: number[];
  ps?: number[];
  pa?: number[];
  pg?: number[];
  py?: number[];
  pe?: number[];
  ph?: number[];
  pn?: number[];
  pl?: number[];
  pt?: number[];
  pr?: number[];
  qa?: number[];
  re?: number[];
  ro?: number[];
  ru?: number[];
  rw?: number[];
  bl?: number[];
  sh?: number[];
  kn?: number[];
  lc?: number[];
  mf?: number[];
  pm?: number[];
  vc?: number[];
  ws?: number[];
  sm?: number[];
  st?: number[];
  sa?: number[];
  sn?: number[];
  rs?: number[];
  sc?: number[];
  sl?: number[];
  sg?: number[];
  sx?: number[];
  sk?: number[];
  si?: number[];
  sb?: number[];
  so?: number[];
  za?: number[];
  gs?: number[];
  ss?: number[];
  es?: number[];
  lk?: number[];
  sd?: number[];
  sr?: number[];
  sj?: number[];
  sz?: number[];
  se?: number[];
  ch?: number[];
  sy?: number[];
  tw?: number[];
  tz?: number[];
  th?: number[];
  tl?: number[];
  tg?: number[];
  tk?: number[];
  to?: number[];
  tt?: number[];
  tn?: number[];
  tr?: number[];
  tc?: number[];
  tv?: number[];
  ug?: number[];
  ua?: number[];
  ae?: number[];
  um?: number[];
  uy?: number[];
  vu?: number[];
  ve?: number[];
  vn?: number[];
  vg?: number[];
  vi?: number[];
  wf?: number[];
  eh?: number[];
  ye?: number[];
  zm?: number[];
  zw?: number[];
}

export { TShifterStrategy, IShifterConfig, EShifterCountry, IShifterChangeIp, IShifterCountryPortMapping };
