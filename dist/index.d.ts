declare module "@plumejs/forms" {
  type InitialValues = Record<
    string,
    | string
    | number
    | boolean
    | string[]
    | [
        value: string | number | boolean | string[] | Record<string, unknown>[],
        validators?: Array<(value: string) => boolean>
      ]
  >;
  export class FormBuilder {
    constructor(initialValues: InitialValues);
    get errors(): Map<string, Record<string, string>>;
    get valid(): boolean;
    get value(): Record<string, unknown>;
    getControl(controlName: keyof InitialValues): {
      value: string;
      validators: Array<(value: string) => boolean>;
    };
    changeHandler(controlName: keyof InitialValues): (e: Event) => void;
    reset(): void;
  }
  export class Validators {
    static required(value: string): boolean;
    static min(length: number): (value: string) => boolean;
    static max(length: number): (value: string) => boolean;
    static pattern(expression: RegEx): (value: string) => boolean;
  }
}
