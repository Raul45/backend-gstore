import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModule } from '../files/files.module.js';
import { ProductController } from './product.controller.js';
import { ProductService } from './product.service.js';
import { Product, ProductSchema } from './schemas/product.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
    FileModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
