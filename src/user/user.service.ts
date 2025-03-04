import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import {UserRepository} from './user.repository';

@Injectable()
export class UserService { 
constructor(
    @InjectRepository(User) private readonly userRepository: UserRepository,
  ) {}

async findAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
}
}
