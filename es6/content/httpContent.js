"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpContent = void 0;
class HttpContent {
    constructor() {
        this._headers = {};
    }
    get headers() {
        return this._headers;
    }
}
exports.HttpContent = HttpContent;