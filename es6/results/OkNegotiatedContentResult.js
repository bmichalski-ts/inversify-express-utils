"use strict";
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
exports.OkNegotiatedContentResult = void 0;
const http_status_codes_1 = require("http-status-codes");
const httpResponseMessage_1 = require("../httpResponseMessage");
const stringContent_1 = require("../content/stringContent");
class OkNegotiatedContentResult {
    constructor(content) {
        this.content = content;
    }
    executeAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new httpResponseMessage_1.HttpResponseMessage(http_status_codes_1.StatusCodes.OK);
            response.content = new stringContent_1.StringContent(JSON.stringify(this.content));
            return Promise.resolve(response);
        });
    }
}
exports.OkNegotiatedContentResult = OkNegotiatedContentResult;