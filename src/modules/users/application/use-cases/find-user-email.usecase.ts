import {Inject, Injectable} from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import {IUserRepository} from "../../domain/user.repository";
import {UserListDto} from "../dto/user-list.dto";

@Injectable()
export class FindUserEmailUseCase {
    constructor(
        @Inject('IUserRepository') private readonly userRepository: IUserRepository,
        @InjectMapper() private readonly mapper: Mapper,
    ) {}

    async execute(email: string): Promise<UserListDto> {
        const user = await this.userRepository.findByEmail(email);
        if (user) {
            const userMapping = this.mapper.map(user, User, UserListDto);
            userMapping.password = user.password;
            return userMapping;
        }
        return null;
    }
}
