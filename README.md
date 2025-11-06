# luminator

[![Dependencies][dependencies-badge]][dependencies]
[![Build][build-badge]][build]
[![License][license-badge]][license]
[![PRs Welcome][prs-badge]][prs]

## Description

This repository provides Axios proxy agents.

## Install

```
yarn add @tictactrip/luminator
```

## Available proxy providers

- [BrightData](https://get.brightdata.com/myob1aqbwr9f)
- [Proxyrack](https://www.proxyrack.com)
- [Shifter](https://shifter.io/r/0j72/product/basic-backconnect-proxies/Qzzr)
- [StormProxies](https://stormproxies.com/clients/aff/go/dimitri_dobairro)

## How to use it?

### BrightData

#### Strategy: Manual
This kind of agent strategy allow to specifically set how and when a change of IP (through `country`) or `sessionId`
is done.

Create your instance:

```typescript
import { BrightData } from '@tictactrip/luminator';

const BrightData: BrightData = new BrightData({
    proxy: {
        username: 'tictactrip',
        password: 'secret',
        host: 'zproxy.lum-superproxy.io',
        port: 22225,
    }
});
```

- Create an agent with a random countries and sessionId

```typescript
const agent: BrightData =  BrightData.setIp();
```

- Create an agent with a specific country and a random sessionId

```typescript
const agent: BrightData = BrightData.setIp({ countries: [EBrightDataCountry.FRANCE] });
```

- Create an agent with a specific country and a specific sessionId

```typescript
const agent: BrightData = BrightData.setIp({ countries: [EBrightDataCountry.FRANCE], sessionId });
```

- Create an agent with a random countries and a specific sessionId

```typescript
const agent: BrightData = BrightData.setIp({ sessionId });
```

#### Strategy: Change IP every requests

This strategy aims to make a GET request with a **FR** or **PT** IP randomly every requests.

```typescript
import { BrightData, EStrategyMode, EBrightDataCountry } from "@tictactrip/luminator";

const BrightData: BrightData = new BrightData({
    proxy: {
        username: 'tictactrip',
        password: 'secret',
        host: 'zproxy.lum-superproxy.io',
        port: 22225,
    },
    strategy: {
        mode: EStrategyMode.CHANGE_IP_EVERY_REQUESTS,
        countries: [EBrightDataCountry.FRANCE, EBrightDataCountry.SPAIN],
    },
});

const requestConfig = {
    method: 'get',
    baseURL: 'https://lumtest.com',
    url: '/myip.json',
}

const response1 = await BrightData.fetch(requestConfig);
const response2 = await BrightData.fetch(requestConfig);

console.log(response1.data);
console.log(response2.data);
```

**Response:**

```json
{
  "ip": "184.174.62.231",
  "country": "FR",
  "asn": {
    "asnum": 9009,
    "org_name": "M247 Ltd"
  },
  "geo": {
    "city": "Paris",
    "region": "IDF",
    "region_name": "Île-de-France",
    "postal_code": "75014",
    "latitude": 48.8579,
    "longitude": 2.3491,
    "tz": "Europe/Paris",
    "lum_city": "paris",
    "lum_region": "idf"
  }
}
```

```json
{
  "ip": "178.171.89.101",
  "country": "ES",
  "asn": {
    "asnum": 9009,
    "org_name": "M247 Ltd"
  },
  "geo": {
    "city": "Madrid",
    "region": "MD",
    "region_name": "Madrid",
    "postal_code": "28001",
    "latitude": 40.4167,
    "longitude": -3.6838,
    "tz": "Europe/Madrid",
    "lum_city": "madrid",
    "lum_region": "md"
  }
}
```

### Shifter

#### Strategy: Manual

```typescript
import { Shifter } from '@tictactrip/luminator';

const shifter: Shifter = new Shifter({
    proxy: {
        host: '76.34.12.53',
        port: 17664,
    },
    strategy: {
        mapping: {
            fr: [17643, 17644],
            es: [17645, 17646],
        },
    },
});
```

- Create an agent using a random country

```typescript
const agent: Shifter =  shifter.setIp();
```

- Create an agent using a specific country

```typescript
const agent: Shifter = shifter.setIp({ countries: [EShifterCountry.FRANCE] });
```

#### Strategy: Change IP every requests

```typescript
import { Shifter, EStrategyMode, EShifterCountry } from "@tictactrip/luminator";

const shifter: Shifter = new Shifter({
    proxy: {
        host: '76.34.12.53',
        port: 17664,
    },
    strategy: {
        mode: EStrategyMode.CHANGE_IP_EVERY_REQUESTS,
        mapping: {
            fr: [17643, 17644],
            es: [17645, 17646],
        },
    },
});

const requestConfig = {
    method: 'get',
    baseURL: 'https://lumtest.com',
    url: '/myip.json',
}

const response1 = await shifter.fetch(requestConfig);
const response2 = await shifter.fetch(requestConfig);

console.log(response1.data);
console.log(response2.data);
```





### Proxyrack

#### Strategy: Manual

```typescript
import { Proxyrack } from '@tictactrip/luminator';

const proxyrack: Proxyrack = new Proxyrack({
    proxy: {
        username: "tictactrip",
        password: "secret",
        host: 'mixed.rotating.proxyrack.net',
        ports: [10000, 10001, 10002, 10003, 10004, 10005, 10006, 10007, 10008, 10009, 10010],
    },
    strategy: EStrategyMode.MANUAL,
});

const requestConfig = {
    method: 'get',
    baseURL: 'https://lumtest.com',
    url: '/myip.json',
}

const response1 = await proxyrack.fetch(requestConfig);
const response2 = await proxyrack.fetch(requestConfig);

// Change IP
proxyrack.setIp();

const response3 = await proxyrack.fetch(requestConfig);

console.log(response1.data);
console.log(response3.data);
console.log(response3.data)
```

**Response:**

```json
{
  "ip": "184.174.62.231",
  "country": "FR",
  "asn": {
    "asnum": 9009,
    "org_name": "M247 Ltd"
  },
  "geo": {
    "city": "Paris",
    "region": "IDF",
    "region_name": "Île-de-France",
    "postal_code": "75014",
    "latitude": 48.8579,
    "longitude": 2.3491,
    "tz": "Europe/Paris",
    "lum_city": "paris",
    "lum_region": "idf"
  }
}
```

```json
{
  "ip": "184.174.62.231",
  "country": "FR",
  "asn": {
    "asnum": 9009,
    "org_name": "M247 Ltd"
  },
  "geo": {
    "city": "Paris",
    "region": "IDF",
    "region_name": "Île-de-France",
    "postal_code": "75014",
    "latitude": 48.8579,
    "longitude": 2.3491,
    "tz": "Europe/Paris",
    "lum_city": "paris",
    "lum_region": "idf"
  }
}
```

```json
{
  "ip": "178.171.89.101",
  "country": "ES",
  "asn": {
    "asnum": 9009,
    "org_name": "M247 Ltd"
  },
  "geo": {
    "city": "Madrid",
    "region": "MD",
    "region_name": "Madrid",
    "postal_code": "28001",
    "latitude": 40.4167,
    "longitude": -3.6838,
    "tz": "Europe/Madrid",
    "lum_city": "madrid",
    "lum_region": "md"
  }
}
```

#### Strategy: Change IP every requests

```typescript
import { Shifter, EStrategyMode, EShifterCountry } from "@tictactrip/luminator";

const proxyrack: Proxyrack = new Proxyrack({
    proxy: {
        username: "tictactrip",
        password: "secret",
        host: 'megaproxy.rotating.proxyrack.net',
        ports: [222],
    },
    strategy: EStrategyMode.CHANGE_IP_EVERY_REQUESTS,
});

const requestConfig = {
    method: 'get',
    baseURL: 'https://lumtest.com',
    url: '/myip.json',
}

const response1 = await shifter.fetch(requestConfig);
const response2 = await shifter.fetch(requestConfig);

console.log(response1.data);
console.log(response2.data);
```

```json
{
  "ip": "184.174.62.231",
  "country": "FR",
  "asn": {
    "asnum": 9009,
    "org_name": "M247 Ltd"
  },
  "geo": {
    "city": "Paris",
    "region": "IDF",
    "region_name": "Île-de-France",
    "postal_code": "75014",
    "latitude": 48.8579,
    "longitude": 2.3491,
    "tz": "Europe/Paris",
    "lum_city": "paris",
    "lum_region": "idf"
  }
}
```

```json
{
  "ip": "178.171.89.101",
  "country": "ES",
  "asn": {
    "asnum": 9009,
    "org_name": "M247 Ltd"
  },
  "geo": {
    "city": "Madrid",
    "region": "MD",
    "region_name": "Madrid",
    "postal_code": "28001",
    "latitude": 40.4167,
    "longitude": -3.6838,
    "tz": "Europe/Madrid",
    "lum_city": "madrid",
    "lum_region": "md"
  }
}
```

## Scripts

Run using yarn run `<script>` command.

    clean       - Remove temporarily folders.
    build       - Compile source files.
    build:watch - Interactive watch mode, compile sources on change.
    lint        - Lint source files.
    lint:fix    - Fix lint source files.
    test        - Runs all tests with coverage.
    test:watch  - Interactive watch mode, runs tests on change.

## License

GPL-3.0 © [Tictactrip](https://www.tictactrip.eu)

[dependencies-badge]: https://img.shields.io/david/tictactrip/luminator
[dependencies]: https://img.shields.io/david/tictactrip/luminator
[build-badge]: https://github.com/tictactrip/luminator/workflows/Test/badge.svg
[build]: https://github.com/tictactrip/luminator/actions?query=workflow%3ATest+branch%3Amaster
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license]: https://github.com/tictactrip/luminator/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
