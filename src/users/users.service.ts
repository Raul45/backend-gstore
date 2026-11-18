import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { PasswordService } from '../common/encrypt/password.service.js';
import { Role } from '../roles/role.enum.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { User, UserDocument } from './schemas/users.schema.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly passwordService: PasswordService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<object> {
    const validUniqueness = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (validUniqueness) {
      throw new BadRequestException('Algo salió mal', {
        cause: new Error(),
        description: 'Usuario registrado previamente',
      });
    }

    const hash = await this.passwordService.hash(createUserDto.password);

    const createdUser = new this.userModel({
      name: createUserDto.name,
      firstLastName: createUserDto.firstLastName,
      secondLastName: createUserDto.secondLastName,
      email: createUserDto.email,
      password: hash,
      role: createUserDto.role ?? Role.USER,
      active: true,
    });

    await createdUser.save();

    return { message: 'Usuario registrado con éxito' };
  }

  async createAdmin(
    createUserDto: CreateUserDto,
    bootstrap = false,
  ): Promise<object> {
    const adminExists = await this.userModel.exists({ role: Role.ADMIN });

    if (bootstrap && adminExists) {
      throw new ForbiddenException(
        'Ya existe un administrador; inicia sesión como ADMIN para crear más',
      );
    }

    createUserDto.role = Role.ADMIN;

    return this.create(createUserDto);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findActiveById(id: string): Promise<UserDocument | null> {
    if (!isValidObjectId(id)) {
      return null;
    }

    return this.userModel.findOne({ _id: id, active: true }).exec();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }
}
