export class RequiredFieldError extends Error {
   constructor(fieldName: string) {
      super(`The field ${fieldName} is required`);
      this.name = 'RequiredFieldError';
   }
}

export class InvalidMimeTypeError extends Error {
   constructor(allowed: string[]) {
      super(`Unsupported type. Allowed types: ${allowed.join(', ')}`);
      this.name = 'InvalidMimeType';
   }
}

export class MaxFileSizeError extends Error {
   constructor(maxFileSizeInMb: number) {
      super(`File upload limit is ${maxFileSizeInMb}MB`);
      this.name = 'MaxFileSizeError';
   }
}
