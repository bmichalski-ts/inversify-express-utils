"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRawMetadata = exports.getRouteInfo = void 0;
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const getRouteInfo = (container) => __awaiter(void 0, void 0, void 0, function* () {
    const raw = yield (0, exports.getRawMetadata)(container);
    return raw.map(r => {
        const controllerId = r.controllerMetadata.target.name;
        const endpoints = r.methodMetadata.map(m => {
            const method = m.method.toUpperCase();
            const controllerPath = r.controllerMetadata.path;
            const actionPath = m.path;
            const paramMetadata = r.parameterMetadata;
            let args;
            if (paramMetadata !== undefined) {
                const paramMetadataForKey = paramMetadata[m.key] || undefined;
                if (paramMetadataForKey) {
                    args = (r.parameterMetadata[m.key] || []).map(a => {
                        let type = '';
                        switch (a.type) {
                            case constants_1.PARAMETER_TYPE.RESPONSE:
                                type = '@response';
                                break;
                            case constants_1.PARAMETER_TYPE.REQUEST:
                                type = '@request';
                                break;
                            case constants_1.PARAMETER_TYPE.NEXT:
                                type = '@next';
                                break;
                            case constants_1.PARAMETER_TYPE.PARAMS:
                                type = '@requestParam';
                                break;
                            case constants_1.PARAMETER_TYPE.QUERY:
                                type = 'queryParam';
                                break;
                            case constants_1.PARAMETER_TYPE.BODY:
                                type = '@requestBody';
                                break;
                            case constants_1.PARAMETER_TYPE.HEADERS:
                                type = '@requestHeaders';
                                break;
                            case constants_1.PARAMETER_TYPE.COOKIES:
                                type = '@cookies';
                                break;
                            case constants_1.PARAMETER_TYPE.PRINCIPAL:
                                type = '@principal';
                                break;
                            default:
                                break;
                        }
                        return `${type} ${a.parameterName}`;
                    });
                }
            }
            const details = {
                route: `${method} ${controllerPath}${actionPath}`,
            };
            if (args) {
                details.args = args;
            }
            return details;
        });
        return {
            controller: controllerId,
            endpoints,
        };
    });
});
exports.getRouteInfo = getRouteInfo;
const getRawMetadata = (container) => __awaiter(void 0, void 0, void 0, function* () {
    const controllers = yield (0, utils_1.getControllersFromContainer)(container, true);
    return controllers.map((controller) => {
        const { constructor } = controller;
        return {
            controllerMetadata: (0, utils_1.getControllerMetadata)(constructor),
            methodMetadata: (0, utils_1.getControllerMethodMetadata)(constructor),
            parameterMetadata: (0, utils_1.getControllerParameterMetadata)(constructor),
        };
    });
});
exports.getRawMetadata = getRawMetadata;
