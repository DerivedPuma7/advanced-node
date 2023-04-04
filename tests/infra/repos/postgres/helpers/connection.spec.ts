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
   let getConnectionManagerSpy: jest.Mock;
   let createQueryRunnerSpy: jest.Mock;
   let createConnectionSpy: jest.Mock;
   let hasSpy: jest.Mock;
   let sut: PgConnection;

   beforeAll(() => {
      hasSpy = jest.fn().mockReturnValue(true);
      getConnectionManagerSpy = jest.fn().mockReturnValue({
         has: hasSpy
      });
      jest.mocked(getConnectionManager).mockImplementation(getConnectionManagerSpy);
      createQueryRunnerSpy = jest.fn();
      createConnectionSpy = jest.fn().mockResolvedValue({
         createQueryRunner: createQueryRunnerSpy
      });
      jest.mocked(createConnection).mockImplementation(createConnectionSpy);
   });

   beforeEach(() => {
      sut = PgConnection.getInstance();
   });

   it('it should have only one instance', () => {
      const sut2 = PgConnection.getInstance();

      expect(sut).toBe(sut2);
   });

   it('should create a new connetion', async () => {
      hasSpy.mockReturnValue(false);

      await sut.connect();

      expect(createConnectionSpy).toHaveBeenCalledWith();
      expect(createConnectionSpy).toHaveBeenCalledTimes(1);
      expect(createQueryRunnerSpy).toHaveBeenCalledWith();
      expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
   });
});
