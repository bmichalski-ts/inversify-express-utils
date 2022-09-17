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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRawMetadata = exports.getRouteInfo = void 0;
var constants_1 = require("./constants");
var utils_1 = require("./utils");
var getRouteInfo = function (container) { return __awaiter(void 0, void 0, void 0, function () {
    var raw;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, (0, exports.getRawMetadata)(container)];
            case 1:
                raw = _a.sent();
                return [2, raw.map(function (r) {
                        var controllerId = r.controllerMetadata.target.name;
                        var endpoints = r.methodMetadata.map(function (m) {
                            var method = m.method.toUpperCase();
                            var controllerPath = r.controllerMetadata.path;
                            var actionPath = m.path;
                            var paramMetadata = r.parameterMetadata;
                            var args;
                            if (paramMetadata !== undefined) {
                                var paramMetadataForKey = paramMetadata[m.key] || undefined;
                                if (paramMetadataForKey) {
                                    args = (r.parameterMetadata[m.key] || []).map(function (a) {
                                        var type = '';
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
                                        return "".concat(type, " ").concat(a.parameterName);
                                    });
                                }
                            }
                            var details = {
                                route: "".concat(method, " ").concat(controllerPath).concat(actionPath),
                            };
                            if (args) {
                                details.args = args;
                            }
                            return details;
                        });
                        return {
                            controller: controllerId,
                            endpoints: endpoints,
                        };
                    })];
        }
    });
}); };
exports.getRouteInfo = getRouteInfo;
var getRawMetadata = function (container) { return __awaiter(void 0, void 0, void 0, function () {
    var controllers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, (0, utils_1.getControllersFromContainer)(container, true)];
            case 1:
                controllers = _a.sent();
                return [2, controllers.map(function (controller) {
                        var constructor = controller.constructor;
                        return {
                            controllerMetadata: (0, utils_1.getControllerMetadata)(constructor),
                            methodMetadata: (0, utils_1.getControllerMethodMetadata)(constructor),
                            parameterMetadata: (0, utils_1.getControllerParameterMetadata)(constructor),
                        };
                    })];
        }
    });
}); };
exports.getRawMetadata = getRawMetadata;
