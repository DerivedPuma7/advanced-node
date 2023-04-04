import { PgConnection } from "@/infra/repos/postgres/helpers";

import { ObjectLiteral, ObjectType, Repository } from "typeorm";

export abstract class PgRepository {
   constructor(private readonly connection: PgConnection = PgConnection.getInstance()) {}

   getRepository<Entity extends ObjectLiteral>(entity: ObjectType<Entity>): Repository<Entity> {
      return this.connection.getRepository(entity);
   }
}
