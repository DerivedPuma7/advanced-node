import { Middleware } from "@/application/middlewares";

import { RequestHandler } from "express";

type Adapter = (middleware: Middleware) => RequestHandler;

export const adaptExpressMiddleware: Adapter = middleware => {
   return async (req, res, next) => {
      const { statusCode, data } = await middleware.handle({ ...req.headers });
      if(statusCode === 200) {
         const validEntries = Object.entries(data).filter(entry => {
            return entry[1] !== null && entry[1] !== '' && entry[1] !== undefined
         });
         req.locals = { ...req.locals, ...Object.fromEntries(validEntries) };
         next();
      }
      else {
         res.status(statusCode).json({ error: data.message });
      }
   }
}
