import { ForbiddenError, ServerError, UnauthorizedError } from "@/application/errors";

export type HttpResponse<T = any> = {
   statusCode: number,
   data: T
};

export const ok = <T = any> (data: T): HttpResponse<T> => {
   return {
      statusCode: 200,
      data
   };
}

export const badRequest = (error: Error): HttpResponse<Error> => {
   return {
      statusCode: 400,
      data: error
   };
}

export const unauthorized = (): HttpResponse<Error> => {
   return {
      statusCode: 401,
      data: new UnauthorizedError()
   };
}

export const forbidden = (): HttpResponse<Error> => {
   return {
      statusCode: 403,
      data: new ForbiddenError()
   };
}

export const serverError = (error: Error): HttpResponse<Error> => {
   return {
      statusCode: 500,
      data: new ServerError(error)
   };
}
