import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
} from 'typeorm';

export class CreatePhotoTable1726602546135 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Criação da tabela 'photos'
        await queryRunner.createTable(
            new Table({
                name: 'photos',
                schema: process.env.DB_SCHEMA,
                columns: [
                    {
                        name: 'photo_id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'photo_url',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'task_id',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        isNullable: false,
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                ],
            }),
            true,
        );

        // Adicionando chave estrangeira para 'task_id'
        await queryRunner.createForeignKey(
            `${process.env.DB_SCHEMA}.photos`,
            new TableForeignKey({
                columnNames: ['task_id'],
                referencedColumnNames: ['task_id'],
                referencedTableName: 'tasks',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remover a chave estrangeira da tabela 'photos'
        const table = await queryRunner.getTable(
            `${process.env.DB_SCHEMA}.photos`,
        );
        const foreignKey = table.foreignKeys.find(
            (fk) => fk.columnNames.indexOf('task_id') !== -1,
        );
        if (foreignKey) {
            await queryRunner.dropForeignKey(
                `${process.env.DB_SCHEMA}.photos`,
                foreignKey,
            );
        }

        // Remover a tabela 'photos'
        await queryRunner.dropTable(`${process.env.DB_SCHEMA}.photos`);
    }
}
