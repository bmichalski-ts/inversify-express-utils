"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ROUTING_ROOT_PATH = exports.NO_CONTROLLERS_FOUND = exports.DUPLICATED_CONTROLLER_NAME = exports.HTTP_VERBS_ENUM = exports.PARAMETER_TYPE = exports.METADATA_KEY = exports.TYPE = void 0;
exports.TYPE = {
    AuthProvider: Symbol.for('AuthProvider'),
    Controller: Symbol.for('Controller'),
    HttpContext: Symbol.for('HttpContext'),
};
exports.METADATA_KEY = {
    controller: 'inversify-express-utils:controller',
    controllerMethod: 'inversify-express-utils:controller-method',
    controllerParameter: 'inversify-express-utils:controller-parameter',
    httpContext: 'inversify-express-utils:httpcontext',
};
var PARAMETER_TYPE;
(function (PARAMETER_TYPE) {
    PARAMETER_TYPE[PARAMETER_TYPE["REQUEST"] = 0] = "REQUEST";
    PARAMETER_TYPE[PARAMETER_TYPE["RESPONSE"] = 1] = "RESPONSE";
    PARAMETER_TYPE[PARAMETER_TYPE["PARAMS"] = 2] = "PARAMS";
    PARAMETER_TYPE[PARAMETER_TYPE["QUERY"] = 3] = "QUERY";
    PARAMETER_TYPE[PARAMETER_TYPE["BODY"] = 4] = "BODY";
    PARAMETER_TYPE[PARAMETER_TYPE["HEADERS"] = 5] = "HEADERS";
    PARAMETER_TYPE[PARAMETER_TYPE["COOKIES"] = 6] = "COOKIES";
    PARAMETER_TYPE[PARAMETER_TYPE["NEXT"] = 7] = "NEXT";
    PARAMETER_TYPE[PARAMETER_TYPE["PRINCIPAL"] = 8] = "PRINCIPAL";
})(PARAMETER_TYPE = exports.PARAMETER_TYPE || (exports.PARAMETER_TYPE = {}));
var HTTP_VERBS_ENUM;
(function (HTTP_VERBS_ENUM) {
    HTTP_VERBS_ENUM["all"] = "ALL";
    HTTP_VERBS_ENUM["connect"] = "CONNECT";
    HTTP_VERBS_ENUM["delete"] = "DELETE";
    HTTP_VERBS_ENUM["get"] = "GET";
    HTTP_VERBS_ENUM["head"] = "HEAD";
    HTTP_VERBS_ENUM["options"] = "OPTIONS";
    HTTP_VERBS_ENUM["patch"] = "PATCH";
    HTTP_VERBS_ENUM["post"] = "POST";
    HTTP_VERBS_ENUM["propfind"] = "PROPFIND";
    HTTP_VERBS_ENUM["put"] = "PUT";
    HTTP_VERBS_ENUM["trace"] = "TRACE";
})(HTTP_VERBS_ENUM = exports.HTTP_VERBS_ENUM || (exports.HTTP_VERBS_ENUM = {}));
var DUPLICATED_CONTROLLER_NAME = function (name) { return "Two controllers cannot have the same name: ".concat(name); };
exports.DUPLICATED_CONTROLLER_NAME = DUPLICATED_CONTROLLER_NAME;
exports.NO_CONTROLLERS_FOUND = 'No controllers' +
    'have been found! Please ensure that you have register' +
    'at least one Controller.';
exports.DEFAULT_ROUTING_ROOT_PATH = '/';