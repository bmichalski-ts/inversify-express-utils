/// <reference types="node" />
import { URL } from 'node:url';
import { HttpResponseMessage } from '../httpResponseMessage';
import type { IHttpActionResult } from '../interfaces';
export declare class CreatedNegotiatedContentResult<T> implements IHttpActionResult {
    private location;
    private content;
    constructor(location: string | URL, content: T);
    executeAsync(): Promise<HttpResponseMessage>;
}