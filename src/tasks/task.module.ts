import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { TaskController } from './task.controller';
import { PhotoEntity } from './entities/photo.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([TaskEntity, PhotoEntity]),
        CloudinaryModule,
    ],
    controllers: [TaskController],
    providers: [TaskService],
})
export class TaskModule {}
