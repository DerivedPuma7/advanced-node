import { UserProfile } from "@/domain/entities";

describe('UserProfile', () => {
   let sut: UserProfile;

   beforeEach(() => {
      sut = new UserProfile('any_id');
   });

   it('should create with empty initials when pictureUrl is provided', () => {
      sut.setPicture({ pictureUrl: 'any_url' });

      expect(sut).toEqual({
         id: 'any_id',
         pictureUrl: 'any_url',
         initials: undefined
      });
   });

   it('should create with empty initials when pictureUrl and name are provided', () => {
      sut.setPicture({ pictureUrl: 'any_url', name: 'any_name' });

      expect(sut).toEqual({
         id: 'any_id',
         pictureUrl: 'any_url',
         initials: undefined
      });
   });

   it('should create initials with first letter of first and last names', () => {
      sut.setPicture({ name: 'Gustavo Ribeiro de Figueiredo' });

      expect(sut).toEqual({
         id: 'any_id',
         pictureUrl: undefined,
         initials: 'GF'
      });
   });

   it('should create initials with first two letterS of first name', () => {
      sut.setPicture({ name: 'gustavo' });

      expect(sut).toEqual({
         id: 'any_id',
         pictureUrl: undefined,
         initials: 'GU'
      });
   });

   it('should create initials with first letter of first name', () => {
      sut.setPicture({ name: 'g' });

      expect(sut).toEqual({
         id: 'any_id',
         pictureUrl: undefined,
         initials: 'G'
      });
   });

   it('should create with empty initials when name and pictureUrl are not provided', () => {
      sut.setPicture({ });

      expect(sut).toEqual({
         id: 'any_id',
         pictureUrl: undefined,
         initials: undefined
      });
   });

   it('should create with empty initials when name and pictureUrl are not provided', () => {
      sut.setPicture({ name: '' });

      expect(sut).toEqual({
         id: 'any_id',
         pictureUrl: undefined,
         initials: undefined
      });
   });
});
