import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskEntity } from './task.entity';

@Entity({ name: 'photos' })
export class PhotoEntity {
    @PrimaryGeneratedColumn('increment', { name: 'photo_id' })
    id: number;

    @Column({ name: 'photo_url', type: 'varchar' })
    url: string;

    @Column({ name: 'task_id', type: 'int', nullable: false })
    taskId: number;

    @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
    updatedAt?: Date;

    @Column({
        name: 'created_at',
        type: 'timestamp',
        nullable: false,
        default: () => 'CURRENT_TIMESTAMP',
    })
    createAt: Date;

    @ManyToOne(() => TaskEntity, (task) => task.photos, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'task_id' })
    task: TaskEntity;
}
