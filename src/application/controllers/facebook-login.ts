import { AccessToken } from "@/domain/entities";
import { HttpResponse, ok, unauthorized } from "@/application/helpers";
import { ValidationBuilder, Validator } from "@/application/validation";
import { Controller } from "@/application/controllers";
import { FacebookAuthentication } from "@/domain/use-cases";

type HttpRequest = { token: string }

type Model = Error | { accessToken: string }

export class FacebookLoginController extends Controller {
   constructor(private readonly facebookAuthentication: FacebookAuthentication) {
      super();
   }

   async perform({ token }: HttpRequest): Promise<HttpResponse<Model>> {
      const accessToken = await this.facebookAuthentication({ token });
      if (accessToken instanceof AccessToken) {
         return ok({ accessToken: accessToken.value });
      }

      return unauthorized();
   }

   override buildValidators({ token }: HttpRequest): Validator[] {
      return ValidationBuilder
         .of({ value: token, fieldName: 'token' })
         .required()
         .build();
   }
}
