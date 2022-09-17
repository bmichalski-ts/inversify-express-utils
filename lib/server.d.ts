import express, { Application, Router } from 'express';
import { interfaces } from 'inversify';
import type { AuthProvider, ConfigFunction, RoutingConfig } from './interfaces';
export declare class InversifyExpressServer {
    private _router;
    private _container;
    private _app;
    private _configFn;
    private _errorConfigFn;
    private _routingConfig;
    private _AuthProvider;
    private _forceControllers;
    constructor(container: interfaces.Container, customRouter?: Router | null, routingConfig?: RoutingConfig | null, customApp?: Application | null, authProvider?: (new () => AuthProvider) | null, forceControllers?: boolean);
    setConfig(fn: ConfigFunction): InversifyExpressServer;
    setErrorConfig(fn: ConfigFunction): InversifyExpressServer;
    build(): Promise<express.Application>;
    private registerControllers;
    private resolveMidleware;
    private copyHeadersTo;
    private handleHttpResponseMessage;
    private handlerFactory;
    private _getHttpContext;
    private _createHttpContext;
    private _getCurrentUser;
    private extractParameters;
    private getParam;
    private _getPrincipal;
}