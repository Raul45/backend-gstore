import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PasswordService } from '../common/encrypt/password.service.js';
import { User, UserDocument } from '../users/schemas/users.schema.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userModel.findOne({ email }).lean().exec();

    if (!user) {
      throw new BadRequestException('Algo salió mal', {
        cause: new Error(),
        description: 'Usuario no registrado',
      });
    }

    if (!user.active) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    const verify = await this.passwordService.verify(user.password, password);
    if (!verify) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
