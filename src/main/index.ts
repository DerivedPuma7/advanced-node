import "./config/module-alias";
import { PgConnection } from "@/infra/repos/postgres/helpers";
import { env } from "@/main/config/env";

import "reflect-metadata";
// import { createConnection } from "typeorm";

PgConnection.getInstance().connect()
   .then(async () => {
      const { app } = await import('@/main/config/app');
      app.listen(env.port, () => console.log(`Server running at http://localhost/${env.port}`));
   })
   .catch((error) => {
      console.error(error)
   });
