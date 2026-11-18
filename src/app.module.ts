import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { FileModule } from './files/files.module.js';
import { ProductModule } from './product/product.module.js';
import { UsersModule } from './users/users.module.js';
import { CategoryModule } from './category/category.module.js';
import { BrandModule } from './brand/brand.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: '/var/www/html/images',
      serveRoot: '/images',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>(
          'DB_URL',
          'mongodb://localhost:27017/gstore',
        ),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    FileModule,
    ProductModule,
    CategoryModule,
    BrandModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
