import {AutoMap} from "@automapper/classes";

export class UserListDto {
    @AutoMap() id: number;
    @AutoMap() nome: string;
    @AutoMap() email: string;
    password: string;
    @AutoMap() rua: string;
    @AutoMap() numero: string;
    @AutoMap() bairro: string;
    @AutoMap() complemento?: string;
    @AutoMap() cidade: string;
    @AutoMap() estado: string;
    @AutoMap() cep: string;
}
