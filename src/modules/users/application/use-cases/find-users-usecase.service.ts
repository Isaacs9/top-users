import {Inject, Injectable} from '@nestjs/common';
import {User} from '../../domain/entities/user.entity';
import {InjectMapper} from '@automapper/nestjs';
import {Mapper} from '@automapper/core';
import {IUserRepository} from "../../domain/user.repository";
import {UserListDto} from "../dto/user-list.dto";

@Injectable()
export class FindUsersUsecase {
    constructor(@Inject('IUserRepository') private readonly userRepository: IUserRepository, @InjectMapper() private readonly mapper: Mapper,) {
    }

    async execute(): Promise<UserListDto[]> {
        const user = await this.userRepository.list();
        return this.mapper.mapArray(user, User, UserListDto);
    }
}
