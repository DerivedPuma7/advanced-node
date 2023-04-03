import { makeSavePictureController } from "@/main/factories/application/controllers";
import { adaptExpressRoute, adaptMulter as upload } from "@/main/adapters";
import { auth } from "@/main/middlewares";

import { Router } from "express";

export default (router: Router): void  => {
   const controller = makeSavePictureController();
   router.delete('/users/picture', auth, adaptExpressRoute(controller));
   router.put('/users/picture', auth, upload, adaptExpressRoute(controller));
}
