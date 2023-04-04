import { Connection, QueryRunner, createConnection, getConnection, getConnectionManager } from "typeorm";

jest.mock('typeorm', () => ({
   Entity: jest.fn(),
   PrimaryGeneratedColumn: jest.fn(),
   Column: jest.fn(),
   createConnection: jest.fn(),
   getConnection: jest.fn(),
   getConnectionManager: jest.fn(),
}));

class ConnectionNotFoundError extends Error {
   constructor() {
      super('No connection was found');
      this.name = 'ConnectionNotFoundError';
   }
}

class PgConnection {
   private static instance?: PgConnection;
   private query?: QueryRunner;

   private constructor() {}

   static getInstance(): PgConnection {
      if(PgConnection.instance === undefined) {
         PgConnection.instance = new PgConnection();
      }
      return PgConnection.instance;
   }

   async connect(): Promise<void> {
      const connection: Connection = getConnectionManager().has('default')
         ? getConnection()
         : await createConnection();

      this.query = connection.createQueryRunner();
   }

   async disconnect(): Promise<void> {
      if(this.query === undefined) throw new ConnectionNotFoundError();
      await getConnection().close();
      this.query = undefined;
   }
}

describe('PgConnection', () => {
   let getConnectionManagerSpy: jest.Mock;
   let createQueryRunnerSpy: jest.Mock;
   let createConnectionSpy: jest.Mock;
   let getConnectionSpy: jest.Mock;
   let hasSpy: jest.Mock;
   let closeSpy: jest.Mock;
   let sut: PgConnection;

   beforeAll(() => {
      hasSpy = jest.fn().mockReturnValue(true);
      getConnectionManagerSpy = jest.fn().mockReturnValue({
         has: hasSpy
      });
      jest.mocked(getConnectionManager).mockImplementation(getConnectionManagerSpy);
      createQueryRunnerSpy = jest.fn().mockReturnValue({});
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
});
