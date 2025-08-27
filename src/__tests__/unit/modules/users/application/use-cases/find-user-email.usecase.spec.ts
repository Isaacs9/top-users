import { Test, TestingModule } from '@nestjs/testing';
import { FindUserEmailUseCase } from '../../../../../../modules/users/application/use-cases/find-user-email.usecase';
import { IUserRepository } from '../../../../../../modules/users/domain/user.repository';
import { User } from '../../../../../../modules/users/domain/entities/user.entity';
import { UserListDto } from '../../../../../../modules/users/application/dto/user-list.dto';
import { getMapperToken } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { UserStatusEnum } from '../../../../../../modules/users/domain/enums/user-status.enum';

describe('FindUserEmailUseCase', () => {
  let useCase: FindUserEmailUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let mapper: jest.Mocked<Mapper>;

  beforeEach(async () => {
    userRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      list: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    } as jest.Mocked<IUserRepository>;

    mapper = {
      map: jest.fn(),
    } as unknown as jest.Mocked<Mapper>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUserEmailUseCase,
        {
          provide: 'IUserRepository',
          useValue: userRepository,
        },
        {
          provide: getMapperToken(),
          useValue: mapper,
        },
      ],
    }).compile();

    useCase = module.get<FindUserEmailUseCase>(FindUserEmailUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should find a user by email and return UserListDto', async () => {
      const email = 'test@example.com';
      const user = new User({
        id: 1,
        nome: 'Test User',
        email: email,
        password: 'hashed_password',
        rua: 'Test Street',
        numero: '123',
        bairro: 'Test Neighborhood',
        complemento: 'Apt 456',
        cidade: 'Test City',
        estado: 'TS',
        cep: '12345-678',
        status: UserStatusEnum.ATIVO,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const userListDto = new UserListDto();
      Object.assign(userListDto, {
        id: user.id,
        nome: user.nome,
        email: user.email,
        rua: user.rua,
        numero: user.numero,
        bairro: user.bairro,
        complemento: user.complemento,
        cidade: user.cidade,
        estado: user.estado,
        cep: user.cep,
      });

      userRepository.findByEmail.mockResolvedValue(user);

      mapper.map.mockReturnValue(userListDto);

      const result = await useCase.execute(email);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(mapper.map).toHaveBeenCalledWith(user, User, UserListDto);
      expect(result).toBeDefined();
      expect(result.id).toBe(user.id);
      expect(result.nome).toBe(user.nome);
      expect(result.email).toBe(user.email);
      expect(result.password).toBe(user.password);
    });

    it('should return null if user is not found', async () => {
      const email = 'nonexistent@example.com';

      userRepository.findByEmail.mockResolvedValue(null);

      const result = await useCase.execute(email);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(mapper.map).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should throw an error if repository findByEmail fails', async () => {
      const email = 'test@example.com';
      const error = new Error('Database error');

      userRepository.findByEmail.mockRejectedValue(error);

      await expect(useCase.execute(email)).rejects.toThrow(error);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(mapper.map).not.toHaveBeenCalled();
    });
  });
});
