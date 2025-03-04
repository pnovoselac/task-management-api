import { Module } from '@nestjs/common';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserRepository } from './user.repository';

@Module({
    imports:[MikroOrmModule.forFeature({entities:[User]})],
    controllers:[UserController],
    providers:[UserService, UserRepository],
    exports:[UserService, UserRepository],
})
export class UserModule {}
