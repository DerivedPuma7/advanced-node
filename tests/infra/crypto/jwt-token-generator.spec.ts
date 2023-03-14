import { TokenGenerator } from '@/data/contracts/crypto';

import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

class JwtTokenGenerator {
   constructor(private readonly secret: string) {}

   async generateToken(params: TokenGenerator.Params): Promise<TokenGenerator.Result> {
      const expirationInSeconds = params.expirationInMs / 1000;
      return jwt.sign({ key: params.key }, this.secret, { expiresIn: expirationInSeconds });
   }
}

describe('JwtTokenGenerator', () => {
   let sut: JwtTokenGenerator;
   let fakeJwt: jest.Mocked<typeof jwt>;

   beforeAll(() => {
      fakeJwt = jwt as jest.Mocked<typeof jwt>;
      fakeJwt.sign.mockImplementation(() => { return 'any_token' });
   });

   beforeEach(() => {
      sut = new JwtTokenGenerator('any_secret');
   });

   it('should call sign with correct params', async () => {
      await sut.generateToken({ key: 'any_key', expirationInMs: 1000 });

      expect(fakeJwt.sign).toHaveBeenCalledWith({ key: 'any_key' }, 'any_secret', { expiresIn: 1 });
   });

   it('should return a token', async () => {
      const token = await sut.generateToken({ key: 'any_key', expirationInMs: 1000 });

      expect(token).toBe('any_token');
   });

   it('should rethrow if sign throws', async () => {
      fakeJwt.sign.mockImplementationOnce(() => { throw new Error('token_error'); });

      const promise = sut.generateToken({ key: 'any_key', expirationInMs: 1000 });

      expect(promise).rejects.toThrow(new Error('token_error'));
   });
});
