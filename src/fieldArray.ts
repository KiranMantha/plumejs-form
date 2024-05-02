import { signal } from '@plumejs/core';
import { FormControl } from './formControl';
import { InitialValueType } from './model';

const createToken = () => Math.random().toString(36).substring(2);

export class FieldArray {
  private _initialCollection: Array<Record<string, InitialValueType>>;
  private _controls = signal<Array<Array<{ name: string; indexedName: string; control: FormControl }>>>([]);

  validity = null;

  constructor(itemCollection: Array<Record<string, InitialValueType>>) {
    this._initialCollection = itemCollection;
    const controls = itemCollection.map((item) => {
      return this._generateControls(item);
    });
    this._controls.set(controls);
  }

  get value() {
    const valArr = this.controls.map((fields) => {
      const values = {};
      for (const field of fields) {
        values[field.name] = field.control.value;
      }
      return values;
    });
    return valArr;
  }

  get controls() {
    return [...this._controls()];
  }

  append(newItem: Record<string, InitialValueType>) {
    this._controls.set((prevValue) => [...prevValue, this._generateControls(newItem)]);
  }

  remove(index: number) {
    const controls = [...this.controls];
    controls.splice(index, 1);
    this._controls.set(controls);
  }

  validate() {
    const issues = this.controls
      .flatMap((controls) => {
        const ctrlErrors = controls.filter(({ control }) => {
          control.validate();
          if (control.errorMessage) return control.errorMessage;
        });
        if (ctrlErrors.length) return ctrlErrors;
      })
      .filter(Boolean);

    this.validity = issues.length
      ? {
          invalid: true
        }
      : null;
  }

  private _generateControls(item: Record<string, InitialValueType>) {
    const items = [];
    const token = createToken();
    for (const [key, value] of Object.entries(item)) {
      const control = {
        name: key,
        control: new FormControl(`${key}-${token}`, value),
        indexedName: `${key}-${token}`
      };
      items.push(control);
    }
    return items;
  }
}
