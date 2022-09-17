"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpResponseMessage = void 0;
class HttpResponseMessage {
    constructor(statusCode = 200) {
        this._headers = {};
        this.statusCode = statusCode;
    }
    get headers() {
        return this._headers;
    }
    set headers(headers) {
        this._headers = headers;
    }
    get content() {
        return this._content;
    }
    set content(value) {
        this._content = value;
    }
    get statusCode() {
        return this._statusCode;
    }
    set statusCode(code) {
        if (code < 0 || code > 999) {
            throw new Error(`${code} is not a valid status code`);
        }
        this._statusCode = code;
    }
}
exports.HttpResponseMessage = HttpResponseMessage;
