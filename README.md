# luminator

[![Dependencies][prod-dependencies-badge]][prod-dependencies]
[![Coverage][coverage-badge]][coverage]
[![Build Status][travis-badge]][travis-ci]
[![License][license-badge]][LICENSE]
[![PRs Welcome][prs-badge]][prs]

## Description

This repository provides Axios proxy agents.

## Install

```
yarn add @tictactrip/luminator
```

## Available proxy providers

- [Luminati](https://luminati.io)
- [Proxyrack](https://www.proxyrack.com)
- [Shifter.io](https://www.shifter.io)

## How to use it?

### Strategy: Manual

Create your instance:

```typescript
import { Luminati } from '@tictactrip/luminator';

const luminati: Luminati = new Luminati({
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
const agent: Luminati =  luminati.changeIp();
```

- Create an agent with a specific country and a random sessionId

```typescript
const agent: Luminati = luminati.changeIp({ countries: [ELuminatiCountry.FRANCE] });
```

- Create an agent with a specific country and a specific sessionId

```typescript
const agent: Luminati = luminati.changeIp({ countries: [ELuminatiCountry.FRANCE], sessionId });
```

- Create an agent with a random countries and a specific sessionId

```typescript
const agent: Luminati = luminati.changeIp({ sessionId });
```

### Strategy: Change ip every requests

This strategy aims to make a GET request with a **FR** or **PT** IP randomly every requests.

```typescript
import { Luminati, EStrategyMode, ELuminatiCountry } from "@tictactrip/luminator";

const luminati: Luminati = new Luminati({
  proxy: {
    username: 'tictactrip',
    password: 'secret',
    host: 'zproxy.lum-superproxy.io',
    port: 22225,
  },
  strategy: {
    mode: EStrategyMode.CHANGE_IP_EVERY_REQUESTS,
    countries: [ELuminatiCountry.FRANCE, ELuminatiCountry.SPAIN],
  },
});

const requestConfig = {
  method: 'get',
  baseURL: 'https://lumtest.com',
  url: '/myip.json',
}

const response1 = await luminati.fetch(requestConfig);
const response2 = await luminati.fetch(requestConfig);

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

[prod-dependencies-badge]: https://david-dm.org/tictactrip/luminator/status.svg
[prod-dependencies]: https://david-dm.org/tictactrip/luminator
[coverage-badge]: https://codecov.io/gh/tictactrip/luminator/branch/master/graph/badge.svg
[coverage]: https://codecov.io/gh/tictactrip/luminator
[travis-badge]: https://travis-ci.org/tictactrip/luminati.svg?branch=master
[travis-ci]: https://travis-ci.org/tictactrip/luminator
[license-badge]: https://img.shields.io/badge/license-GPL3-blue.svg?style=flat-square
[license]: https://github.com/tictactrip/luminator/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
