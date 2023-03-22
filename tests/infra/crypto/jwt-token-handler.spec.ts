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
         await sut.generateToken({ key, expirationInMs });

         expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 1 });
         expect(fakeJwt.sign).toHaveBeenCalledTimes(1);
      });

      it('should return a token', async () => {
         const generatedToken = await sut.generateToken({ key, expirationInMs });

         expect(generatedToken).toBe(token);
      });

      it('should rethrow if sign throws', async () => {
         fakeJwt.sign.mockImplementationOnce(() => { throw new Error('token_error'); });

         const promise = sut.generateToken({ key, expirationInMs });

         expect(promise).rejects.toThrow(new Error('token_error'));
      });
   });

   describe('ValidateToken', () => {
      let token: string;

      beforeAll(() => {
         token = 'any_token';
      });

      it('should call verify with correct params', async () => {
         await sut.validateToken({ token });

         expect(fakeJwt.verify).toHaveBeenCalledWith(token, secret);
         expect(fakeJwt.verify).toHaveBeenCalledTimes(1);
      });
   });
});
