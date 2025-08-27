import {Inject, Injectable} from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import {IUserRepository} from "../../domain/user.repository";
import {CreateUserDto} from "../dto/create-user.dto";

@Injectable()
export class CreateUserUseCase {
    constructor(
        @Inject('IUserRepository') private readonly userRepository: IUserRepository,
        @InjectMapper() private readonly mapper: Mapper,
    ) {}

    async execute(input: CreateUserDto): Promise<number> {
        const user = this.mapper.map(input, CreateUserDto, User);
        user.password = input.password;
        return await this.userRepository.create(user);
    }
}
