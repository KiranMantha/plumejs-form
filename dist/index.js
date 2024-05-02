import { signal as l } from "@plumejs/core";
const n = (s) => typeof s == "function", h = (s, e) => s.nodeName && s.nodeName.toLowerCase() === e.toLowerCase(), c = (s) => {
  let e;
  switch (s.nodeName && s.nodeName.toLowerCase()) {
    case "input":
    case "textarea": {
      ["radio", "checkbox"].includes(s.type) ? e = s.checked ? s.value !== null && s.value !== "on" ? s.value : !0 : !1 : e = s.value;
      break;
    }
    case "select": {
      const t = s.type === "select-one", i = [...Array.from(s.options).filter(
        (o) => !o.disabled && (!o.parentNode.disabled || !h(o.parentNode, "optgroup"))
      )].filter((o) => o.selected).map((o) => o.value ?? (o.textContent.match(/[^\x20\t\r\n\f]+/g) || []).join(" "));
      e = t ? i[0] : i;
      break;
    }
    default: {
      e = s.value;
      break;
    }
  }
  return e;
};
class a {
  constructor(e, t, r) {
    this.isTouched = !1, this.validity = null, this._errorMessage = l(""), this._parent = null;
    const i = [...Array.isArray(t) ? t : [t]];
    this.name = e, this._initialValue = i[0], this._value = i[0], this.validators = i.length > 1 ? i[1] : [], this._parent = r;
  }
  get errorMessage() {
    return this._errorMessage();
  }
  get value() {
    return this._value;
  }
  register() {
    return {
      attrs: {
        name: this.name,
        value: this.value,
        onchange: (e) => {
          this._value = c(e.target);
        },
        onblur: () => {
          this.isTouched = !0, this.validate();
        }
      }
    };
  }
  validate() {
    var t;
    let e = "";
    for (const r of this.validators)
      if (this.validity = n(r) ? r(this.value) : r.rule(this.value), this.validity !== null) {
        e = n(r) ? "error" : r.message, (t = this._parent) == null || t.setError(this.name, this.validity);
        break;
      }
    this._errorMessage.set(e);
  }
  reset() {
    this._value = this._initialValue, this.isTouched = !1, this.validity = null, this._errorMessage.set("");
  }
}
const d = () => Math.random().toString(36).substring(2);
class _ {
  constructor(e) {
    this._controls = l([]), this.validity = null, this._initialCollection = e;
    const t = this._generateControls(e);
    this._controls.set(t);
  }
  get value() {
    return this.controls.map((t) => {
      const r = {};
      for (const i of t)
        r[i.name] = i.control.value;
      return r;
    });
  }
  get controls() {
    return [...this._controls()];
  }
  append(e) {
    this._controls.set((t) => [...t, this._generateItemControls(e)]);
  }
  remove(e) {
    const t = [...this.controls];
    t.splice(e, 1), this._controls.set(t);
  }
  validate() {
    const e = this.controls.flatMap((t) => {
      const r = t.filter(({ control: i }) => {
        if (i.validate(), i.errorMessage)
          return i.errorMessage;
      });
      if (r.length)
        return r;
    }).filter(Boolean);
    this.validity = e.length ? {
      invalid: !0
    } : null;
  }
  reset() {
    const e = this._generateControls(this._initialCollection);
    this.validity = null, this._controls.set(e);
  }
  _generateControls(e) {
    return e.map((t) => this._generateItemControls(t));
  }
  _generateItemControls(e) {
    const t = [], r = d();
    for (const [i, o] of Object.entries(e)) {
      const u = {
        name: i,
        control: new a(`${i}-${r}`, o),
        indexedName: `${i}-${r}`
      };
      t.push(u);
    }
    return t;
  }
}
class g {
  constructor(e) {
    this._controls = /* @__PURE__ */ new Map(), this._errors = /* @__PURE__ */ new Map(), this._errorCount = 0, this._isSubmitted = !1, this._initialValues = e;
    for (const [t, r] of Object.entries(e))
      r instanceof _ ? this._controls.set(t, r) : this._controls.set(t, new a(t, r, { setError: this._setError.bind(this) }));
  }
  get hasErrors() {
    return !!this._errorCount;
  }
  get errors() {
    return this._errors;
  }
  get valid() {
    return !this._errors.size;
  }
  get value() {
    const e = {};
    for (const [t, r] of this._controls)
      e[t] = r.value;
    return e;
  }
  get submitted() {
    return this._isSubmitted;
  }
  getControl(e) {
    return this._controls.get(e);
  }
  register(e) {
    return this.getControl(e).register();
  }
  handleSubmit(e, t) {
    e.preventDefault(), this._isSubmitted = !0, this._checkValidity(), t(this.value);
  }
  reset() {
    this._controls.forEach((e) => {
      e.reset();
    }), this._isSubmitted = !1, this._errors.clear(), this._errorCount = 0;
  }
  _setError(e, t) {
    t ? this._errors.set(e, t) : this._errors.delete(e), this._errorCount = this._errors.size;
  }
  _checkValidity() {
    this._errors.clear();
    for (const [e] of this._controls)
      this._executeValidators(e);
    this._errorCount = this._errors.size;
  }
  _executeValidators(e) {
    const t = this.getControl(e);
    t.validate(), t.validity !== null ? this._errors.set(e, { ...this._errors.get(e) || {}, ...t.validity }) : this._errors.delete(e);
  }
}
class f {
  static required(e) {
    return e.toString().length ? null : { required: !0 };
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
  _ as FieldArray,
  g as FormBuilder,
  f as Validators
};
