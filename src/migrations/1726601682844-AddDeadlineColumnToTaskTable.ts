import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddDeadlineColumnToTaskTable1726601682844
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            `${process.env.DB_SCHEMA}.tasks`,
            new TableColumn({
                name: 'task_deadline',
                type: 'timestamp',
                isNullable: true,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(
            `${process.env.DB_SCHEMA}.tasks`,
            'task_deadline',
        );
    }
}
