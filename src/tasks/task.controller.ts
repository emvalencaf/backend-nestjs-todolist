import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseInterceptors,
    UploadedFile,
    Optional,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDTO } from './dtos/create-task.dto';
import { UpdateTaskDTO } from './dtos/update-task.dto';
import { UserId } from '../decorators/user_id.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('tasks')
export class TaskController {
    constructor(private readonly taskService: TaskService) {}
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async create(
        @UserId('userId') userId: number,
        @Body() task: CreateTaskDTO,
        @UploadedFile() @Optional() file?: Express.Multer.File,
    ) {
        return file
            ? this.taskService.createTaskWithPhoto(userId, task, file)
            : this.taskService.create(userId, task);
    }

    @Patch('/:taskId')
    async update(
        @Body() task: UpdateTaskDTO,
        @Param('taskId') taskId: number,
        @UserId('userId') userId: number,
        @UploadedFile() @Optional() file?: Express.Multer.File,
    ) {
        return file
            ? this.taskService.updateTaskWithPhoto(taskId, userId, task, file)
            : this.taskService.update(taskId, userId, task);
    }
    @Delete('/:taskId')
    async delete(
        @Param('taskId') taskId: number,
        @UserId('userId') userId: number,
    ) {
        return this.taskService.delete(taskId, userId);
    }

    @Delete('/:taskId/photos')
    async deleteAllPhotos(
        @Param('taskId') taskId: number,
        @UserId('userId') userId: number,
    ) {
        return this.taskService.deletePhotosByTask(taskId, userId);
    }

    @Delete('/:taskId/photos/:photoId')
    async deletePhoto(
        @Param('taskId') taskId: number,
        @UserId('userId') userId: number,
        @Param('photoId') photoId: number,
    ) {
        return this.taskService.deletePhoto(photoId, taskId, userId);
    }

    @Get()
    async getAll(@UserId('userId') userId: number) {
        return this.taskService.getAll(userId);
    }

    @Get('/:taskId')
    async getById(
        @Param('taskId') taskId: number,
        @UserId('userId') userId: number,
    ) {
        return this.taskService.getById(taskId, userId);
    }
}
