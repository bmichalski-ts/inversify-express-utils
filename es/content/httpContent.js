var HttpContent = (function () {
    function HttpContent() {
        this._headers = {};
    }
    Object.defineProperty(HttpContent.prototype, "headers", {
        get: function () {
            return this._headers;
        },
        enumerable: false,
        configurable: true
    });
    return HttpContent;
}());
export { HttpContent };