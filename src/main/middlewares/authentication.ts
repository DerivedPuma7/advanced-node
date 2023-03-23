import { adaptExpressMiddleware } from "../adapters";
import { makeAuthenticationMiddleware } from "../factories/middlewares";

export const auth = adaptExpressMiddleware(makeAuthenticationMiddleware());
