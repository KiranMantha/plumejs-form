import { FieldArray } from './fieldArray';
import { FormControl } from './formControl';
import { FormValues, InitialValueType } from './model';

type InitialValues = Record<string, InitialValueType | FieldArray>;

export class FormBuilder {
  private _initialValues: InitialValues;
  private _controls: Map<string, FormControl | FieldArray> = new Map();
  private _errors = new Map<string, Record<string, boolean>>();
  private _errorCount = 0;
  private _isSubmitted = false;

  constructor(initialValues: InitialValues) {
    this._initialValues = initialValues;
    for (const [key, value] of Object.entries(initialValues)) {
      if (value instanceof FieldArray) {
        this._controls.set(key, value);
      } else {
        this._controls.set(key, new FormControl(key, value, { setError: this._setError.bind(this) }));
      }
    }
  }

  get hasErrors() {
    return !!this._errorCount;
  }

  get errors() {
    return this._errors;
  }

  get valid() {
    return this._errors.size ? false : true;
  }

  get value(): FormValues {
    const values = {};
    for (const [key, value] of this._controls) {
      values[key] = value.value;
    }
    return values;
  }

  get submitted(): boolean {
    return this._isSubmitted;
  }

  getControl(controlName: string) {
    return this._controls.get(controlName);
  }

  register(key: string) {
    return (this.getControl(key) as FormControl).register();
  }

  handleSubmit(e: Event, fn: (values: FormValues) => void) {
    e.preventDefault();
    this._isSubmitted = true;
    this._checkValidity();
    fn(this.value);
  }

  reset() {
    // for (const [key, value] of Object.entries(this._initialValues)) {
    //   const val = [...(Array.isArray(value) ? value : [value])];
    //   const { validators } = this._controls.get(key);
    //   this._controls.set(key, {
    //     value: JSON.parse(JSON.stringify(val))[0],
    //     validators,
    //     isTouched: false,
    //     errorMessage: ''
    //   });
    // }
    // this._isSubmitted = false;
    // this._errors.clear();
    // this._errorCount.set(0);
  }

  private _setError(key: string, validity: Record<string, boolean>) {
    if (validity) {
      this._errors.set(key, validity);
    } else {
      this._errors.delete(key);
    }
    this._errorCount = this._errors.size;
  }

  private _checkValidity() {
    this._errors.clear();
    for (const [key] of this._controls) {
      this._executeValidators(key);
    }
    this._errorCount = this._errors.size;
  }

  private _executeValidators(controlName: string) {
    const control = this.getControl(controlName);
    control.validate();
    if (control.validity !== null) {
      this._errors.set(controlName, { ...(this._errors.get(controlName) || {}), ...control.validity });
    } else {
      this._errors.delete(controlName);
    }
  }
}
