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

    // Atualização de uma tarefa existente com uma foto opcional
    async updateTaskWithPhoto(
        taskId: number,
        userId: number,
        task: UpdateTaskDTO,
        file: Express.Multer.File,
    ): Promise<TaskEntity> {
        const taskToUpdate = await this.taskRepository.findOne({
            where: { id: taskId, userId },
            relations: ['photos'], // Inclua as fotos associadas
        });

        if (!taskToUpdate) {
            throw new NotFoundException('Task not found');
        }

        // Atualizar as propriedades da tarefa
        Object.assign(taskToUpdate, task);
        await this.taskRepository.save(taskToUpdate);

        // Caso um novo arquivo seja enviado, faça o upload e associe à tarefa
        const photoUploaded = await this.cloudinaryService.uploadFile(
            file,
            `todolist-app/${userId}/${taskId}`,
        );

        const photo = await this.createPhoto(taskId, {
            url: photoUploaded.url,
        });

        // Adiciona a nova foto à lista de fotos
        taskToUpdate.photos.push(photo);
        await this.taskRepository.save(taskToUpdate);

        return taskToUpdate;
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
        return this.taskRepository.find({
            where: { userId },
            relations: {
                photos: true,
            },
        });
    }

    // Recupera uma task específica pelo ID e userId
    async getById(taskId: number, userId: number): Promise<TaskEntity> {
        const task = await this.taskRepository.findOne({
            where: { id: taskId, userId },
            relations: {
                photos: true,
            },
        });

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        return task;
    }

    // Deletar uma foto específica pelo ID
    async deletePhoto(
        photoId: number,
        taskId: number,
        userId: number,
    ): Promise<void> {
        const photo = await this.photoRepository.findOne({
            where: {
                id: photoId,
                taskId,
                task: {
                    userId,
                },
            },
        });

        if (!photo) {
            throw new NotFoundException('Photo not found');
        }

        await this.cloudinaryService.deleteFile(photo.url);

        await this.photoRepository.delete(photo);
    }

    // Deletar todas as fotos associadas a uma tarefa
    async deletePhotosByTask(taskId: number, userId: number): Promise<void> {
        const photos = await this.photoRepository.find({
            where: {
                taskId,
                task: {
                    userId,
                },
            },
        });

        if (photos.length === 0) {
            throw new NotFoundException('No photos found for the task');
        }

        for (const photo of photos) {
            await this.cloudinaryService.deleteFile(photo.url);
        }

        await this.photoRepository.delete({
            taskId,
            task: {
                userId,
            },
        });
    }
}
