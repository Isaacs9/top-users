import {IsEmail, IsNotEmpty} from "class-validator";
import {AutoMap} from "@automapper/classes";

export class UpdateUserDto {

    @AutoMap() @IsNotEmpty() nome: string;
    @AutoMap() @IsEmail() email: string;
    @AutoMap() rua: string;
    @AutoMap() numero: string;
    @AutoMap() bairro: string;
    @AutoMap() complemento?: string;
    @AutoMap() cidade: string;
    @AutoMap() estado: string;
    @AutoMap() cep: string;
}
