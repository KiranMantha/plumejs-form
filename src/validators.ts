export class Validators {
  static required(value: string | number) {
    return value.toString().length ? null : { required: true };
  }

  static min(length: number) {
    return (value: string) => {
      return value.length >= length
        ? null
        : { minLength: { requiredLength: length } };
    };
  }

  static max(length: number) {
    return (value: string) => {
      return value.length <= length
        ? null
        : { maxLength: { requiredLength: length } };
    };
  }

  static pattern(expression: RegExp) {
    return (value: string) => {
      const regex = new RegExp(expression);
      return regex.test(value) ? null : { pattern: true };
    };
  }
}
