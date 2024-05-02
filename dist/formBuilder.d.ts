import { FieldArray } from './fieldArray';
import { FormControl } from './formControl';
import { FormValues, InitialValueType } from './model';
type InitialValues = Record<string, InitialValueType | FieldArray>;
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
    getControl(controlName: string): FormControl | FieldArray;
    register(key: string): {
        attrs: {
            name: string;
            value: any;
            onchange: (e: any) => void;
            onblur: () => void;
        };
    };
    handleSubmit(e: Event, fn: (values: FormValues) => void): void;
    reset(): void;
    private _setError;
    private _checkValidity;
    private _executeValidators;
}
export {};
