import { PgUserProfileRepository } from "@/infra/repos/postgres";
import { PgRepository } from "@/infra/repos/postgres";
import { PgConnection } from "@/infra/repos/postgres/helpers";
import { PgUser } from "@/infra/repos/postgres/entities";
import { makeFakeDb } from "@/tests/infra/repos/postgres/mocks";

import { IBackup } from "pg-mem";
import { Repository } from "typeorm";

describe('PgUserProfileRepository', () => {
   let sut: PgUserProfileRepository;
   let connection: PgConnection;
   let pgUserRepo: Repository<PgUser>;
   let backup: IBackup;

   beforeAll(async () => {
      connection = PgConnection.getInstance();
      const db = await makeFakeDb([PgUser]);
      backup = db.backup();

      pgUserRepo = connection.getRepository(PgUser);
   });

   afterAll(async () => {
      await connection.disconnect();
   });

   beforeEach(() => {
      backup.restore();
      sut = new PgUserProfileRepository();
   });

   it('should extend PgRepository', () => {
      expect(sut).toBeInstanceOf(PgRepository)
   });

   describe('savePicture', () => {
      it('should update user profile', async () => {
         const { id } = await pgUserRepo.save({ email: 'any_email', initials: 'any_initials' });

         await sut.savePicture({ id: id.toString(), pictureUrl: 'any_url', initials: undefined });
         const user = await pgUserRepo.findOne({ id });

         expect(user).toMatchObject({
            id,
            pictureUrl: 'any_url',
            initials: null
         });
      });
   });

   describe('loadUser', () => {
      it('should load user profile', async () => {
         const { id } = await pgUserRepo.save({ email: 'any_email', name: 'any_name' });

         const user = await sut.load({ id: id.toString() });
         const name = user?.name;

         expect(name).toBe('any_name');
      });

      it('should load user profile', async () => {
         const { id } = await pgUserRepo.save({ email: 'any_email' });

         const user = await sut.load({ id: id.toString() });
         const name = user?.name;

         expect(name).toBeUndefined();
      });

      it('should return undefined if user is not found', async () => {
         const user = await sut.load({ id: '1' });

         expect(user).toBeUndefined();
      });
   });
});
