import { InvalidMimeTypeError } from "@/application/errors";

type Extension = 'png' | 'jpg';

export class AllowedMimeTypes {
   constructor(
      private readonly allowed: Extension[],
      private readonly mimeType: string
   ) {}

   validate(): Error | undefined {
      let isValid = false;
      if(this.isValidPng()) isValid = true;
      else if(this.isValidJpg()) isValid = true;
      if(!isValid) return new InvalidMimeTypeError(this.allowed);
   }

   private isValidPng(): boolean {
      return this.allowed.includes('png') && this.mimeType === 'image/png';
   }

   private isValidJpg(): boolean {
      if(this.allowed.includes('jpg') && this.mimeType === 'image/jpg') return true;
      if(this.allowed.includes('jpg') && this.mimeType === 'image/jpeg') return true;
      return false;
   }
}
