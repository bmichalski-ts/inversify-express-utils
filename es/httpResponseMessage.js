var HttpResponseMessage = (function () {
    function HttpResponseMessage(statusCode) {
        if (statusCode === void 0) { statusCode = 200; }
        this._headers = {};
        this.statusCode = statusCode;
    }
    Object.defineProperty(HttpResponseMessage.prototype, "headers", {
        get: function () {
            return this._headers;
        },
        set: function (headers) {
            this._headers = headers;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HttpResponseMessage.prototype, "content", {
        get: function () {
            return this._content;
        },
        set: function (value) {
            this._content = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HttpResponseMessage.prototype, "statusCode", {
        get: function () {
            return this._statusCode;
        },
        set: function (code) {
            if (code < 0 || code > 999) {
                throw new Error("".concat(code, " is not a valid status code"));
            }
            this._statusCode = code;
        },
        enumerable: false,
        configurable: true
    });
    return HttpResponseMessage;
}());
export { HttpResponseMessage };