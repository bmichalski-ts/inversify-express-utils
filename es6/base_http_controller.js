"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseHttpController = void 0;
const inversify_1 = require("inversify");
const http_status_codes_1 = require("http-status-codes");
const decorators_1 = require("./decorators");
const results_1 = require("./results");
let BaseHttpController = class BaseHttpController {
    created(location, content) {
        return new results_1.CreatedNegotiatedContentResult(location, content);
    }
    conflict() {
        return new results_1.ConflictResult();
    }
    ok(content) {
        return content === undefined
            ? new results_1.OkResult()
            : new results_1.OkNegotiatedContentResult(content);
    }
    badRequest(message) {
        return message === undefined
            ? new results_1.BadRequestResult()
            : new results_1.BadRequestErrorMessageResult(message);
    }
    internalServerError(error) {
        return error ? new results_1.ExceptionResult(error) : new results_1.InternalServerErrorResult();
    }
    notFound() {
        return new results_1.NotFoundResult();
    }
    redirect(uri) {
        return new results_1.RedirectResult(uri);
    }
    responseMessage(message) {
        return new results_1.ResponseMessageResult(message);
    }
    statusCode(statusCode) {
        return new results_1.StatusCodeResult(statusCode);
    }
    json(content, statusCode = http_status_codes_1.StatusCodes.OK) {
        return new results_1.JsonResult(content, statusCode);
    }
};
__decorate([
    decorators_1.injectHttpContext,
    __metadata("design:type", Object)
], BaseHttpController.prototype, "httpContext", void 0);
BaseHttpController = __decorate([
    (0, inversify_1.injectable)()
], BaseHttpController);
exports.BaseHttpController = BaseHttpController;
