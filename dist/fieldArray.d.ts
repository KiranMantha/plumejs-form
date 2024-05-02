import { FormControl } from './formControl';
import { InitialValueType } from './model';
export declare class FieldArray {
    private _initialCollection;
    private _controls;
    validity: any;
    constructor(itemCollection: Array<Record<string, InitialValueType>>);
    get value(): {}[];
    get controls(): {
        name: string;
        indexedName: string;
        control: FormControl;
    }[][];
    append(newItem: Record<string, InitialValueType>): void;
    remove(index: number): void;
    validate(): void;
    reset(): void;
    private _generateControls;
    private _generateItemControls;
}
