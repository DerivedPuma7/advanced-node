import { createConnection, getConnection, getConnectionManager } from "typeorm";
import { PgConnection, ConnectionNotFoundError } from "@/infra/repos/postgres/helpers"

jest.mock('typeorm', () => ({
   Entity: jest.fn(),
   PrimaryGeneratedColumn: jest.fn(),
   Column: jest.fn(),
   createConnection: jest.fn(),
   getConnection: jest.fn(),
   getConnectionManager: jest.fn(),
}));

describe('PgConnection', () => {
   let getConnectionManagerSpy: jest.Mock;
   let createQueryRunnerSpy: jest.Mock;
   let createConnectionSpy: jest.Mock;
   let getConnectionSpy: jest.Mock;
   let hasSpy: jest.Mock;
   let closeSpy: jest.Mock;
   let startTransactionSpy: jest.Mock;
   let sut: PgConnection;

   beforeAll(() => {
      hasSpy = jest.fn().mockReturnValue(true);
      getConnectionManagerSpy = jest.fn().mockReturnValue({
         has: hasSpy
      });
      jest.mocked(getConnectionManager).mockImplementation(getConnectionManagerSpy);
      startTransactionSpy = jest.fn();
      createQueryRunnerSpy = jest.fn().mockReturnValue({
         startTransaction: startTransactionSpy
      });
      createConnectionSpy = jest.fn().mockResolvedValue({
         createQueryRunner: createQueryRunnerSpy
      });
      jest.mocked(createConnection).mockImplementation(createConnectionSpy);
      closeSpy = jest.fn();
      getConnectionSpy = jest.fn().mockReturnValue({
         createQueryRunner: createQueryRunnerSpy,
         close: closeSpy
      });
      jest.mocked(getConnection).mockImplementation(getConnectionSpy);
   });

   beforeEach(() => {
      sut = PgConnection.getInstance();
   });

   it('it should have only one instance', () => {
      const sut2 = PgConnection.getInstance();

      expect(sut).toBe(sut2);
   });

   describe('Create connection', () => {
      it('should create a new connetion', async () => {
         hasSpy.mockReturnValueOnce(false);

         await sut.connect();

         expect(createConnectionSpy).toHaveBeenCalledWith();
         expect(createConnectionSpy).toHaveBeenCalledTimes(1);
         expect(createQueryRunnerSpy).toHaveBeenCalledWith();
         expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
      });

      it('should use an existing connetion', async () => {
         await sut.connect();

         expect(createConnectionSpy).not.toHaveBeenCalledWith();
         expect(getConnectionSpy).toHaveBeenCalledWith();
         expect(getConnectionSpy).toHaveBeenCalledTimes(1);
         expect(createQueryRunnerSpy).toHaveBeenCalledWith();
         expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
      });
   });

   describe('Close connection', () => {
      it('should close connection', async () => {
         await sut.connect();
         await sut.disconnect();

         expect(closeSpy).toHaveBeenCalledWith();
         expect(closeSpy).toHaveBeenCalledTimes(1);
      });

      it('should return ConnectionNotFoundError on disconnect if connection is not stablished', async () => {
         const promise = sut.disconnect();

         expect(closeSpy).not.toHaveBeenCalledWith();
         await expect(promise).rejects.toThrow(new ConnectionNotFoundError());
      });
   });

   describe('Transaction', () => {
      it('should open transaction', async () => {
         await sut.connect();
         await sut.openTransaction();

         expect(startTransactionSpy).toHaveBeenCalledWith();
         expect(startTransactionSpy).toHaveBeenCalledTimes(1);

         await sut.disconnect();
      });

      it('should return ConnectionNotFoundError on openTransaction if connection is not stablished', async () => {
         const promise = sut.openTransaction();

         expect(startTransactionSpy).not.toHaveBeenCalledWith();
         await expect(promise).rejects.toThrow(new ConnectionNotFoundError());
      });
   });
});
