import { makeFacebookLoginController } from "@/main/factories/controllers";
import { adaptExpressRoute } from "@/infra/http";

import { Router } from "express";

export default (router: Router): void  => {
   const controller = makeFacebookLoginController();
   router.post('/api/login/facebook', adaptExpressRoute(controller));
}
