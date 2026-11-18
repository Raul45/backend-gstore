import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt/jwt-auth.guard.js';
import { Role } from '../roles/role.enum.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('singup')
  async singUp(@Body() singUp: CreateUserDto) {
    return this.userService.create(singUp);
  }

  @Post('bootstrap-admin')
  async bootstrapAdmin(@Body() singUpAdmin: CreateUserDto) {
    return this.userService.createAdmin(singUpAdmin, true);
  }

  @Post('singup-admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async singUpAdmin(@Body() singUpAdmin: CreateUserDto) {
    return this.userService.createAdmin(singUpAdmin);
  }
}
