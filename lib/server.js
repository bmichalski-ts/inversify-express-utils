"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.InversifyExpressServer = void 0;
var express_1 = __importStar(require("express"));
var index_1 = require("./index");
var utils_1 = require("./utils");
var constants_1 = require("./constants");
var httpResponseMessage_1 = require("./httpResponseMessage");
var InversifyExpressServer = (function () {
    function InversifyExpressServer(container, customRouter, routingConfig, customApp, authProvider, forceControllers) {
        if (forceControllers === void 0) { forceControllers = true; }
        this._container = container;
        this._forceControllers = forceControllers;
        this._router = customRouter || (0, express_1.Router)();
        this._routingConfig = routingConfig || {
            rootPath: constants_1.DEFAULT_ROUTING_ROOT_PATH,
        };
        this._app = customApp || (0, express_1.default)();
        if (authProvider) {
            this._AuthProvider = authProvider;
            container.bind(constants_1.TYPE.AuthProvider)
                .to(this._AuthProvider);
        }
    }
    InversifyExpressServer.prototype.setConfig = function (fn) {
        this._configFn = fn;
        return this;
    };
    InversifyExpressServer.prototype.setErrorConfig = function (fn) {
        this._errorConfigFn = fn;
        return this;
    };
    InversifyExpressServer.prototype.build = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._app.all('*', function (req, res, next) {
                            void (function () { return __awaiter(_this, void 0, void 0, function () {
                                var httpContext;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, this._createHttpContext(req, res, next)];
                                        case 1:
                                            httpContext = _a.sent();
                                            Reflect.defineMetadata(constants_1.METADATA_KEY.httpContext, httpContext, req);
                                            next();
                                            return [2];
                                    }
                                });
                            }); })();
                        });
                        if (this._configFn) {
                            this._configFn.apply(undefined, [this._app]);
                        }
                        return [4, this.registerControllers()];
                    case 1:
                        _a.sent();
                        if (this._errorConfigFn) {
                            this._errorConfigFn.apply(undefined, [this._app]);
                        }
                        return [2, this._app];
                }
            });
        });
    };
    InversifyExpressServer.prototype.registerControllers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var constructors, controllers;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._container
                            .bind(constants_1.TYPE.HttpContext)
                            .toConstantValue({});
                        constructors = (0, utils_1.getControllersFromMetadata)();
                        constructors.forEach(function (constructor) {
                            var name = constructor.name;
                            if (_this._container.isBoundNamed(constants_1.TYPE.Controller, name)) {
                                throw new Error((0, constants_1.DUPLICATED_CONTROLLER_NAME)(name));
                            }
                            _this._container.bind(constants_1.TYPE.Controller)
                                .to(constructor)
                                .whenTargetNamed(name);
                        });
                        return [4, (0, utils_1.getControllersFromContainer)(this._container, this._forceControllers)];
                    case 1:
                        controllers = _a.sent();
                        return [4, Promise.all(controllers.map(function (controller) { return __awaiter(_this, void 0, void 0, function () {
                                var controllerMetadata, methodMetadata, parameterMetadata, controllerMiddleware_1;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            controllerMetadata = (0, utils_1.getControllerMetadata)(controller.constructor);
                                            methodMetadata = (0, utils_1.getControllerMethodMetadata)(controller.constructor);
                                            parameterMetadata = (0, utils_1.getControllerParameterMetadata)(controller.constructor);
                                            if (!(controllerMetadata && methodMetadata)) return [3, 3];
                                            return [4, this.resolveMidleware.apply(this, controllerMetadata.middleware)];
                                        case 1:
                                            controllerMiddleware_1 = _a.sent();
                                            return [4, Promise.all(methodMetadata.map(function (metadata) { return __awaiter(_this, void 0, void 0, function () {
                                                    var paramList, handler, routeMiddleware;
                                                    var _a;
                                                    return __generator(this, function (_b) {
                                                        switch (_b.label) {
                                                            case 0:
                                                                paramList = [];
                                                                if (parameterMetadata) {
                                                                    paramList = parameterMetadata[metadata.key] || [];
                                                                }
                                                                handler = this.handlerFactory(controllerMetadata.target.name, metadata.key, paramList);
                                                                return [4, this.resolveMidleware.apply(this, metadata.middleware)];
                                                            case 1:
                                                                routeMiddleware = _b.sent();
                                                                (_a = this._router)[metadata.method].apply(_a, __spreadArray(__spreadArray(__spreadArray(["".concat(controllerMetadata.path).concat(metadata.path)], controllerMiddleware_1, false), routeMiddleware, false), [handler], false));
                                                                return [2];
                                                        }
                                                    });
                                                }); }))];
                                        case 2:
                                            _a.sent();
                                            _a.label = 3;
                                        case 3: return [2];
                                    }
                                });
                            }); }))];
                    case 2:
                        _a.sent();
                        this._app.use(this._routingConfig.rootPath, this._router);
                        return [2];
                }
            });
        });
    };
    InversifyExpressServer.prototype.resolveMidleware = function () {
        var middleware = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            middleware[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, Promise.all(middleware.map(function (middlewareItem) { return __awaiter(_this, void 0, void 0, function () {
                        var middlewareInstance;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!this._container.isBound(middlewareItem)) {
                                        return [2, middlewareItem];
                                    }
                                    return [4, this._container
                                            .getAsync(middlewareItem)];
                                case 1:
                                    middlewareInstance = _a.sent();
                                    if (middlewareInstance instanceof index_1.BaseMiddleware) {
                                        return [2, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                                                var mReq;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4, this._container.getAsync(middlewareItem)];
                                                        case 1:
                                                            mReq = _a.sent();
                                                            mReq.httpContext = this._getHttpContext(req);
                                                            mReq.handler(req, res, next);
                                                            return [2];
                                                    }
                                                });
                                            }); }];
                                    }
                                    return [2, middlewareInstance];
                            }
                        });
                    }); }))];
            });
        });
    };
    InversifyExpressServer.prototype.copyHeadersTo = function (headers, target) {
        for (var _i = 0, _a = Object.keys(headers); _i < _a.length; _i++) {
            var name_1 = _a[_i];
            var headerValue = headers[name_1];
            target.append(name_1, typeof headerValue === 'number' ? headerValue.toString() : headerValue);
        }
    };
    InversifyExpressServer.prototype.handleHttpResponseMessage = function (message, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.copyHeadersTo(message.headers, res);
                        if (!(message.content !== undefined)) return [3, 2];
                        this.copyHeadersTo(message.content.headers, res);
                        _b = (_a = res.status(message.statusCode))
                            .send;
                        return [4, message.content.readAsync()];
                    case 1:
                        _b.apply(_a, [_c.sent()]);
                        return [3, 3];
                    case 2:
                        res.sendStatus(message.statusCode);
                        _c.label = 3;
                    case 3: return [2];
                }
            });
        });
    };
    InversifyExpressServer.prototype.handlerFactory = function (controllerName, key, parameterMetadata) {
        var _this = this;
        return function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var args, httpContext, value, httpResponseMessage, err_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 9]);
                        args = this.extractParameters(req, res, next, parameterMetadata);
                        httpContext = this._getHttpContext(req);
                        httpContext.container.bind(constants_1.TYPE.HttpContext)
                            .toConstantValue(httpContext);
                        return [4, (_a = httpContext.container.getNamed(constants_1.TYPE.Controller, controllerName))[key].apply(_a, args)];
                    case 1:
                        value = _b.sent();
                        if (!(value instanceof httpResponseMessage_1.HttpResponseMessage)) return [3, 3];
                        return [4, this.handleHttpResponseMessage(value, res)];
                    case 2:
                        _b.sent();
                        return [3, 7];
                    case 3:
                        if (!(0, utils_1.instanceOfIHttpActionResult)(value)) return [3, 6];
                        return [4, value.executeAsync()];
                    case 4:
                        httpResponseMessage = _b.sent();
                        return [4, this.handleHttpResponseMessage(httpResponseMessage, res)];
                    case 5:
                        _b.sent();
                        return [3, 7];
                    case 6:
                        if (value instanceof Function) {
                            value();
                        }
                        else if (!res.headersSent) {
                            if (value === undefined) {
                                res.status(204);
                            }
                            res.send(value);
                        }
                        _b.label = 7;
                    case 7: return [3, 9];
                    case 8:
                        err_1 = _b.sent();
                        next(err_1);
                        return [3, 9];
                    case 9: return [2];
                }
            });
        }); };
    };
    InversifyExpressServer.prototype._getHttpContext = function (req) {
        return Reflect.getMetadata(constants_1.METADATA_KEY.httpContext, req);
    };
    InversifyExpressServer.prototype._createHttpContext = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var principal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._getCurrentUser(req, res, next)];
                    case 1:
                        principal = _a.sent();
                        return [2, {
                                container: this._container.createChild(),
                                request: req,
                                response: res,
                                user: principal
                            }];
                }
            });
        });
    };
    InversifyExpressServer.prototype._getCurrentUser = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var authProvider;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this._AuthProvider !== undefined)) return [3, 2];
                        return [4, this._container.getAsync(constants_1.TYPE.AuthProvider)];
                    case 1:
                        authProvider = _a.sent();
                        return [2, authProvider.getUser(req, res, next)];
                    case 2: return [2, Promise.resolve({
                            details: null,
                            isAuthenticated: function () { return Promise.resolve(false); },
                            isInRole: function (_role) { return Promise.resolve(false); },
                            isResourceOwner: function (_resourceId) { return Promise.resolve(false); },
                        })];
                }
            });
        });
    };
    InversifyExpressServer.prototype.extractParameters = function (req, res, next, params) {
        var _this = this;
        var args = [];
        if (!params || !params.length) {
            return [req, res, next];
        }
        params.forEach(function (_a) {
            var type = _a.type, index = _a.index, parameterName = _a.parameterName, injectRoot = _a.injectRoot;
            switch (type) {
                case constants_1.PARAMETER_TYPE.REQUEST:
                    args[index] = req;
                    break;
                case constants_1.PARAMETER_TYPE.NEXT:
                    args[index] = next;
                    break;
                case constants_1.PARAMETER_TYPE.PARAMS:
                    args[index] = _this.getParam(req, 'params', injectRoot, parameterName);
                    break;
                case constants_1.PARAMETER_TYPE.QUERY:
                    args[index] = _this.getParam(req, 'query', injectRoot, parameterName);
                    break;
                case constants_1.PARAMETER_TYPE.BODY:
                    args[index] = req.body;
                    break;
                case constants_1.PARAMETER_TYPE.HEADERS:
                    args[index] = _this.getParam(req, 'headers', injectRoot, parameterName);
                    break;
                case constants_1.PARAMETER_TYPE.COOKIES:
                    args[index] = _this.getParam(req, 'cookies', injectRoot, parameterName);
                    break;
                case constants_1.PARAMETER_TYPE.PRINCIPAL:
                    args[index] = _this._getPrincipal(req);
                    break;
                default:
                    args[index] = res;
                    break;
            }
        });
        args.push(req, res, next);
        return args;
    };
    InversifyExpressServer.prototype.getParam = function (source, paramType, injectRoot, name) {
        var key = paramType === 'headers' ? name === null || name === void 0 ? void 0 : name.toLowerCase() : name;
        var param = source[paramType];
        if (injectRoot) {
            return param;
        }
        return (param && key) ? param[key] : undefined;
    };
    InversifyExpressServer.prototype._getPrincipal = function (req) {
        return this._getHttpContext(req).user;
    };
    return InversifyExpressServer;
}());
exports.InversifyExpressServer = InversifyExpressServer;
