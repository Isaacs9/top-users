import {Module} from '@nestjs/common';
import {UsersController} from './presentation/users.controller';
import {CreateUserUseCase} from "./application/use-cases/create-user.usecase";
import {UserProfile} from "./infra/mappers/user.profile";
import {AutomapperModule} from "@automapper/nestjs";
import {KnexUserRepository} from "./infra/repositories/users.repository";
import {FindUsersUsecase} from "./application/use-cases/find-users-usecase.service";
import {UpdateUserUseCase} from "./application/use-cases/update-user.service";
import {RemoveUserService} from "./application/use-cases/remove-user.service";
import {FindUserEmailUseCase} from "./application/use-cases/find-user-email.usecase";

@Module({
    controllers: [UsersController],
    imports: [AutomapperModule],
    exports: [],
    providers: [CreateUserUseCase, FindUserEmailUseCase, FindUsersUsecase, UpdateUserUseCase, RemoveUserService, UserProfile, {
        provide: 'IUserRepository', useClass: KnexUserRepository,
    }]
})
export class UsersModule {
}
