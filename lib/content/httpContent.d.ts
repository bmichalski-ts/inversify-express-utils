/// <reference types="node" />
import type { OutgoingHttpHeaders } from 'node:http';
export declare abstract class HttpContent {
    private _headers;
    get headers(): OutgoingHttpHeaders;
    abstract readAsync(): Promise<string | Record<string, unknown> | Record<string, unknown>[]>;
}
