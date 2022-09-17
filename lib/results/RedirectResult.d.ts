/// <reference types="node" />
import { URL } from 'node:url';
import { HttpResponseMessage } from '../httpResponseMessage';
import type { IHttpActionResult } from '../interfaces';
export declare class RedirectResult implements IHttpActionResult {
    private location;
    constructor(location: string | URL);
    executeAsync(): Promise<HttpResponseMessage>;
}