import { PgUserProfileRepository } from "@/infra/repos/postgres";
import { PgUser } from "@/infra/repos/postgres/entities";
import { makeFakeDb } from "@/tests/infra/repos/postgres/mocks";

import { IBackup } from "pg-mem";
import { getRepository, Repository, getConnection } from "typeorm";

describe('PgUserProfileRepository', () => {
   let sut: PgUserProfileRepository;
   let pgUserRepo: Repository<PgUser>;
   let backup: IBackup;

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
      sut = new PgUserProfileRepository();
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
   });
});
