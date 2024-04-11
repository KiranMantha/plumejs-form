"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormBuilder = void 0;
var core_1 = require("@plumejs/core");
function nodeName(elem, name) {
    return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
}
var _getTargetValue = function (target) {
    var targetValue;
    switch (target.nodeName && target.nodeName.toLowerCase()) {
        case "input":
        case "textarea": {
            var nonTextElements = ["radio", "checkbox"];
            if (nonTextElements.includes(target.type)) {
                targetValue = target.checked
                    ? target.value !== null &&
                        target.value !== "on"
                        ? target.value
                        : true
                    : false;
            }
            else {
                targetValue = target.value;
            }
            break;
        }
        case "select": {
            var one = target.type === "select-one";
            var options = Array.from(target.options).filter(function (option) {
                return !option.disabled &&
                    (!option.parentNode.disabled ||
                        !nodeName(option.parentNode, "optgroup"));
            });
            var value = __spreadArray([], __read(options), false).filter(function (option) { return option.selected; })
                .map(function (option) {
                var _a;
                return (_a = option.value) !== null && _a !== void 0 ? _a : (option.textContent.match(/[^\x20\t\r\n\f]+/g) || []).join(" ");
            });
            targetValue = one ? value[0] : value;
            break;
        }
        default: {
            targetValue = target.value;
            break;
        }
    }
    return targetValue;
};
var FormBuilder = /** @class */ (function () {
    function FormBuilder(initialValues) {
        var e_1, _a;
        this._controls = new Map();
        this._errors = new Map();
        this._errorCount = (0, core_1.signal)(0);
        this._initialValues = initialValues;
        try {
            for (var _b = __values(Object.entries(initialValues)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                var val = __spreadArray([], __read((Array.isArray(value) ? value : [value])), false);
                this._controls.set(key, {
                    value: val[0],
                    validators: val.length > 1
                        ? val[1]
                        : [],
                });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    Object.defineProperty(FormBuilder.prototype, "hasErrors", {
        get: function () {
            return !!this._errorCount();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormBuilder.prototype, "errors", {
        get: function () {
            this._checkValidity();
            return this._errors;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormBuilder.prototype, "valid", {
        get: function () {
            this._checkValidity();
            return this._errors.size ? false : true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormBuilder.prototype, "value", {
        get: function () {
            var e_2, _a;
            var values = {};
            try {
                for (var _b = __values(this._controls), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                    values[key] = value.value;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return values;
        },
        enumerable: false,
        configurable: true
    });
    FormBuilder.prototype.getControl = function (controlName) {
        return this._controls.get(controlName);
    };
    FormBuilder.prototype.register = function (key) {
        var _this = this;
        return {
            attrs: {
                name: key,
                value: this.getControl(key).value,
                onchange: function (e) {
                    var value = _getTargetValue(e.target);
                    _this.getControl(key).value = value;
                },
                onblur: function () {
                    _this._checkValidity();
                },
            },
        };
    };
    FormBuilder.prototype.reset = function () {
        var e_3, _a;
        try {
            for (var _b = __values(Object.entries(this._initialValues)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                var val = __spreadArray([], __read((Array.isArray(value) ? value : [value])), false);
                this._controls.get(key).value = JSON.parse(JSON.stringify(val))[0];
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        this._errors.clear();
        this._errorCount.set(0);
    };
    FormBuilder.prototype._checkValidity = function () {
        var e_4, _a, e_5, _b;
        this._errors.clear();
        try {
            for (var _c = __values(this._controls), _d = _c.next(); !_d.done; _d = _c.next()) {
                var _e = __read(_d.value, 2), key = _e[0], _f = _e[1], value = _f.value, validators = _f.validators;
                try {
                    for (var validators_1 = (e_5 = void 0, __values(validators)), validators_1_1 = validators_1.next(); !validators_1_1.done; validators_1_1 = validators_1.next()) {
                        var validator = validators_1_1.value;
                        var validity = validator(value);
                        if (validity !== null) {
                            if (this._errors.has(key)) {
                                this._errors.set(key, __assign(__assign({}, this._errors.get(key)), validity));
                            }
                            else {
                                this._errors.set(key, validity);
                            }
                        }
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (validators_1_1 && !validators_1_1.done && (_b = validators_1.return)) _b.call(validators_1);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_4) throw e_4.error; }
        }
        this._errorCount.set(this._errors.size);
    };
    return FormBuilder;
}());
exports.FormBuilder = FormBuilder;
