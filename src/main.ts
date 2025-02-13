import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Back End API')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: `Please enter your JWT(token)`,
        name: 'JWT',
        bearerFormat: 'JWT',
        scheme: 'bearer',
        type: 'http',
        in: 'header',
      },
      'JWT',
    )
    .build();
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      withCredentials: true,
    },
  };
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, customOptions);

  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3000);
}
bootstrap();
