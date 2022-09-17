import { interfaces } from 'inversify';
import type { Controller, ControllerMetadata, ControllerMethodMetadata, ControllerParameterMetadata, DecoratorTarget, IHttpActionResult } from './interfaces';
export declare const getControllersFromContainer: (container: interfaces.Container, forceControllers: boolean) => Promise<Array<Controller>>;
export declare function getControllersFromMetadata(): Array<DecoratorTarget>;
export declare function getControllerMetadata(constructor: NewableFunction): ControllerMetadata;
export declare function getControllerMethodMetadata(constructor: NewableFunction): Array<ControllerMethodMetadata>;
export declare function getControllerParameterMetadata(constructor: NewableFunction): ControllerParameterMetadata;
export declare function cleanUpMetadata(): void;
export declare function instanceOfIHttpActionResult(value: unknown): value is IHttpActionResult;
