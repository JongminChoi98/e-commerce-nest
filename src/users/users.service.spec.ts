import { Test } from '@nestjs/testing';
import { UserService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Address } from './entities/user-address.entity';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  findOneOrFail: jest.fn(),
  createQueryBuilder: jest.fn(),
});

jest.mock('src/utils/hash-password', () => ({
  hashPassword: jest
    .fn()
    .mockImplementation(() => Promise.resolve(`hashedPassword`)),
}));

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let service: UserService;
  let usersRepository: MockRepository<User>;
  let addressesRepository: MockRepository<Address>;

  beforeAll(async () => {
    const modules = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Address),
          useValue: mockRepository(),
        },
      ],
    }).compile();
    service = modules.get<UserService>(UserService);
    usersRepository = modules.get(getRepositoryToken(User));
    addressesRepository = modules.get(getRepositoryToken(Address));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    const signupArgs = {
      email: 'mock@mock.com',
      password: 'password',
      firstName: 'firstName',
      lastName: 'lastName',
      phone: '000-000-0000',
    };

    it('should fail if user exists', async () => {
      usersRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'mock@mock.com',
      });

      const result = await service.signup(signupArgs);

      expect(result).toMatchObject({
        success: false,
        error: 'User already exists',
      });
    });

    it('should create a new user', async () => {
      const mockArgs = {
        email: signupArgs.email,
        password: signupArgs.password,
        firstName: signupArgs.firstName,
        lastName: signupArgs.lastName,
      };
      mockArgs.password = 'hashedPassword';
      usersRepository.findOne.mockResolvedValue(undefined);

      const result = await service.signup(mockArgs);

      expect(usersRepository.create).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ success: true });
    });

    it('should fail on exception', async () => {
      usersRepository.findOne.mockRejectedValue(new Error());
      const result = await service.signup(signupArgs);
      expect(result).toEqual({
        success: false,
        error: "Couldn't create account",
      });
    });
  });

  describe('findById', () => {
    const findByIdArgs = { id: 1 };
    it('should find an existing user', async () => {
      usersRepository.findOneOrFail.mockResolvedValue(findByIdArgs);
      const result = await service.findById(1);
      expect(result).toEqual({ success: true, user: findByIdArgs });
    });

    it('should fail if no user is found', async () => {
      usersRepository.findOneOrFail.mockRejectedValue(new Error());
      const result = await service.findById(1);
      expect(result).toEqual({ success: false, error: "Couldn't find user" });
    });
  });

  describe('findByEmail', () => {
    const findByEmailArgs = { email: 'mock@mock.com' };
    it('should find an existing user', async () => {
      usersRepository.findOneOrFail.mockResolvedValue(findByEmailArgs);
      const result = await service.findByEmail('mock@mock.com');
      expect(result).toEqual({ success: true, user: findByEmailArgs });
    });

    it('should fail if no user is found', async () => {
      usersRepository.findOneOrFail.mockRejectedValue(new Error());
      const result = await service.findByEmail('mock@mock.com');
      expect(result).toEqual({ success: false, error: "Couldn't find user" });
    });
  });

  describe('updateProfile', () => {
    const oldUser = {
      email: 'oldMock@old.com',
      password: 'oldMockPassword',
      lastName: 'oldMockLastName',
      firstName: 'oldMockFirstName',
      phone: '000-000-0000',
    };

    const updateUser = {
      userId: 1,
      input: {
        email: 'newMock@old.com',
        password: 'newMockPassword',
        firstName: 'newMockFirstName',
      },
    };

    updateUser.input.password = 'hashedPassword';
    const newUser = Object.assign(oldUser, updateUser.input);

    it('should change profile', async () => {
      usersRepository.findOneOrFail.mockResolvedValue(oldUser);
      usersRepository.save.mockResolvedValue(newUser);

      const result = await service.updateProfile(
        updateUser.userId,
        updateUser.input,
      );
      expect(usersRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: updateUser.userId },
      });
      expect(result).toEqual({ success: true });
    });

    it('should fail if no user is found', async () => {
      usersRepository.findOneOrFail.mockRejectedValue(new Error());
      const result = await service.updateProfile(
        updateUser.userId,
        updateUser.input,
      );
      expect(result).toEqual({ success: false, error: "Couldn't find user" });
    });
  });

  describe('addAddress', () => {
    const addressArgs = {
      addressLine1: 'Address Line 1',
      addressLine2: 'Address Line 2',
      city: 'City',
      postalCode: 99999,
      country: 'USA',
    };
    it('should fail when use already has address', async () => {
      usersRepository.findOne.mockResolvedValue({
        hasAddress: true,
      });

      const result = await service.addAddress(addressArgs, 1);
      expect(result).toEqual({ success: false, error: 'Address exist.' });
    });

    it('should create an address', async () => {
      usersRepository.findOne.mockResolvedValue({ hasAddress: false });

      const result = await service.addAddress(addressArgs, 1);
      expect(result).toEqual({ success: true });
    });

    it('should fail on exception', async () => {
      usersRepository.findOne.mockRejectedValue(new Error());
      const result = await service.addAddress(addressArgs, 1);
      expect(result).toEqual({
        success: false,
        error: "Couldn't create address",
      });
    });
  });

  describe('readAddress', () => {
    const address = {
      addressLine1: 'Address Line 1',
      addressLine2: 'Address Line 2',
      city: 'City',
      postalCode: 99999,
      country: 'USA',
    };
    it('should read user address', async () => {
      addressesRepository.findOneOrFail.mockResolvedValue(address);
      const result = await service.readAddress(1);
      expect(result).toEqual({ success: true, address });
    });

    it('should fail on exception', async () => {
      addressesRepository.findOneOrFail.mockRejectedValue(new Error());
      const result = await service.readAddress(1);
      expect(result).toEqual({
        success: false,
        error: "Couldn't find address",
      });
    });
  });

  describe('deleteAddress', () => {
    const mockUserId = 1;
    const mockUserWithAddress = { id: mockUserId, hasAddress: true };

    const setupMockQueryBuilder = () => {
      const queryBuilderMock = {
        delete: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockReturnThis(),
      };
      addressesRepository.createQueryBuilder.mockReturnValue(queryBuilderMock);
      return queryBuilderMock;
    };

    it('should fail when user not has address', async () => {
      usersRepository.findOne.mockResolvedValue({ hasAddress: false });
      const result = await service.deleteAddress(1);
      expect(result).toEqual({ success: false, error: 'Address not exist' });
    });

    it('should delete user address information', async () => {
      usersRepository.findOne.mockResolvedValue(mockUserWithAddress);
      const queryBuilderMock = setupMockQueryBuilder();

      const result = await service.deleteAddress(mockUserId);

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUserId },
      });
      expect(queryBuilderMock.delete).toHaveBeenCalled();
      expect(queryBuilderMock.from).toHaveBeenCalledWith(Address);
      expect(queryBuilderMock.where).toHaveBeenCalledWith('userId = :id', {
        id: mockUserId,
      });
      expect(queryBuilderMock.execute).toHaveBeenCalled();
      expect(usersRepository.save).toHaveBeenCalledWith({
        ...mockUserWithAddress,
        hasAddress: false,
      });
      expect(result).toEqual({ success: true });
    });

    it('should fail on exception', async () => {
      usersRepository.findOne.mockRejectedValue(new Error());
      const result = await service.deleteAddress(1);
      expect(result).toEqual({
        success: false,
        error: 'Unknown error has occurred.',
      });
    });
  });

  describe('updateAddress', () => {
    const oldAddress = {
      addressLine1: 'Old address Line 1',
      addressLine2: 'Ole address Line 2',
      city: 'Old city',
      postalCode: 99999,
      country: 'USA',
    };
    const updateAddress = {
      addressLine1: 'New address Line 1',
      addressLine2: 'New address Line 2',
      city: 'New City',
      postalCode: 99999,
      country: 'USA',
    };
    const newAddress = Object.assign(oldAddress, updateAddress);

    it('should update the address information', async () => {
      addressesRepository.findOneOrFail.mockResolvedValue(oldAddress);
      addressesRepository.save.mockResolvedValue(newAddress);

      const result = await service.updateAddress(1, updateAddress);
      expect(result).toEqual({ success: true });
    });

    it('should fail on exception', async () => {
      addressesRepository.findOneOrFail.mockRejectedValue(new Error());
      const result = await service.updateAddress(1, updateAddress);
      expect(result).toEqual({
        success: false,
        error: 'Unknown error has occurred.',
      });
    });
  });
});
