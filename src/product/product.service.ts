import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FileFolder } from '../common/constants/constants.js';
import { FileService } from '../files/files.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { Product, ProductDocument } from './schemas/product.schema.js';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly fileService: FileService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[],
  ) {
    const validateUniqueness = await this.productModel.findOne({
      name: createProductDto.name,
      grams: createProductDto.inventary.grams,
      brand: createProductDto.brand,
    });

    if (validateUniqueness) {
      throw new BadRequestException('Algo salió mal', {
        cause: new Error(),
        description: 'Producto registrado previamente',
      });
    }

    const createdProduct = new this.productModel(createProductDto);

    await createdProduct.save();

    if (files?.length) {
      const imageUrls = await this.fileService.uploadMany(
        files,
        FileFolder.PRODUCTS,
        createdProduct._id.toString(),
      );

      createdProduct.images = imageUrls.map((url, index) => ({
        url,
        alt: createdProduct.name,
        order: index,
      }));

      await createdProduct.save();
    }

    return {
      message: 'Producto registrado con éxito',
      productId: createdProduct._id,
      images: createdProduct.images,
    };
  }

  findAll() {
    return this.productModel.find({});
  }

  findOne(id: Types.ObjectId) {
    return this.productModel.findById(id);
  }

  async update(
    id: Types.ObjectId,
    updateProductDto: UpdateProductDto,
    files?: Express.Multer.File[],
  ): Promise<ProductDocument> {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    const { imagesToDelete, stock, ...productData } = updateProductDto;

    // 1. Actualizar datos del producto
    Object.assign(product, productData);

    if (stock !== undefined) {
      product.inventary.stock = stock;
      product.inventary.disponible = stock > 0;
    }

    if (imagesToDelete?.length) {
      await this.fileService.deleteMany(imagesToDelete);

      product.images = product.images.filter(
        (image) => !imagesToDelete.includes(image.url),
      );
    }

    // 3. Agregar nuevas imágenes
    if (files?.length) {
      const imageUrls = await this.fileService.uploadMany(
        files,
        FileFolder.PRODUCTS,
        id.toString(),
      );

      const newImages = imageUrls.map((url, index) => ({
        url,
        alt: product.name,
        order: product.images.length + index,
      }));

      product.images.push(...newImages);
    }

    // 4. Recalcular order
    product.images.forEach((image, index) => {
      image.order = index;
    });

    return product.save();
  }

  async remove(id: Types.ObjectId) {
    const deletedProduct = await this.productModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      throw new NotFoundException('Producto no encontrado');
    }

    if (deletedProduct.images?.length) {
      await this.fileService.deleteMany(
        deletedProduct.images.map((image) => image.url),
      );
    }

    return { message: 'Producto eliminado correctamente' };
  }
}
