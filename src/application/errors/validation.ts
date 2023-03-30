export class RequiredFieldError extends Error {
   constructor(fieldName?: string) {
      const message = fieldName === undefined
         ? 'Field Required'
         : `The field ${fieldName} is required`;
      super(message);
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
