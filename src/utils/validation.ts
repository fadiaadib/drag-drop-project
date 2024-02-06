namespace App {
  // Validation
  export interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
  }

  export function validate(input: Validatable) {
    let valid = true;

    if (input.required) {
      valid = valid && input.value.toString().trim().length != 0;
    }
    if (input.minLength != null && typeof input.value === "string") {
      valid = valid && input.value.trim().length >= input.minLength;
    }
    if (input.maxLength != null && typeof input.value === "string") {
      valid = valid && input.value.trim().length <= input.maxLength;
    }
    if (input.minValue != null && typeof input.value === "number") {
      valid = valid && input.value >= input.minValue;
    }
    if (input.maxValue != null && typeof input.value === "number") {
      valid = valid && input.value <= input.maxValue;
    }

    return valid;
  }
}
