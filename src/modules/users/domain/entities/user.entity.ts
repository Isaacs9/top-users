import { AutoMap } from '@automapper/classes';
import { UserStatusEnum } from "../enums/user-status.enum";

export class User {
  @AutoMap()
  public id: number;

  @AutoMap()
  public nome: string;

  @AutoMap()
  public email: string;

  public password: string;

  @AutoMap()
  public rua: string;

  @AutoMap()
  public numero: string;

  @AutoMap()
  public bairro: string;

  @AutoMap()
  public complemento: string;

  @AutoMap()
  public cidade: string;

  @AutoMap()
  public estado: string;

  @AutoMap()
  public cep: string;

  @AutoMap(() => String)
  public status: UserStatusEnum;

  @AutoMap()
  public isDeleted: boolean = false;

  @AutoMap(() => Date)
  public createdAt?: Date;

  @AutoMap(() => Date)
  public updatedAt?: Date;

  @AutoMap(() => Date)
  public deletedAt?: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
