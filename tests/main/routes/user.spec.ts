import { app } from '@/main/config/app';
import { PgUser } from '@/infra/repos/postgres/entities';
import { env } from '@/main/config/env';
import { makeFakeDb } from "@/tests/infra/repos/postgres/mocks";

import { IBackup } from 'pg-mem';
import { Repository, getConnection, getRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import request from 'supertest';

describe('User Routes', () => {
   describe('[DELETE] /users/picture', () => {
      let backup: IBackup;
      let pgUserRepo: Repository<PgUser>;

      beforeAll(async () => {
         const db = await makeFakeDb([PgUser]);
         backup = db.backup();
         pgUserRepo = getRepository(PgUser);
      });

      afterAll(async () => {
         await getConnection().close();
      });

      beforeEach(() => {
         backup.restore();
      });

      it('should return 403 if no Authorization header is present', async () => {
         const { status } = await request(app)
            .delete('/api/users/picture');

         expect(status).toBe(403);
      });

      it('should return 204', async () => {
         const { id } = await pgUserRepo.save({ email: 'any_email' });
         const authorization = sign({ key: id }, env.jwtSecret);

         const { status, body } = await request(app)
            .delete('/api/users/picture')
            .set({ authorization});

         expect(status).toBe(204);
         expect(body).toEqual({});
      });
   });
});
