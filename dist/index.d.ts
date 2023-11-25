declare module "@plumejs/forms" {
  export class FormBuilder {
    get errors(): Map;
    get valid(): boolean;
    get value(): Record<string, unknown>;
    getControl(controlName: string): {
      value: string;
      validators: Array<(value: string) => boolean>;
    };
    changeHandler(controlName: string): (e: Event) => void;
    reset(): void;
  }
  export class Validators {
    static required(value: string): boolean;
    static min(length: number): (value: string) => boolean;
    static max(length: number): (value: string) => boolean;
    static pattern(expression: RegEx): (value: string) => boolean;
  }
}
