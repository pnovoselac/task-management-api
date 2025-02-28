import { Entity, PrimaryKey } from "@mikro-orm/core";
import {UserRepository} from './user.repository';

@Entity({repository:() => UserRepository})
export class User{
    @PrimaryKey()
    id!:number;
}