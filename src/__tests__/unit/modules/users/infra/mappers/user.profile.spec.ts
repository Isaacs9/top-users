import { Test, TestingModule } from '@nestjs/testing';
import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { UserProfile } from '../../../../../../modules/users/infra/mappers/user.profile';
import { CreateUserDto } from '../../../../../../modules/users/application/dto/create-user.dto';
import { UpdateUserDto } from '../../../../../../modules/users/application/dto/update-user.dto';
import { User } from '../../../../../../modules/users/domain/entities/user.entity';
import { UserListDto } from '../../../../../../modules/users/application/dto/user-list.dto';
import { getMapperToken } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { UserStatusEnum } from '../../../../../../modules/users/domain/enums/user-status.enum';

describe('UserProfile', () => {
  let module: TestingModule;
  let mapper: Mapper;
  let userProfile: UserProfile;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
      providers: [UserProfile],
    }).compile();

    mapper = module.get(getMapperToken());
    userProfile = module.get<UserProfile>(UserProfile);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(userProfile).toBeDefined();
    expect(mapper).toBeDefined();
  });

  describe('CreateUserDto -> User Mapeamento', () => {
    it('Mapeamento CreateUserDto to User', () => {
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

      const user = mapper.map(createUserDto, CreateUserDto, User);

      expect(user).toBeDefined();
      expect(user.nome).toBe(createUserDto.nome);
      expect(user.email).toBe(createUserDto.email);
      expect(user.password).toBe(createUserDto.password);
      expect(user.rua).toBe(createUserDto.rua);
      expect(user.numero).toBe(createUserDto.numero);
      expect(user.bairro).toBe(createUserDto.bairro);
      expect(user.complemento).toBe(createUserDto.complemento);
      expect(user.cidade).toBe(createUserDto.cidade);
      expect(user.estado).toBe(createUserDto.estado);
      expect(user.cep).toBe(createUserDto.cep);
    });
  });

  describe('UpdateUserDto -> User Mapeamento', () => {
    it('Mapeamento UpdateUserDto to User', () => {
      const updateUserDto: UpdateUserDto = {
        nome: 'Updated User',
        email: 'updated@example.com',
        rua: 'Updated Street',
        numero: '456',
        bairro: 'Updated Neighborhood',
        complemento: 'Suite 789',
        cidade: 'Updated City',
        estado: 'US',
        cep: '98765-432'
      };

      const user = mapper.map(updateUserDto, UpdateUserDto, User);

      expect(user).toBeDefined();
      expect(user.nome).toBe(updateUserDto.nome);
      expect(user.email).toBe(updateUserDto.email);
      expect(user.rua).toBe(updateUserDto.rua);
      expect(user.numero).toBe(updateUserDto.numero);
      expect(user.bairro).toBe(updateUserDto.bairro);
      expect(user.complemento).toBe(updateUserDto.complemento);
      expect(user.cidade).toBe(updateUserDto.cidade);
      expect(user.estado).toBe(updateUserDto.estado);
      expect(user.cep).toBe(updateUserDto.cep);
    });
  });

  describe('User -> UserListDto Mapeamento', () => {
    it('Mapeamento User to UserListDto', () => {
      const user = new User({
        id: 1,
        nome: 'Test User',
        email: 'test@example.com',
        password: 'password123',
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

      const userListDto = mapper.map(user, User, UserListDto);

      expect(userListDto).toBeDefined();
      expect(userListDto.id).toBe(user.id);
      expect(userListDto.nome).toBe(user.nome);
      expect(userListDto.email).toBe(user.email);
      expect(userListDto.password).toBe(user.password);
      expect(userListDto.rua).toBe(user.rua);
      expect(userListDto.numero).toBe(user.numero);
      expect(userListDto.bairro).toBe(user.bairro);
      expect(userListDto.complemento).toBe(user.complemento);
      expect(userListDto.cidade).toBe(user.cidade);
      expect(userListDto.estado).toBe(user.estado);
      expect(userListDto.cep).toBe(user.cep);
    });
  });
});
