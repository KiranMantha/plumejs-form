var i = Object.defineProperty;
var a = (r, e, t) => e in r ? i(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var l = (r, e, t) => (a(r, typeof e != "symbol" ? e + "" : e, t), t);
const c = (r) => {
  let e;
  switch (r.nodeName && r.nodeName.toLowerCase()) {
    case "input":
    case "textarea": {
      ["radio", "checkbox"].includes(r.type) ? e = r.checked ? r.value !== null && r.value !== "on" ? r.value : !0 : !1 : e = r.value;
      break;
    }
    case "select": {
      const t = r.type === "select-one", o = [...Array.from(r.options)].filter((n) => n.selected).map(
        (n) => n.value ?? (n.textContent.match(/[^\x20\t\r\n\f]+/g) || []).join(" ")
      );
      e = t ? o[0] : o;
      break;
    }
    default: {
      e = r.value;
      break;
    }
  }
  return e;
};
class h {
  constructor(e) {
    /**
     * @private
     */
    l(this, "_initialValues");
    /**
     * @private
     */
    l(this, "_controls", /* @__PURE__ */ Object.create(null));
    /**
     * @private
     */
    l(this, "_errors", /* @__PURE__ */ new Map());
    this._initialValues = e;
    for (const [t, s] of Object.entries(e)) {
      const o = [...Array.isArray(s) ? s : [s]];
      this._controls[t] = {
        value: o[0],
        validators: o.length > 1 ? o[1] : []
      };
    }
    this.changeHandler = this.changeHandler.bind(this), this.getControl = this.getControl.bind(this), this.reset = this.reset.bind(this);
  }
  /**
   * @type Map
   */
  get errors() {
    return this._checkValidity(), this._errors;
  }
  /**
   * @type boolean
   */
  get valid() {
    return this._checkValidity(), !this._errors.size;
  }
  /**
   * @type Object
   */
  get value() {
    const e = {};
    for (const [t, s] of Object.entries(this._controls))
      e[t] = s.value;
    return e;
  }
  getControl(e) {
    return this._controls[e];
  }
  changeHandler(e) {
    return (t) => {
      const s = c(t.target);
      this.getControl(e).value = s, this._isTouched = !0;
    };
  }
  reset() {
    for (const [e, t] of Object.entries(this._initialValues)) {
      const s = [...Array.isArray(t) ? t : [t]];
      this._controls[e].value = JSON.parse(JSON.stringify(s))[0];
    }
    this._errors.clear(), this._isTouched = !1;
  }
  /**
   * @private
   */
  _checkValidity() {
    this._errors.clear(), this._isTouched = !0;
    for (const e in this._controls) {
      const t = this._controls[e].value, s = this._controls[e].validators;
      this._controls[e].errors = null;
      for (const o of s) {
        const n = o(t);
        n !== null && (this._errors.has(e) ? (this._errors.set(e, { ...this._errors.get(e), ...n }), this._controls[e].errors = {
          ...this._controls[e].errors,
          ...n
        }) : (this._errors.set(e, n), this._controls[e].errors = n));
      }
    }
  }
}
class d {
  static required(e) {
    return e.length ? null : { required: !0 };
  }
  static min(e) {
    return (t) => t.length >= e ? null : { minLength: { requiredLength: e } };
  }
  static max(e) {
    return (t) => t.length <= e ? null : { maxLength: { requiredLength: e } };
  }
  static pattern(e) {
    return (t) => new RegExp(e).test(t) ? null : { pattern: !0 };
  }
}
export {
  h as FormBuilder,
  d as Validators
};
