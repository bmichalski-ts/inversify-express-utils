"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.params = exports.principal = exports.next = exports.cookies = exports.requestHeaders = exports.requestBody = exports.queryParam = exports.requestParam = exports.response = exports.request = exports.httpMethod = exports.httpDelete = exports.httpHead = exports.httpPatch = exports.httpPut = exports.httpPost = exports.httpGet = exports.all = exports.controller = exports.injectHttpContext = void 0;
var inversify_1 = require("inversify");
var constants_1 = require("./constants");
exports.injectHttpContext = (0, inversify_1.inject)(constants_1.TYPE.HttpContext);
function controller(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return function (target) {
        var currentMetadata = {
            middleware: middleware,
            path: path,
            target: target,
        };
        (0, inversify_1.decorate)((0, inversify_1.injectable)(), target);
        Reflect.defineMetadata(constants_1.METADATA_KEY.controller, currentMetadata, target);
        var previousMetadata = Reflect.getMetadata(constants_1.METADATA_KEY.controller, Reflect) || [];
        var newMetadata = __spreadArray([currentMetadata], previousMetadata, true);
        Reflect.defineMetadata(constants_1.METADATA_KEY.controller, newMetadata, Reflect);
    };
}
exports.controller = controller;
function all(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, __spreadArray(['all', path], middleware, false));
}
exports.all = all;
function httpGet(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, __spreadArray(['get', path], middleware, false));
}
exports.httpGet = httpGet;
function httpPost(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, __spreadArray(['post', path], middleware, false));
}
exports.httpPost = httpPost;
function httpPut(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, __spreadArray(['put', path], middleware, false));
}
exports.httpPut = httpPut;
function httpPatch(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, __spreadArray(['patch', path], middleware, false));
}
exports.httpPatch = httpPatch;
function httpHead(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, __spreadArray(['head', path], middleware, false));
}
exports.httpHead = httpHead;
function httpDelete(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, __spreadArray(['delete', path], middleware, false));
}
exports.httpDelete = httpDelete;
function httpMethod(method, path) {
    var middleware = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        middleware[_i - 2] = arguments[_i];
    }
    return function (target, key) {
        var metadata = {
            key: key,
            method: method,
            middleware: middleware,
            path: path,
            target: target,
        };
        var metadataList = [];
        if (!Reflect.hasOwnMetadata(constants_1.METADATA_KEY.controllerMethod, target.constructor)) {
            Reflect.defineMetadata(constants_1.METADATA_KEY.controllerMethod, metadataList, target.constructor);
        }
        else {
            metadataList = Reflect.getOwnMetadata(constants_1.METADATA_KEY.controllerMethod, target.constructor);
        }
        metadataList.push(metadata);
    };
}
exports.httpMethod = httpMethod;
exports.request = paramDecoratorFactory(constants_1.PARAMETER_TYPE.REQUEST);
exports.response = paramDecoratorFactory(constants_1.PARAMETER_TYPE.RESPONSE);
exports.requestParam = paramDecoratorFactory(constants_1.PARAMETER_TYPE.PARAMS);
exports.queryParam = paramDecoratorFactory(constants_1.PARAMETER_TYPE.QUERY);
exports.requestBody = paramDecoratorFactory(constants_1.PARAMETER_TYPE.BODY);
exports.requestHeaders = paramDecoratorFactory(constants_1.PARAMETER_TYPE.HEADERS);
exports.cookies = paramDecoratorFactory(constants_1.PARAMETER_TYPE.COOKIES);
exports.next = paramDecoratorFactory(constants_1.PARAMETER_TYPE.NEXT);
exports.principal = paramDecoratorFactory(constants_1.PARAMETER_TYPE.PRINCIPAL);
function paramDecoratorFactory(parameterType) {
    return function (name) {
        return params(parameterType, name);
    };
}
function params(type, parameterName) {
    return function (target, methodName, index) {
        var metadataList = {};
        var parameterMetadataList = [];
        var parameterMetadata = {
            index: index,
            injectRoot: parameterName === undefined,
            parameterName: parameterName,
            type: type,
        };
        if (!Reflect.hasOwnMetadata(constants_1.METADATA_KEY.controllerParameter, target.constructor)) {
            parameterMetadataList.unshift(parameterMetadata);
        }
        else {
            metadataList = Reflect.getOwnMetadata(constants_1.METADATA_KEY.controllerParameter, target.constructor);
            if (metadataList[methodName]) {
                parameterMetadataList = metadataList[methodName] || [];
            }
            parameterMetadataList.unshift(parameterMetadata);
        }
        metadataList[methodName] = parameterMetadataList;
        Reflect.defineMetadata(constants_1.METADATA_KEY.controllerParameter, metadataList, target.constructor);
    };
}
exports.params = params;