import { AccessToken } from "@/domain/models";
import { FacebookAuthentication } from "@/domain/features";
import { badRequest, HttpResponse } from "@/application/helpers";
import { RequiredFieldError, ServerError } from "@/application/errors";

export class FacebookLoginController {
   constructor(private readonly facebookAuthentication: FacebookAuthentication){}
   async handle(httpRequest: any): Promise<HttpResponse> {
      try {
         if(httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
            return badRequest(new RequiredFieldError('token'));
         }

         const result = await this.facebookAuthentication.perform({ token: httpRequest.token });
         if(result instanceof AccessToken) {
            return {
               statusCode: 200,
               data: {
                  accessToken: result.value
               }
            }
         }

         return {
            statusCode: 401,
            data: result
         };
      } catch (error: any) {
         return {
            statusCode: 500,
            data: new ServerError(error)
         };
      }
   }
}
