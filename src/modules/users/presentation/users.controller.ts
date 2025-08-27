import {Controller} from '@nestjs/common';
import {MessagePattern} from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import {CreateUserUseCase} from "../application/use-cases/create-user.usecase";
import {FindUsersUsecase} from "../application/use-cases/find-users-usecase.service";
import {FindUserEmailUseCase} from "../application/use-cases/find-user-email.usecase";
import {RemoveUserService} from "../application/use-cases/remove-user.service";
import {UpdateUserUseCase} from "../application/use-cases/update-user.service";

@Controller()
export class UsersController {

    constructor(
        private readonly createUser: CreateUserUseCase,
        private readonly findsUser: FindUsersUsecase,
        private readonly findUserEmail: FindUserEmailUseCase,
        private readonly updateUser: UpdateUserUseCase,
        private readonly removeUser: RemoveUserService,

    ) {
    }

    @MessagePattern({cmd: 'users.list'}) async list() {
        return await this.findsUser.execute();
    }

    @MessagePattern({cmd: 'users.create'}) async create(data: any) {
        const password = await bcrypt.hash(data.password, 10);
        return await this.createUser.execute({...data, password});
    }

    @MessagePattern({cmd: 'users.findByEmail'}) async findByEmail(data: { email: string }) {
        return await this.findUserEmail.execute(data.email);
    }

    @MessagePattern({cmd: 'users.update'}) async update(data: { id: number; patch: any }) {
        await this.updateUser.execute(data.id, data.patch);
        return {success: true};
    }

    @MessagePattern({cmd: 'users.remove'}) async remove(data: { id: number }) {
        await this.removeUser.execute(data.id);
        return {success: true};
    }
}
