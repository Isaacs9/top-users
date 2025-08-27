import {IUserRepository} from '../../domain/user.repository';
import {User} from '../../domain/entities/user.entity';
import {InjectKnex, Knex} from "nestjs-knex";
import {UserStatusEnum} from "../../domain/enums/user-status.enum";
import {Injectable} from "@nestjs/common";

@Injectable()
export class KnexUserRepository implements IUserRepository {

    constructor(@InjectKnex() private readonly knex: Knex) {
    }

    async findById(id: number) {
        const user = await this.knex<User>('users').where({id}).first();
        if (user) {
            return user;
        }
        return null;
    }

    async findByEmail(email: string) {
        const user = await this.knex<User>('users').where({email}).first();
        if (user) {
            return user;
        }
        return null;
    }

    async list() {
        const rows = await this.knex<User>('users').select('*')
            .where({isDeleted: false})
            .orderBy('id', 'asc');
        return rows.map(r => new User(r));
    }

    async create(u: User) {
        const [user] = await this.knex<User>('users')
        .insert({
            ...u,
            status: UserStatusEnum.ATIVO,
            isDeleted: false,
            createdAt: new Date(),
        })
        .returning(['id']);
        return user.id;
    }

    async update(id: number, patch: Partial<User>) {
        const dbPatch: any = {...patch};
        dbPatch.updatedAt = new Date();
        await this.knex<User>('users').where({id}).update(dbPatch);
    }

    async softDelete(id: number) {
        await this.knex<User>('users').where({id}).update({
            isDeleted: true,
            deletedAt: new Date(),
            status: UserStatusEnum.INATIVO
        });
    }
}
