# luminator

[![Dependencies][prod-dependencies-badge]][prod-dependencies]
[![Coverage][coverage-badge]][coverage]
[![Build Status][travis-badge]][travis-ci]
[![License][license-badge]][LICENSE]
[![PRs Welcome][prs-badge]][prs]

## Description

This repository provides an Axios Luminati agent.

## Install

```
yarn add @tictactrip/luminator
```

## How to use it?

Make a `get` request

```js
import { Luminator } from "@tictactrip/luminator";

const agent = new Luminator(username, password, config);

const response = await agent.fetch({ method: 'get', url: 'https://api.domain.com/examples' });
```

Make a `post` request: 

```js
import { Luminator } from "@tictactrip/luminator";

const agent = new Luminator(username, password, config);

const response = agent.fetch({
    method: 'post',
    url: '/user',
    data: {
      firstName: 'Fred',
      lastName: 'Flintstone'
    }
  });
```

You can also use default request config options

```js
import { Luminator } from "@tictactrip/luminator";

const agent = new Luminator(username, password, config, {
    baseURL: 'https://api.domain.com',
});

const response = await agent.fetch({ method: 'get', url: '/examples' });
```

The request config object is transparent with [Axios](https://github.com/axios/axios) request interface:

```js
{
  url: '/examples',
  method: 'get', // default
  baseURL: 'https://api.domain.com/api/',
  transformRequest: [function (data, headers) {
    return data;
  }],
  transformResponse: [function (data) {
    return data;
  }],
  // `headers` are custom headers to be sent
  headers: {'X-Requested-With': 'XMLHttpRequest'},
  params: {
    ID: 12345
  },
  paramsSerializer: function (params) {
    return Qs.stringify(params, {arrayFormat: 'brackets'})
  },
  data: {
    firstName: 'Fred'
  },
  timeout: 1000,
  withCredentials: false, // default
  adapter: function (config) {
    /* ... */
  },
  auth: {
    username: 'admin',
    password: 'password'
  },
  responseType: 'json', // default
  responseEncoding: 'utf8', // default
  xsrfCookieName: 'XSRF-TOKEN', // default
  xsrfHeaderName: 'X-XSRF-TOKEN', // default
  onUploadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },
  onDownloadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },
  maxContentLength: 2000,
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },
  maxRedirects: 5, 
  socketPath: null, 
  cancelToken: new CancelToken(function (cancel) {
  })
}
```

Response object:

```js
{
  // `data` is the response that was provided by the server
  data: {},

  // `status` is the HTTP status code from the server response
  status: 200,

  // `statusText` is the HTTP status message from the server response
  statusText: 'OK',

  // `headers` the headers that the server responded with
  // All header names are lower cased
  headers: {},

  // `config` is the config that was provided to `axios` for the request
  config: {},

  // `request` is the request that generated this response
  // It is the last ClientRequest instance in node.js (in redirects)
  // and an XMLHttpRequest instance the browser
  request: {}
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
[travis-badge]: https://travis-ci.org/tictactrip/luminator.svg?branch=master
[travis-ci]: https://travis-ci.org/tictactrip/luminator
[license-badge]: https://img.shields.io/badge/license-GPL3-blue.svg?style=flat-square
[license]: https://github.com/tictactrip/luminator/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
