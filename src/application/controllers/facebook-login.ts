import { AccessToken } from "@/domain/models";
import { FacebookAuthentication } from "@/domain/features";
import { HttpResponse, ok, unauthorized } from "@/application/helpers";
import { ValidationBuilder, Validator } from "@/application/validation";
import { Controller } from "@/application/controllers";

type HttpRequest = {
   token: string
}

type Model = Error | {
   accessToken: string
}

export class FacebookLoginController extends Controller {
   constructor(private readonly facebookAuthentication: FacebookAuthentication) {
      super();
   }

   async perform(httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
      const accessToken = await this.facebookAuthentication.perform({ token: httpRequest.token });
      if(accessToken instanceof AccessToken) {
         return ok({ accessToken: accessToken.value });
      }

      return unauthorized();
   }

   override buildValidators(httpRequest: HttpRequest): Validator[] {
      return ValidationBuilder
         .of({ value: httpRequest.token, fieldName: 'token'})
         .required()
         .build();
   }
}
