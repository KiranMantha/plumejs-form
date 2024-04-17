"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validators = void 0;
var Validators = /** @class */ (function () {
    function Validators() {
    }
    Validators.required = function (value) {
        return value.toString().length ? null : { required: true };
    };
    Validators.min = function (length) {
        return function (value) {
            return value.length >= length ? null : { minLength: { requiredLength: length } };
        };
    };
    Validators.max = function (length) {
        return function (value) {
            return value.length <= length ? null : { maxLength: { requiredLength: length } };
        };
    };
    Validators.pattern = function (expression) {
        return function (value) {
            var regex = new RegExp(expression);
            return regex.test(value) ? null : { pattern: true };
        };
    };
    return Validators;
}());
exports.Validators = Validators;
