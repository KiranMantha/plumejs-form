import { InitialValueType, ValidatorFn, ValidatorObj } from './model';
export declare class FormControl {
    name: string;
    validators: Array<ValidatorFn | ValidatorObj>;
    isTouched: boolean;
    validity: any;
    private _initialValue;
    private _value;
    private _errorMessage;
    private _parent;
    constructor(name: string, controlValue: InitialValueType, parent?: {
        setError: (controlName: string, validity: Record<string, boolean> | null) => void;
    } | null);
    get errorMessage(): string;
    get value(): any;
    register(): {
        attrs: {
            name: string;
            value: any;
            onchange: (e: any) => void;
            onblur: () => void;
        };
    };
    validate(): void;
    reset(): void;
}
