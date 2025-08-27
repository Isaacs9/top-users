import {User} from './entities/user.entity';

export interface IUserRepository {
    findById(id: number): Promise<User | null>;

    findByEmail(email: string): Promise<User | null>;

    list(): Promise<User[]>;

    create(u: User): Promise<number>;

    update(id: number, partial: Partial<User>): Promise<void>;

    softDelete(id: number): Promise<void>;
}
