export type HttpResponse = {
   statusCode: number,
   data: any
};

export const badRequest = (error: Error): HttpResponse => {
   return {
      statusCode: 400,
      data: error
   }
}
