import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // config swagger
    const config = new DocumentBuilder()
        .setTitle('Todo List')
        .setDescription('The todo list API')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    // enable cors
    app.enableCors({
        origin: 'http://localhost:3000', // input here the origin
        methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
        credentials: true,
    });

    // setup validation for dtos
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(Number(process.env.BACKEND_PORT) || 3000);
}
bootstrap();
