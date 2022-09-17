var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { injectHttpContext } from './decorators';
import { CreatedNegotiatedContentResult, ConflictResult, OkNegotiatedContentResult, OkResult, BadRequestErrorMessageResult, BadRequestResult, ExceptionResult, InternalServerErrorResult, NotFoundResult, RedirectResult, ResponseMessageResult, StatusCodeResult, JsonResult, } from './results';
var BaseHttpController = (function () {
    function BaseHttpController() {
    }
    BaseHttpController.prototype.created = function (location, content) {
        return new CreatedNegotiatedContentResult(location, content);
    };
    BaseHttpController.prototype.conflict = function () {
        return new ConflictResult();
    };
    BaseHttpController.prototype.ok = function (content) {
        return content === undefined
            ? new OkResult()
            : new OkNegotiatedContentResult(content);
    };
    BaseHttpController.prototype.badRequest = function (message) {
        return message === undefined
            ? new BadRequestResult()
            : new BadRequestErrorMessageResult(message);
    };
    BaseHttpController.prototype.internalServerError = function (error) {
        return error ? new ExceptionResult(error) : new InternalServerErrorResult();
    };
    BaseHttpController.prototype.notFound = function () {
        return new NotFoundResult();
    };
    BaseHttpController.prototype.redirect = function (uri) {
        return new RedirectResult(uri);
    };
    BaseHttpController.prototype.responseMessage = function (message) {
        return new ResponseMessageResult(message);
    };
    BaseHttpController.prototype.statusCode = function (statusCode) {
        return new StatusCodeResult(statusCode);
    };
    BaseHttpController.prototype.json = function (content, statusCode) {
        if (statusCode === void 0) { statusCode = StatusCodes.OK; }
        return new JsonResult(content, statusCode);
    };
    __decorate([
        injectHttpContext,
        __metadata("design:type", Object)
    ], BaseHttpController.prototype, "httpContext", void 0);
    BaseHttpController = __decorate([
        injectable()
    ], BaseHttpController);
    return BaseHttpController;
}());
export { BaseHttpController };