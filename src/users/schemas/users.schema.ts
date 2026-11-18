import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../../roles/role.enum.js';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  firstLastName!: string;

  @Prop({ required: true })
  secondLastName!: string;

  @Prop({ unique: true, required: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({})
  active: boolean = false;

  @Prop({
    type: String,
    enum: Role,
    default: Role.USER,
  })
  role!: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
