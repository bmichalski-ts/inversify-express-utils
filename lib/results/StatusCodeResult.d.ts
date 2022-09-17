import { HttpResponseMessage } from '../httpResponseMessage';
import type { IHttpActionResult } from '../interfaces';
export declare class StatusCodeResult implements IHttpActionResult {
    private statusCode;
    constructor(statusCode: number);
    executeAsync(): Promise<HttpResponseMessage>;
}