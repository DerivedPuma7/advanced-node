import { makeFacebookLoginController } from "@/main/factories/controllers";
import { adaptExpressRoute } from "@/main/adapters";

import { Router } from "express";

export default (router: Router): void  => {
   const controller = makeFacebookLoginController();
   router.post('/login/facebook', adaptExpressRoute(controller));
}
