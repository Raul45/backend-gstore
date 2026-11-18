import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BrandDocument = HydratedDocument<Brand>;
@Schema({_id: false})
export class Brand {
    @Prop({required: true, trim: true})
    name: string;

    @Prop({required: true, trim: true})
    description?: string;

    @Prop({required: true, trim: true})
    country?: string;
}

export const BrandCategory = SchemaFactory.createForClass(Brand);