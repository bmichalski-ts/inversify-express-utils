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
exports.instanceOfIHttpActionResult = exports.cleanUpMetadata = exports.getControllerParameterMetadata = exports.getControllerMethodMetadata = exports.getControllerMetadata = exports.getControllersFromMetadata = exports.getControllersFromContainer = void 0;
const constants_1 = require("./constants");
const getControllersFromContainer = (container, forceControllers) => __awaiter(void 0, void 0, void 0, function* () {
    if (container.isBound(constants_1.TYPE.Controller)) {
        return container.getAllAsync(constants_1.TYPE.Controller);
    }
    if (forceControllers) {
        throw new Error(constants_1.NO_CONTROLLERS_FOUND);
    }
    else {
        return [];
    }
});
exports.getControllersFromContainer = getControllersFromContainer;
function getControllersFromMetadata() {
    const arrayOfControllerMetadata = Reflect.getMetadata(constants_1.METADATA_KEY.controller, Reflect) || [];
    return arrayOfControllerMetadata.map(metadata => metadata.target);
}
exports.getControllersFromMetadata = getControllersFromMetadata;
function getControllerMetadata(constructor) {
    const controllerMetadata = Reflect.getOwnMetadata(constants_1.METADATA_KEY.controller, constructor);
    return controllerMetadata;
}
exports.getControllerMetadata = getControllerMetadata;
function getControllerMethodMetadata(constructor) {
    const methodMetadata = Reflect.getOwnMetadata(constants_1.METADATA_KEY.controllerMethod, constructor);
    const genericMetadata = Reflect.getMetadata(constants_1.METADATA_KEY.controllerMethod, Reflect.getPrototypeOf(constructor));
    if (genericMetadata !== undefined && methodMetadata !== undefined) {
        return methodMetadata.concat(genericMetadata);
    }
    if (genericMetadata !== undefined) {
        return genericMetadata;
    }
    return methodMetadata;
}
exports.getControllerMethodMetadata = getControllerMethodMetadata;
function getControllerParameterMetadata(constructor) {
    const parameterMetadata = Reflect.getOwnMetadata(constants_1.METADATA_KEY.controllerParameter, constructor);
    const genericMetadata = Reflect.getMetadata(constants_1.METADATA_KEY.controllerParameter, Reflect.getPrototypeOf(constructor));
    if (genericMetadata !== undefined && parameterMetadata !== undefined) {
        return Object.assign(Object.assign({}, parameterMetadata), genericMetadata);
    }
    if (genericMetadata !== undefined) {
        return genericMetadata;
    }
    return parameterMetadata;
}
exports.getControllerParameterMetadata = getControllerParameterMetadata;
function cleanUpMetadata() {
    Reflect.defineMetadata(constants_1.METADATA_KEY.controller, [], Reflect);
}
exports.cleanUpMetadata = cleanUpMetadata;
function instanceOfIHttpActionResult(value) {
    return value != null &&
        typeof value.executeAsync === 'function';
}
exports.instanceOfIHttpActionResult = instanceOfIHttpActionResult;
