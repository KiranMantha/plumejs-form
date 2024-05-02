export type InitialValueType =
  | string
  | number
  | boolean
  | string[]
  | [
      value: string | number | boolean | string[] | Record<string, unknown>[],
      validators?: Array<ValidatorFn | ValidatorObj>
    ];
export type ValidatorFn = (val: string) => null | Record<string, boolean>;
export type ValidatorObj = { rule: ValidatorFn; message?: string };
export type FormValues = Record<string, string | number | boolean | Array<string | number | Record<string, unknown>>>;
