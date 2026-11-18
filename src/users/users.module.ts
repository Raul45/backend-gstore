import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PasswordService } from '../common/encrypt/password.service.js';
import { User, UserSchema } from './schemas/users.schema.js';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService, PasswordService],
  exports: [UsersService, PasswordService, MongooseModule],
  controllers: [UsersController],
})
export class UsersModule {}
