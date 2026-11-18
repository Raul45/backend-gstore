import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ _id: false })
class Origen {
  @Prop({ required: true, trim: true })
  pais!: string;

  @Prop({ required: true, trim: true })
  estado!: string;
}

@Schema({ _id: false })
class Inventario {
  @Prop({ type: Number, required: true, min: 0 })
  stock!: number;

  @Prop({ type: Number, required: true })
  grams!: number;

  @Prop({ type: Boolean, default: true })
  disponible!: boolean;
}

@Schema({ _id: false })
class Metricas {
  @Prop({ type: Number, default: 0, min: 0, max: 5 })
  calification?: number;

  @Prop({ type: Number, default: 0 })
  reviews?: number;
}

@Schema({
  timestamps: true,
  collection: 'products',
})
export class Product {
  @Prop({
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true,
  })
  sku!: string;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, trim: true })
  description!: string;

  @Prop({ required: true, trim: true })
  brand!: string;

  @Prop({ type: Number, required: true, min: 0 })
  price!: number;

  @Prop({ required: true, default: 'USD', uppercase: true })
  currency!: string;

  @Prop({ required: true, trim: true })
  category!: string;

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop({ type: Origen, required: true })
  origin!: Origen;

  @Prop({ type: Inventario, required: true })
  inventary!: Inventario;

  @Prop({ type: Metricas, default: () => ({}) })
  metrics?: Metricas;

  @Prop({
    type: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
    default: [],
  })
  images!: {
    url: string;
    alt?: string;
    order: number;
  }[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
