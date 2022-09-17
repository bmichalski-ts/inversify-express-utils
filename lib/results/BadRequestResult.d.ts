import { HttpResponseMessage } from '../httpResponseMessage';
import type { IHttpActionResult } from '../interfaces';
export declare class BadRequestResult implements IHttpActionResult {
    executeAsync(): Promise<HttpResponseMessage>;
}