import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity({ name: 'tasks' })
export class TaskEntity {
    @PrimaryGeneratedColumn('increment', { name: 'task_id' })
    id: number;

    @Column({ name: 'task_title', nullable: false })
    title: string;

    @Column({ name: 'task_description', nullable: false })
    description: string;

    @Column({ name: 'task_is_done', default: false })
    isDone: boolean;

    @Column({ name: 'user_id', nullable: false })
    userId: number;

    @Column({
        name: 'created_at',
        type: 'timestamp',
        nullable: false,
        default: () => 'CURRENT_TIMESTAMP',
    })
    createAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
    updatedAt?: Date;

    @ManyToOne(() => UserEntity, (user) => user.tasks, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;
}
