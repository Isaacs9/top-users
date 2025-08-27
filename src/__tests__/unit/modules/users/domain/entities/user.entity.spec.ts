import { User } from '../../../../../../modules/users/domain/entities/user.entity';
import { UserStatusEnum } from '../../../../../../modules/users/domain/enums/user-status.enum';

describe('User Entity', () => {
  it('Criar usuário com todas as propriedades', () => {
    const now = new Date();
    const userData = {
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
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    };

    const user = new User(userData);

    expect(user).toBeDefined();
    expect(user.id).toBe(1);
    expect(user.nome).toBe('Test User');
    expect(user.email).toBe('test@example.com');
    expect(user.password).toBe('password123');
    expect(user.rua).toBe('Test Street');
    expect(user.numero).toBe('123');
    expect(user.bairro).toBe('Test Neighborhood');
    expect(user.complemento).toBe('Apt 456');
    expect(user.cidade).toBe('Test City');
    expect(user.estado).toBe('TS');
    expect(user.cep).toBe('12345-678');
    expect(user.status).toBe(UserStatusEnum.ATIVO);
    expect(user.isDeleted).toBe(false);
    expect(user.createdAt).toBe(now);
    expect(user.updatedAt).toBe(now);
    expect(user.deletedAt).toBeNull();
  });

  it('Criar usuário com dados parciais', () => {
    const userData = {
      nome: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const user = new User(userData);

    expect(user).toBeDefined();
    expect(user.nome).toBe('Test User');
    expect(user.email).toBe('test@example.com');
    expect(user.password).toBe('password123');
    expect(user.isDeleted).toBe(false); // Default value
  });

  it('Validar construtor vazio', () => {
    const user = new User({});

    expect(user).toBeDefined();
    expect(user.isDeleted).toBe(false); // Default value
  });

  it('Verificar status do Usuário', () => {
    const activeUser = new User({ status: UserStatusEnum.ATIVO });
    const inactiveUser = new User({ status: UserStatusEnum.INATIVO });

    expect(activeUser.status).toBe(UserStatusEnum.ATIVO);
    expect(activeUser.status).toBe('ativo');

    expect(inactiveUser.status).toBe(UserStatusEnum.INATIVO);
    expect(inactiveUser.status).toBe('inativo');
  });
});
