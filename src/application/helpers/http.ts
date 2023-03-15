import { UnauthorizedError } from "@/application/errors";

export type HttpResponse = {
   statusCode: number,
   data: any
};

export const badRequest = (error: Error): HttpResponse => {
   return {
      statusCode: 400,
      data: error
   };
}

export const unauthorized = (): HttpResponse => {
   return {
      statusCode: 401,
      data: new UnauthorizedError()
   };
}
