import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TaskEntity } from '../../tasks/entities/task.entity';

@Entity({ name: 'users' })
export class UserEntity {
    @PrimaryGeneratedColumn('increment', { name: 'user_id' })
    id: number;

    @Column({ name: 'user_first_name', nullable: false })
    firstName: string;

    @Column({ name: 'user_last_name', nullable: false })
    lastName: string;

    @Column({ name: 'user_birthday', nullable: false })
    birthday: string;

    @Column({ name: 'user_email', unique: true, type: 'varchar' })
    email: string;

    @Column({ name: 'user_password', type: 'varchar', nullable: false })
    password: string;

    @Column({
        name: 'created_at',
        type: 'timestamp',
        nullable: false,
        default: () => 'CURRENT_TIMESTAMP',
    })
    createAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
    updatedAt?: Date;
    @OneToMany(() => TaskEntity, (task) => task.user)
    tasks: TaskEntity[];
}
