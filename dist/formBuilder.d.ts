type InitialValues = Record<string, string | number | boolean | string[] | [
    value: string | number | boolean | string[] | Record<string, unknown>[],
    validators?: Array<(value: string) => null | Record<string, boolean>>
]>;
export declare class FormBuilder {
    private _initialValues;
    private _controls;
    private _errors;
    private _errorCount;
    constructor(initialValues: InitialValues);
    get hasErrors(): boolean;
    get errors(): Map<string, Record<string, boolean>>;
    get valid(): boolean;
    get value(): Record<string, string | number | boolean | Array<string | number | Record<string, unknown>>>;
    getControl(controlName: string): {
        value: unknown;
        validators: ((val: string) => Record<string, boolean>)[];
    };
    register(key: string): {
        attrs: {
            name: string;
            value: unknown;
            onchange: (e: Event) => void;
            onblur: () => void;
        };
    };
    reset(): void;
    private _checkValidity;
}
export {};
