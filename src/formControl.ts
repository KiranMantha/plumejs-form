import { signal } from '@plumejs/core';
import { InitialValueType, ValidatorFn, ValidatorObj } from './model';

const isFunction = (value) => typeof value === 'function';

const nodeName = (elem: Node, name: string) => {
  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
};

const _getTargetValue = (target: HTMLElement) => {
  let targetValue;
  switch (target.nodeName && target.nodeName.toLowerCase()) {
    case 'input':
    case 'textarea': {
      const nonTextElements = ['radio', 'checkbox'];
      if (nonTextElements.includes((target as HTMLInputElement).type)) {
        targetValue = (target as HTMLInputElement).checked
          ? (target as HTMLInputElement).value !== null && (target as HTMLInputElement).value !== 'on'
            ? (target as HTMLInputElement).value
            : true
          : false;
      } else {
        targetValue = (target as HTMLInputElement).value;
      }
      break;
    }
    case 'select': {
      const one = (target as HTMLSelectElement).type === 'select-one';
      const options = Array.from((target as HTMLSelectElement).options).filter(
        (option) =>
          !option.disabled &&
          (!(option.parentNode as HTMLSelectElement).disabled || !nodeName(option.parentNode, 'optgroup'))
      );
      const value = [...options]
        .filter((option) => option.selected)
        .map((option) => option.value ?? (option.textContent.match(/[^\x20\t\r\n\f]+/g) || []).join(' '));
      targetValue = one ? value[0] : value;
      break;
    }
    default: {
      targetValue = (target as HTMLInputElement).value;
      break;
    }
  }
  return targetValue;
};

export class FormControl {
  name: string;
  validators: Array<ValidatorFn | ValidatorObj>;
  isTouched = false;
  validity = null;

  private _initialValue: any;
  private _value: any;
  private _errorMessage = signal('');
  private _parent: { setError: (controlName: string, validity: Record<string, boolean> | null) => void } | null = null;

  constructor(
    name: string,
    controlValue: InitialValueType,
    parent?: { setError: (controlName: string, validity: Record<string, boolean> | null) => void } | null
  ) {
    const val = [...(Array.isArray(controlValue) ? controlValue : [controlValue])];
    this.name = name;
    this._initialValue = val[0];
    this._value = val[0];
    this.validators = val.length > 1 ? (val[1] as Array<ValidatorFn | ValidatorObj>) : [];
    this._parent = parent;
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
          this._value = _getTargetValue(e.target);
        },
        onblur: () => {
          this.isTouched = true;
          this.validate();
        }
      }
    };
  }

  validate() {
    let errorMessage = '';
    for (const validator of this.validators) {
      this.validity = isFunction(validator)
        ? (validator as ValidatorFn)(this.value as string)
        : (validator as ValidatorObj).rule(this.value as string);
      if (this.validity !== null) {
        errorMessage = !isFunction(validator) ? (validator as ValidatorObj).message : 'error';
        this._parent?.setError(this.name, this.validity);
        break;
      }
    }
    this._errorMessage.set(errorMessage);
  }

  reset() {
    this._value = this._initialValue;
    this.isTouched = false;
    this.validity = null;
    this._errorMessage.set('');
  }
}
