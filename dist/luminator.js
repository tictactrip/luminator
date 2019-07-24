"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require("axios");
const dns = require("dns");
const HttpsProxyAgent = require("https-proxy-agent");
class Luminator {
    constructor(username, password, superProxy = 'NL', country = 'fr', port = 22225) {
        this.failuresCountReq = 0;
        this.nReqForExitNode = 0;
        this.failCount = 0;
        this.username = username;
        this.password = password;
        this.superProxy = superProxy;
        this.country = country;
        this.port = port;
        this.switchSessionId();
    }
    static statusCodeRequiresExitNodeSwitch(statusCode) {
        return [403, 429, 502, 503].includes(statusCode);
    }
    static getRandomNumber() {
        return Math.random();
    }
    static getSessionId() {
        return Math.trunc(Luminator.getRandomNumber() * 1000000);
    }
    async fetch(params) {
        if (this.failuresCountReq >= Luminator.MAX_FAILURES_REQ) {
            throw new Error('MAX_FAILURES_REQ threshold reached');
        }
        if (!this.haveGoodSuperProxy()) {
            await this.switchSuperProxy();
        }
        if (this.nReqForExitNode === Luminator.SWITCH_IP_EVERY_N_REQ) {
            this.switchSessionId();
        }
        try {
            const response = await axios.default(this.getAxiosRequestConfig(params));
            this.failCount = 0;
            this.nReqForExitNode += 1;
            this.failuresCountReq = 0;
            return response;
        }
        catch (err) {
            this.failuresCountReq += 1;
            if (err.response &&
                !Luminator.statusCodeRequiresExitNodeSwitch(err.response.status)) {
                this.nReqForExitNode += 1;
                throw err;
            }
            this.switchSessionId();
            this.failCount += 1;
            return this.fetch(params);
        }
    }
    getProxyOptions() {
        return {
            host: this.superProxyUrl.host,
            port: this.superProxyUrl.port,
            auth: `${this.superProxyUrl.auth.username}:${this.superProxyUrl.auth.password}`,
        };
    }
    getAxiosRequestConfig(params) {
        return {
            timeout: Luminator.REQ_TIMEOUT,
            headers: { 'User-Agent': Luminator.USER_AGENT },
            httpsAgent: new HttpsProxyAgent(this.getProxyOptions()),
            ...params,
        };
    }
    haveGoodSuperProxy() {
        return this.superProxyHost && this.failCount < Luminator.MAX_FAILURES;
    }
    getUsername() {
        return `${this.username}-country-${this.country}-session-${this.sessionId}`;
    }
    updateSuperProxyUrl() {
        this.superProxyUrl = {
            host: this.superProxyHost,
            port: this.port,
            auth: {
                username: this.getUsername(),
                password: this.password,
            },
        };
    }
    switchSessionId() {
        this.sessionId = Luminator.getSessionId();
        this.nReqForExitNode = 0;
        this.updateSuperProxyUrl();
    }
    getSuperProxyHost() {
        return dns.promises.lookup(`session-${this.sessionId}-servercountry-${this.superProxy}.zproxy.lum-superproxy.io`);
    }
    async switchSuperProxy() {
        this.switchSessionId();
        try {
            const address = await this.getSuperProxyHost();
            this.superProxyHost = address.address;
            this.updateSuperProxyUrl();
            return true;
        }
        catch (e) {
            return false;
        }
    }
}
Luminator.USER_AGENT = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';
Luminator.SWITCH_IP_EVERY_N_REQ = 30;
Luminator.MAX_FAILURES = 3;
Luminator.REQ_TIMEOUT = 60 * 1000;
Luminator.MAX_FAILURES_REQ = 40;
exports.Luminator = Luminator;
//# sourceMappingURL=luminator.js.map