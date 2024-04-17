type InitialValues = Record<string, string | number | boolean | string[] | [
    value: string | number | boolean | string[] | Record<string, unknown>[],
    validators?: Array<ValidatorFn | ValidatorObj>
]>;
type ValidatorFn = (val: string) => null | Record<string, boolean>;
type ValidatorObj = {
    rule: ValidatorFn;
    message?: string;
};
export type FormValues = Record<string, string | number | boolean | Array<string | number | Record<string, unknown>>>;
export declare class FormBuilder {
    private _initialValues;
    private _controls;
    private _errors;
    private _errorCount;
    private _isSubmitted;
    constructor(initialValues: InitialValues);
    get hasErrors(): boolean;
    get errors(): Map<string, Record<string, boolean>>;
    get valid(): boolean;
    get value(): FormValues;
    get submitted(): boolean;
    getControl(controlName: string): {
        value: unknown;
        validators: (ValidatorFn | ValidatorObj)[];
        isTouched: boolean;
        errorMessage: string;
    };
    register(key: string): {
        attrs: {
            name: string;
            value: unknown;
            onchange: (e: Event) => void;
            onblur: () => void;
        };
    };
    handleSubmit(e: Event, fn: (values: FormValues) => void): void;
    reset(): void;
    private _checkValidity;
    private _executeValidators;
}
export {};
