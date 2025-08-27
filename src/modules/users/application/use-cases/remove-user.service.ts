import {Inject, Injectable} from '@nestjs/common';
import {User} from '../../domain/entities/user.entity';
import {InjectMapper} from '@automapper/nestjs';
import {Mapper} from '@automapper/core';
import {IUserRepository} from "../../domain/user.repository";
import {CreateUserDto} from "../dto/create-user.dto";
import {UpdateUserDto} from "../dto/update-user.dto";

@Injectable()
export class RemoveUserService {
    constructor(@Inject('IUserRepository') private readonly userRepository: IUserRepository,
                @InjectMapper() private readonly mapper: Mapper,) {
    }

    async execute(id: number): Promise<void> {
        await this.userRepository.softDelete(id);
    }
}
