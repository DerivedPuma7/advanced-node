import { badRequest, HttpResponse, serverError } from "@/application/helpers";
import { ValidationComposite, Validator } from "@/application/validation";

export abstract class Controller {
   abstract perform(httpRequest: any): Promise<HttpResponse>;

   async handle(httpRequest: any): Promise<HttpResponse> {
      try {
         const error = this.validate(httpRequest);
         if(error !== undefined) {
            return badRequest(error);
         }
         return await this.perform(httpRequest);
      } catch (error: any) {
         return serverError(error);
      }
   }

   private validate(httpRequest: any): Error | undefined {
      const validators = this.buildValidators(httpRequest);
      return new ValidationComposite([...validators]).validate();
   }

   buildValidators(httpRequest: any): Validator[] {
      return [];
   }
}
