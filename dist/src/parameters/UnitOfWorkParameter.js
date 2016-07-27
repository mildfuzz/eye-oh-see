/// <reference path="../IContainer.ts" />
/// <reference path="IParameter.ts" />
"use strict";
var FactoryParameter_1 = require('./FactoryParameter');
var UnitOfWorkParameter = (function () {
    function UnitOfWorkParameter(paramServices, service) {
        this.paramServices = paramServices;
        this.service = service;
        this.factoryParameter = new FactoryParameter_1.default(paramServices, service);
    }
    UnitOfWorkParameter.prototype.resolve = function (container) {
        var _this = this;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var childContainer = container.createChild();
            var valueFactory = _this.factoryParameter.resolve(childContainer);
            var value = valueFactory.apply(void 0, args);
            var dispose = function () { return childContainer.dispose(); };
            return { value: value, dispose: dispose };
        };
    };
    return UnitOfWorkParameter;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UnitOfWorkParameter;