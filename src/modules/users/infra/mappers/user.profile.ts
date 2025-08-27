import {createMap, Mapper} from '@automapper/core';
import {AutomapperProfile, InjectMapper} from '@automapper/nestjs';
import {Injectable} from '@nestjs/common';
import {User} from '../../domain/entities/user.entity';
import {CreateUserDto} from "../../application/dto/create-user.dto";
import {UserListDto} from "../../application/dto/user-list.dto";
import {UpdateUserDto} from "../../application/dto/update-user.dto";

@Injectable()
export class UserProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper: Mapper) => {

            createMap(mapper, CreateUserDto, User);
            createMap(mapper, UpdateUserDto, User);
            createMap(mapper, User, UserListDto);
        };
    }
}
