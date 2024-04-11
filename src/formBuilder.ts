import { signal } from "@plumejs/core";

function nodeName(elem: Node, name: string) {
  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
}

const _getTargetValue = (target: HTMLElement) => {
  let targetValue;
  switch (target.nodeName && target.nodeName.toLowerCase()) {
    case "input":
    case "textarea": {
      let nonTextElements = ["radio", "checkbox"];
      if (nonTextElements.includes((target as HTMLInputElement).type)) {
        targetValue = (target as HTMLInputElement).checked
          ? (target as HTMLInputElement).value !== null &&
            (target as HTMLInputElement).value !== "on"
            ? (target as HTMLInputElement).value
            : true
          : false;
      } else {
        targetValue = (target as HTMLInputElement).value;
      }
      break;
    }
    case "select": {
      const one = (target as HTMLSelectElement).type === "select-one";
      const options = Array.from((target as HTMLSelectElement).options).filter(
        (option) =>
          !option.disabled &&
          (!(option.parentNode as HTMLSelectElement).disabled ||
            !nodeName(option.parentNode, "optgroup"))
      );
      const value = [...options]
        .filter((option) => option.selected)
        .map(
          (option) =>
            option.value ??
            (option.textContent.match(/[^\x20\t\r\n\f]+/g) || []).join(" ")
        );
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

type InitialValues = Record<
  string,
  | string
  | number
  | boolean
  | string[]
  | [
      value: string | number | boolean | string[] | Record<string, unknown>[],
      validators?: Array<(value: string) => null | Record<string, boolean>>
    ]
>;

export class FormBuilder {
  private _initialValues: InitialValues;
  private _controls: Map<
    string,
    {
      value: unknown;
      validators: Array<(val: string) => null | Record<string, boolean>>;
    }
  > = new Map();
  private _errors = new Map<string, Record<string, boolean>>();
  private _errorCount;

  constructor(initialValues: InitialValues) {
    this._errorCount = signal(0);
    this._initialValues = initialValues;
    for (const [key, value] of Object.entries(initialValues)) {
      const val = [...(Array.isArray(value) ? value : [value])];
      this._controls.set(key, {
        value: val[0],
        validators:
          val.length > 1
            ? (val[1] as Array<(value: string) => Record<string, boolean>>)
            : [],
      });
    }
  }

  get hasErrors() {
    return !!this._errorCount();
  }

  get errors() {
    this._checkValidity();
    return this._errors;
  }

  get valid() {
    this._checkValidity();
    return this._errors.size ? false : true;
  }

  get value(): Record<
    string,
    string | number | boolean | Array<string | number | Record<string, unknown>>
  > {
    const values = {};
    for (const [key, value] of this._controls) {
      values[key] = value.value;
    }
    return values;
  }

  getControl(controlName: string) {
    return this._controls.get(controlName);
  }

  register(key: string) {
    return {
      attrs: {
        name: key,
        value: this.getControl(key).value,
        onchange: (e: Event) => {
          const value = _getTargetValue(e.target as HTMLElement);
          this.getControl(key).value = value;
        },
        onblur: () => {
          this._checkValidity();
        },
      },
    };
  }

  reset() {
    for (const [key, value] of Object.entries(this._initialValues)) {
      const val = [...(Array.isArray(value) ? value : [value])];
      this._controls.get(key).value = JSON.parse(JSON.stringify(val))[0];
    }
    this._errors.clear();
    this._errorCount.set(0);
  }

  private _checkValidity() {
    this._errors.clear();
    for (const [key, { value, validators }] of this._controls) {
      for (const validator of validators) {
        const validity = validator(value as string);
        if (validity !== null) {
          if (this._errors.has(key)) {
            this._errors.set(key, { ...this._errors.get(key), ...validity });
          } else {
            this._errors.set(key, validity);
          }
        }
      }
    }
    this._errorCount.set(this._errors.size);
  }
}
