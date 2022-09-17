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
exports.JsonResult = void 0;
const jsonContent_1 = require("../content/jsonContent");
const httpResponseMessage_1 = require("../httpResponseMessage");
class JsonResult {
    constructor(json, statusCode) {
        this.json = json;
        this.statusCode = statusCode;
    }
    executeAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new httpResponseMessage_1.HttpResponseMessage(this.statusCode);
            response.content = new jsonContent_1.JsonContent(this.json);
            return Promise.resolve(response);
        });
    }
}
exports.JsonResult = JsonResult;