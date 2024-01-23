export declare class Validators {
    static required(value: string | number): {
        required: boolean;
    };
    static min(length: number): (value: string) => {
        minLength: {
            requiredLength: number;
        };
    };
    static max(length: number): (value: string) => {
        maxLength: {
            requiredLength: number;
        };
    };
    static pattern(expression: RegExp): (value: string) => {
        pattern: boolean;
    };
}
