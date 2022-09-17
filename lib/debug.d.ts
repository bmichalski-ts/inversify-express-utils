import { interfaces as inversifyInterfaces } from 'inversify';
import type { RouteInfo, RawMetadata } from './interfaces';
export declare const getRouteInfo: (container: inversifyInterfaces.Container) => Promise<Array<RouteInfo>>;
export declare const getRawMetadata: (container: inversifyInterfaces.Container) => Promise<Array<RawMetadata>>;
