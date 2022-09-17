"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.params = exports.principal = exports.next = exports.cookies = exports.requestHeaders = exports.requestBody = exports.queryParam = exports.requestParam = exports.response = exports.request = exports.httpMethod = exports.httpDelete = exports.httpHead = exports.httpPatch = exports.httpPut = exports.httpPost = exports.httpGet = exports.all = exports.controller = exports.injectHttpContext = void 0;
const inversify_1 = require("inversify");
const constants_1 = require("./constants");
exports.injectHttpContext = (0, inversify_1.inject)(constants_1.TYPE.HttpContext);
function controller(path, ...middleware) {
    return (target) => {
        const currentMetadata = {
            middleware,
            path,
            target,
        };
        (0, inversify_1.decorate)((0, inversify_1.injectable)(), target);
        Reflect.defineMetadata(constants_1.METADATA_KEY.controller, currentMetadata, target);
        const previousMetadata = Reflect.getMetadata(constants_1.METADATA_KEY.controller, Reflect) || [];
        const newMetadata = [currentMetadata, ...previousMetadata];
        Reflect.defineMetadata(constants_1.METADATA_KEY.controller, newMetadata, Reflect);
    };
}
exports.controller = controller;
function all(path, ...middleware) {
    return httpMethod('all', path, ...middleware);
}
exports.all = all;
function httpGet(path, ...middleware) {
    return httpMethod('get', path, ...middleware);
}
exports.httpGet = httpGet;
function httpPost(path, ...middleware) {
    return httpMethod('post', path, ...middleware);
}
exports.httpPost = httpPost;
function httpPut(path, ...middleware) {
    return httpMethod('put', path, ...middleware);
}
exports.httpPut = httpPut;
function httpPatch(path, ...middleware) {
    return httpMethod('patch', path, ...middleware);
}
exports.httpPatch = httpPatch;
function httpHead(path, ...middleware) {
    return httpMethod('head', path, ...middleware);
}
exports.httpHead = httpHead;
function httpDelete(path, ...middleware) {
    return httpMethod('delete', path, ...middleware);
}
exports.httpDelete = httpDelete;
function httpMethod(method, path, ...middleware) {
    return (target, key) => {
        const metadata = {
            key,
            method,
            middleware,
            path,
            target,
        };
        let metadataList = [];
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
    return (name) => params(parameterType, name);
}
function params(type, parameterName) {
    return (target, methodName, index) => {
        let metadataList = {};
        let parameterMetadataList = [];
        const parameterMetadata = {
            index,
            injectRoot: parameterName === undefined,
            parameterName,
            type,
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