import { AccessToken } from "@/domain/models";
import { FacebookAuthentication } from "@/domain/features";
import { badRequest, HttpResponse, ok, serverError, unauthorized } from "@/application/helpers";
import { RequiredFieldError } from "@/application/errors";

type HttpRequest = {
   token: string
}

type Model = Error | {
   accessToken: string
}

export class FacebookLoginController {
   constructor(private readonly facebookAuthentication: FacebookAuthentication){}

   async handle(httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
      try {
         const error = this.validate(httpRequest);
         if(error !== undefined) {
            return badRequest(error);
         }

         const accessToken = await this.facebookAuthentication.perform({ token: httpRequest.token });
         if(accessToken instanceof AccessToken) {
            return ok({ accessToken: accessToken.value });
         }

         return unauthorized();
      } catch (error: any) {
         return serverError(error);
      }
   }

   private validate(httpRequest: HttpRequest): Error | undefined {
      if(httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
         return new RequiredFieldError('token');
      }
      return undefined;
   }
}
