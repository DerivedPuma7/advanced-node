import { createConnection, getConnectionManager } from "typeorm";

jest.mock('typeorm', () => ({
   Entity: jest.fn(),
   PrimaryGeneratedColumn: jest.fn(),
   Column: jest.fn(),
   createConnection: jest.fn(),
   getConnectionManager: jest.fn(),
}));

class PgConnection {
   private static instance?: PgConnection;
   private constructor() {}

   static getInstance(): PgConnection {
      if(PgConnection.instance === undefined) {
         PgConnection.instance = new PgConnection();
      }
      return PgConnection.instance;
   }

   async connect(): Promise<void> {
      const connection = await createConnection();
      connection.createQueryRunner();
   }
}

describe('PgConnection', () => {
   it('it should have only one instance', async () => {
      const sut = PgConnection.getInstance();
      const sut2 = PgConnection.getInstance();

      expect(sut).toBe(sut2);
   });

   it('should create a new connetion', async () => {
      const getConnectionManagerSpy = jest.fn().mockReturnValueOnce({
         has: jest.fn().mockReturnValueOnce(false)
      });
      jest.mocked(getConnectionManager).mockImplementationOnce(getConnectionManagerSpy);
      const createQueryRunnerSpy = jest.fn();
      const createConnectionSpy = jest.fn().mockResolvedValueOnce({
         createQueryRunner: createQueryRunnerSpy
      });
      jest.mocked(createConnection).mockImplementationOnce(createConnectionSpy);
      const sut = PgConnection.getInstance();

      await sut.connect();

      expect(createConnectionSpy).toHaveBeenCalledWith();
      expect(createConnectionSpy).toHaveBeenCalledTimes(1);
      expect(createQueryRunnerSpy).toHaveBeenCalledWith();
      expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
   });
});
