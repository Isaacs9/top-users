import {Inject, Injectable} from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import {IUserRepository} from "../../domain/user.repository";
import {CreateUserDto} from "../dto/create-user.dto";
import {UpdateUserDto} from "../dto/update-user.dto";

@Injectable()
export class UpdateUserUseCase {
    constructor(
        @Inject('IUserRepository') private readonly userRepository: IUserRepository,
        @InjectMapper() private readonly mapper: Mapper,
    ) {}

    async execute(id: number, patch: UpdateUserDto): Promise<void> {
        const user = this.mapper.map(patch, UpdateUserDto, User);
        await this.userRepository.update(id, user);
    }
}
