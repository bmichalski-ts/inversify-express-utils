var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { inject, injectable, decorate } from 'inversify';
import { TYPE, METADATA_KEY, PARAMETER_TYPE, } from './constants';
export var injectHttpContext = inject(TYPE.HttpContext);
export function controller(path) {
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
        decorate(injectable(), target);
        Reflect.defineMetadata(METADATA_KEY.controller, currentMetadata, target);
        var previousMetadata = Reflect.getMetadata(METADATA_KEY.controller, Reflect) || [];
        var newMetadata = __spreadArray([currentMetadata], previousMetadata, true);
        Reflect.defineMetadata(METADATA_KEY.controller, newMetadata, Reflect);
    };
}
export function all(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, __spreadArray(['all', path], middleware, false));
}
export function httpGet(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, __spreadArray(['get', path], middleware, false));
}
export function httpPost(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, __spreadArray(['post', path], middleware, false));
}
export function httpPut(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, __spreadArray(['put', path], middleware, false));
}
export function httpPatch(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, __spreadArray(['patch', path], middleware, false));
}
export function httpHead(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, __spreadArray(['head', path], middleware, false));
}
export function httpDelete(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, __spreadArray(['delete', path], middleware, false));
}
export function httpMethod(method, path) {
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
        if (!Reflect.hasOwnMetadata(METADATA_KEY.controllerMethod, target.constructor)) {
            Reflect.defineMetadata(METADATA_KEY.controllerMethod, metadataList, target.constructor);
        }
        else {
            metadataList = Reflect.getOwnMetadata(METADATA_KEY.controllerMethod, target.constructor);
        }
        metadataList.push(metadata);
    };
}
export var request = paramDecoratorFactory(PARAMETER_TYPE.REQUEST);
export var response = paramDecoratorFactory(PARAMETER_TYPE.RESPONSE);
export var requestParam = paramDecoratorFactory(PARAMETER_TYPE.PARAMS);
export var queryParam = paramDecoratorFactory(PARAMETER_TYPE.QUERY);
export var requestBody = paramDecoratorFactory(PARAMETER_TYPE.BODY);
export var requestHeaders = paramDecoratorFactory(PARAMETER_TYPE.HEADERS);
export var cookies = paramDecoratorFactory(PARAMETER_TYPE.COOKIES);
export var next = paramDecoratorFactory(PARAMETER_TYPE.NEXT);
export var principal = paramDecoratorFactory(PARAMETER_TYPE.PRINCIPAL);
function paramDecoratorFactory(parameterType) {
    return function (name) {
        return params(parameterType, name);
    };
}
export function params(type, parameterName) {
    return function (target, methodName, index) {
        var metadataList = {};
        var parameterMetadataList = [];
        var parameterMetadata = {
            index: index,
            injectRoot: parameterName === undefined,
            parameterName: parameterName,
            type: type,
        };
        if (!Reflect.hasOwnMetadata(METADATA_KEY.controllerParameter, target.constructor)) {
            parameterMetadataList.unshift(parameterMetadata);
        }
        else {
            metadataList = Reflect.getOwnMetadata(METADATA_KEY.controllerParameter, target.constructor);
            if (metadataList[methodName]) {
                parameterMetadataList = metadataList[methodName] || [];
            }
            parameterMetadataList.unshift(parameterMetadata);
        }
        metadataList[methodName] = parameterMetadataList;
        Reflect.defineMetadata(METADATA_KEY.controllerParameter, metadataList, target.constructor);
    };
}