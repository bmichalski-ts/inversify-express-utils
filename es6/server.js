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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InversifyExpressServer = void 0;
const express_1 = __importStar(require("express"));
const index_1 = require("./index");
const utils_1 = require("./utils");
const constants_1 = require("./constants");
const httpResponseMessage_1 = require("./httpResponseMessage");
class InversifyExpressServer {
    constructor(container, customRouter, routingConfig, customApp, authProvider, forceControllers = true) {
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
    setConfig(fn) {
        this._configFn = fn;
        return this;
    }
    setErrorConfig(fn) {
        this._errorConfigFn = fn;
        return this;
    }
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            this._app.all('*', (req, res, next) => {
                void (() => __awaiter(this, void 0, void 0, function* () {
                    const httpContext = yield this._createHttpContext(req, res, next);
                    Reflect.defineMetadata(constants_1.METADATA_KEY.httpContext, httpContext, req);
                    next();
                }))();
            });
            if (this._configFn) {
                this._configFn.apply(undefined, [this._app]);
            }
            yield this.registerControllers();
            if (this._errorConfigFn) {
                this._errorConfigFn.apply(undefined, [this._app]);
            }
            return this._app;
        });
    }
    registerControllers() {
        return __awaiter(this, void 0, void 0, function* () {
            this._container
                .bind(constants_1.TYPE.HttpContext)
                .toConstantValue({});
            const constructors = (0, utils_1.getControllersFromMetadata)();
            constructors.forEach(constructor => {
                const { name } = constructor;
                if (this._container.isBoundNamed(constants_1.TYPE.Controller, name)) {
                    throw new Error((0, constants_1.DUPLICATED_CONTROLLER_NAME)(name));
                }
                this._container.bind(constants_1.TYPE.Controller)
                    .to(constructor)
                    .whenTargetNamed(name);
            });
            const controllers = yield (0, utils_1.getControllersFromContainer)(this._container, this._forceControllers);
            yield Promise.all(controllers.map((controller) => __awaiter(this, void 0, void 0, function* () {
                const controllerMetadata = (0, utils_1.getControllerMetadata)(controller.constructor);
                const methodMetadata = (0, utils_1.getControllerMethodMetadata)(controller.constructor);
                const parameterMetadata = (0, utils_1.getControllerParameterMetadata)(controller.constructor);
                if (controllerMetadata && methodMetadata) {
                    const controllerMiddleware = yield this.resolveMidleware(...controllerMetadata.middleware);
                    yield Promise.all(methodMetadata.map((metadata) => __awaiter(this, void 0, void 0, function* () {
                        let paramList = [];
                        if (parameterMetadata) {
                            paramList = parameterMetadata[metadata.key] || [];
                        }
                        const handler = this.handlerFactory(controllerMetadata.target.name, metadata.key, paramList);
                        const routeMiddleware = yield this.resolveMidleware(...metadata.middleware);
                        this._router[metadata.method](`${controllerMetadata.path}${metadata.path}`, ...controllerMiddleware, ...routeMiddleware, handler);
                    })));
                }
            })));
            this._app.use(this._routingConfig.rootPath, this._router);
        });
    }
    resolveMidleware(...middleware) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(middleware.map((middlewareItem) => __awaiter(this, void 0, void 0, function* () {
                if (!this._container.isBound(middlewareItem)) {
                    return middlewareItem;
                }
                const middlewareInstance = yield this._container
                    .getAsync(middlewareItem);
                if (middlewareInstance instanceof index_1.BaseMiddleware) {
                    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                        const mReq = yield this._container.getAsync(middlewareItem);
                        mReq.httpContext = this._getHttpContext(req);
                        mReq.handler(req, res, next);
                    });
                }
                return middlewareInstance;
            })));
        });
    }
    copyHeadersTo(headers, target) {
        for (const name of Object.keys(headers)) {
            const headerValue = headers[name];
            target.append(name, typeof headerValue === 'number' ? headerValue.toString() : headerValue);
        }
    }
    handleHttpResponseMessage(message, res) {
        return __awaiter(this, void 0, void 0, function* () {
            this.copyHeadersTo(message.headers, res);
            if (message.content !== undefined) {
                this.copyHeadersTo(message.content.headers, res);
                res.status(message.statusCode)
                    .send(yield message.content.readAsync());
            }
            else {
                res.sendStatus(message.statusCode);
            }
        });
    }
    handlerFactory(controllerName, key, parameterMetadata) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const args = this.extractParameters(req, res, next, parameterMetadata);
                const httpContext = this._getHttpContext(req);
                httpContext.container.bind(constants_1.TYPE.HttpContext)
                    .toConstantValue(httpContext);
                const value = yield httpContext.container.getNamed(constants_1.TYPE.Controller, controllerName)[key](...args);
                if (value instanceof httpResponseMessage_1.HttpResponseMessage) {
                    yield this.handleHttpResponseMessage(value, res);
                }
                else if ((0, utils_1.instanceOfIHttpActionResult)(value)) {
                    const httpResponseMessage = yield value.executeAsync();
                    yield this.handleHttpResponseMessage(httpResponseMessage, res);
                }
                else if (value instanceof Function) {
                    value();
                }
                else if (!res.headersSent) {
                    if (value === undefined) {
                        res.status(204);
                    }
                    res.send(value);
                }
            }
            catch (err) {
                next(err);
            }
        });
    }
    _getHttpContext(req) {
        return Reflect.getMetadata(constants_1.METADATA_KEY.httpContext, req);
    }
    _createHttpContext(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const principal = yield this._getCurrentUser(req, res, next);
            return {
                container: this._container.createChild(),
                request: req,
                response: res,
                user: principal
            };
        });
    }
    _getCurrentUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._AuthProvider !== undefined) {
                const authProvider = yield this._container.getAsync(constants_1.TYPE.AuthProvider);
                return authProvider.getUser(req, res, next);
            }
            return Promise.resolve({
                details: null,
                isAuthenticated: () => Promise.resolve(false),
                isInRole: (_role) => Promise.resolve(false),
                isResourceOwner: (_resourceId) => Promise.resolve(false),
            });
        });
    }
    extractParameters(req, res, next, params) {
        const args = [];
        if (!params || !params.length) {
            return [req, res, next];
        }
        params.forEach(({ type, index, parameterName, injectRoot, }) => {
            switch (type) {
                case constants_1.PARAMETER_TYPE.REQUEST:
                    args[index] = req;
                    break;
                case constants_1.PARAMETER_TYPE.NEXT:
                    args[index] = next;
                    break;
                case constants_1.PARAMETER_TYPE.PARAMS:
                    args[index] = this.getParam(req, 'params', injectRoot, parameterName);
                    break;
                case constants_1.PARAMETER_TYPE.QUERY:
                    args[index] = this.getParam(req, 'query', injectRoot, parameterName);
                    break;
                case constants_1.PARAMETER_TYPE.BODY:
                    args[index] = req.body;
                    break;
                case constants_1.PARAMETER_TYPE.HEADERS:
                    args[index] = this.getParam(req, 'headers', injectRoot, parameterName);
                    break;
                case constants_1.PARAMETER_TYPE.COOKIES:
                    args[index] = this.getParam(req, 'cookies', injectRoot, parameterName);
                    break;
                case constants_1.PARAMETER_TYPE.PRINCIPAL:
                    args[index] = this._getPrincipal(req);
                    break;
                default:
                    args[index] = res;
                    break;
            }
        });
        args.push(req, res, next);
        return args;
    }
    getParam(source, paramType, injectRoot, name) {
        const key = paramType === 'headers' ? name === null || name === void 0 ? void 0 : name.toLowerCase() : name;
        const param = source[paramType];
        if (injectRoot) {
            return param;
        }
        return (param && key) ? param[key] : undefined;
    }
    _getPrincipal(req) {
        return this._getHttpContext(req).user;
    }
}
exports.InversifyExpressServer = InversifyExpressServer;