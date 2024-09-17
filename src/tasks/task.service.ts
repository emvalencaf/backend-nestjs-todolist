import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './entities/task.entity';
import { CreateTaskDTO } from './dtos/create-task.dto';
import { UpdateTaskDTO } from './dtos/update-task.dto';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(TaskEntity)
        private readonly taskRepository: Repository<TaskEntity>,
    ) {}

    // Criação de uma nova task com userId para fazer a relação ManyToOne
    async create(userId: number, task: CreateTaskDTO) {
        const newTask = this.taskRepository.create({
            ...task,
            userId, // Associa a task ao userId
        });
        return this.taskRepository.save(newTask); // Salva a nova task no banco de dados
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
