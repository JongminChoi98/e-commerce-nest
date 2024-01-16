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

  it.todo('addAddress');
  it.todo('readAddress');
  it.todo('deleteAddress');
  it.todo('updateAddress');
});
