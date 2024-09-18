import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './entities/task.entity';
import { CreateTaskDTO } from './dtos/create-task.dto';
import { UpdateTaskDTO } from './dtos/update-task.dto';
import { PhotoEntity } from './entities/photo.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreatePhotoDTO } from './dtos/create-photo.dto';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(TaskEntity)
        private readonly taskRepository: Repository<TaskEntity>,
        @InjectRepository(PhotoEntity)
        private readonly photoRepository: Repository<PhotoEntity>,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    // Create a new task related to a user by user id
    async create(userId: number, task: CreateTaskDTO) {
        const newTask = this.taskRepository.create({
            ...task,
            userId, // connect user to a task
        });

        return this.taskRepository.save(newTask); // save new task in database
    }

    async createTaskWithPhoto(
        userId: number,
        task: CreateTaskDTO,
        file: Express.Multer.File,
    ): Promise<TaskEntity> {
        return await this.taskRepository.manager.transaction(
            async (manager) => {
                // create a new task
                const newTask = manager.create(TaskEntity, {
                    ...task,
                    userId,
                });
                await manager.save(newTask);

                // uploaded a photo in cloudinary
                const photoUploaded = await this.cloudinaryService.uploadFile(
                    file,
                    `todolist-app/${userId}/${newTask.id}`,
                );

                // create a new photo
                const photo = manager.create(PhotoEntity, {
                    url: photoUploaded.url,
                    taskId: newTask.id,
                });

                await manager.save(photo);

                return {
                    ...newTask,
                    photos: [photo],
                };
            },
        );
    }

    async createPhoto(taskId: number, photo: CreatePhotoDTO) {
        const newPhoto = this.photoRepository.create({
            ...photo,
            taskId,
        });

        return this.photoRepository.save(newPhoto);
    }

    // Atualização de uma task existente, verificando se pertence ao usuário
    async update(
        taskId: number,
        userId: number,
        task: UpdateTaskDTO,
    ): Promise<TaskEntity> {
        const taskToUpdate = await this.taskRepository.findOne({
            where: { id: taskId, userId },
        });

        if (!taskToUpdate) {
            throw new NotFoundException('Task not found');
        }

        Object.assign(taskToUpdate, task);
        return this.taskRepository.save(taskToUpdate);
    }

    // Deleção de uma task, verificando se pertence ao usuário
    async delete(taskId: number, userId: number): Promise<void> {
        const taskToDelete = await this.taskRepository.findOne({
            where: { id: taskId, userId },
        });

        if (!taskToDelete) {
            throw new NotFoundException('Task not found');
        }

        await this.taskRepository.delete(taskId);
    }

    // Recupera todas as tasks associadas ao userId
    async getAll(userId: number): Promise<TaskEntity[]> {
        return this.taskRepository.find({ where: { userId } });
    }

    // Recupera uma task específica pelo ID e userId
    async getById(taskId: number, userId: number): Promise<TaskEntity> {
        const task = await this.taskRepository.findOne({
            where: { id: taskId, userId },
        });

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        return task;
    }
}
