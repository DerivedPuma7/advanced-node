import { JwtTokenHandler } from '@/infra/crypto';

import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('JwtTokenHandler', () => {
   let sut: JwtTokenHandler;
   let fakeJwt: jest.Mocked<typeof jwt>;
   let secret: string;

   beforeAll(() => {
      secret = 'any_secret';
      fakeJwt = jwt as jest.Mocked<typeof jwt>;
   });

   beforeEach(() => {
      sut = new JwtTokenHandler(secret);
   });

   describe('GenerateToken', () => {
      let key: string;
      let token: string;
      let expirationInMs: number;

      beforeAll(() => {
         key = 'any_key';
         token = 'any_token';
         expirationInMs = 1000;
         fakeJwt.sign.mockImplementation(() => { return token });
      });

      it('should call sign with correct params', async () => {
         await sut.generate({ key, expirationInMs });

         expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 1 });
         expect(fakeJwt.sign).toHaveBeenCalledTimes(1);
      });

      it('should return a token', async () => {
         const generatedToken = await sut.generate({ key, expirationInMs });

         expect(generatedToken).toBe(token);
      });

      it('should rethrow if sign throws', async () => {
         fakeJwt.sign.mockImplementationOnce(() => { throw new Error('token_error'); });

         const promise = sut.generate({ key, expirationInMs });

         expect(promise).rejects.toThrow(new Error('token_error'));
      });
   });

   describe('ValidateToken', () => {
      let token: string;
      let key: string;

      beforeAll(() => {
         token = 'any_token';
         key = 'any_key';

         fakeJwt.verify.mockImplementation(() => {
            return { key: 'any_key' }
         });
      });

      it('should call verify with correct params', async () => {
         await sut.validate({ token });

         expect(fakeJwt.verify).toHaveBeenCalledWith(token, secret);
         expect(fakeJwt.verify).toHaveBeenCalledTimes(1);
      });

      it('should return the key used to sign', async () => {
         const generatedKey = await sut.validate({ token });

         expect(generatedKey).toBe(key);
      });

      it('should rethrow if verify throws', async () => {
         fakeJwt.verify.mockImplementationOnce(() => { throw new Error('key_error'); });

         const promise = sut.validate({ token });

         expect(promise).rejects.toThrow(new Error('key_error'));
      });

      it('should throw if verify returns null', async () => {
         fakeJwt.verify.mockImplementationOnce(() => null);

         const promise = sut.validate({ token });

         expect(promise).rejects.toThrow();
      });
   });
});
