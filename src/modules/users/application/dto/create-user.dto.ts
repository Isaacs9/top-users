import {IsEmail, IsNotEmpty, MinLength} from "class-validator";
import {AutoMap} from "@automapper/classes";

export class CreateUserDto {

    @AutoMap() @IsNotEmpty() nome: string;
    @AutoMap() @IsEmail() email: string;
    @AutoMap() @MinLength(6) password: string;
    @AutoMap() rua: string;
    @AutoMap() numero: string;
    @AutoMap() bairro: string;
    @AutoMap() complemento?: string;
    @AutoMap() cidade: string;
    @AutoMap() estado: string;
    @AutoMap() cep: string;
}
