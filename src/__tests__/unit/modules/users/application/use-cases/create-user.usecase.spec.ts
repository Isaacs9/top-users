import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from '../../../../../../modules/users/application/use-cases/create-user.usecase';
import { IUserRepository } from '../../../../../../modules/users/domain/user.repository';
import { CreateUserDto } from '../../../../../../modules/users/application/dto/create-user.dto';
import { User } from '../../../../../../modules/users/domain/entities/user.entity';
import { getMapperToken } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let mapper: jest.Mocked<Mapper>;

  beforeEach(async () => {
    // Create mocks
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
        CreateUserUseCase,
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

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('deve criar um usuário e retornar o id', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        nome: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        rua: 'Test Street',
        numero: '123',
        bairro: 'Test Neighborhood',
        complemento: 'Apt 456',
        cidade: 'Test City',
        estado: 'TS',
        cep: '12345-678'
      };

      const user = new User({
        nome: createUserDto.nome,
        email: createUserDto.email,
        // Password will be set explicitly
        rua: createUserDto.rua,
        numero: createUserDto.numero,
        bairro: createUserDto.bairro,
        complemento: createUserDto.complemento,
        cidade: createUserDto.cidade,
        estado: createUserDto.estado,
        cep: createUserDto.cep,
      });

      const userId = 1;

      // Mock the mapper to return the user
      mapper.map.mockReturnValue(user);

      // Mock the repository to return the user id
      userRepository.create.mockResolvedValue(userId);

      // Act
      const result = await useCase.execute(createUserDto);

      // Assert
      expect(mapper.map).toHaveBeenCalledWith(createUserDto, CreateUserDto, User);
      expect(user.password).toBe(createUserDto.password);
      expect(userRepository.create).toHaveBeenCalledWith(user);
      expect(result).toBe(userId);
    });

    it('deve lançar um erro se a criação do repositório falhar', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        nome: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        rua: 'Test Street',
        numero: '123',
        bairro: 'Test Neighborhood',
        complemento: 'Apt 456',
        cidade: 'Test City',
        estado: 'TS',
        cep: '12345-678'
      };

      const user = new User({
        nome: createUserDto.nome,
        email: createUserDto.email,
        // Password will be set explicitly
        rua: createUserDto.rua,
        numero: createUserDto.numero,
        bairro: createUserDto.bairro,
        complemento: createUserDto.complemento,
        cidade: createUserDto.cidade,
        estado: createUserDto.estado,
        cep: createUserDto.cep,
      });

      const error = new Error('Database error');

      // Mock the mapper to return the user
      mapper.map.mockReturnValue(user);

      // Mock the repository to throw an error
      userRepository.create.mockRejectedValue(error);

      // Act & Assert
      await expect(useCase.execute(createUserDto)).rejects.toThrow(error);
      expect(mapper.map).toHaveBeenCalledWith(createUserDto, CreateUserDto, User);
      expect(userRepository.create).toHaveBeenCalledWith(user);
    });
  });
});
