import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
} from 'typeorm';

export class CreateTaskTable1726540748093 implements MigrationInterface {
    private readonly schema = process.env.DB_SCHEMA || 'public'; // Substitua 'public' pelo schema desejado

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Criação da tabela "tasks"
        await queryRunner.createTable(
            new Table({
                name: 'tasks',
                schema: this.schema,
                columns: [
                    {
                        name: 'task_id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'task_title',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'task_description',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'task_is_done',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'user_id',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        isNullable: false,
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                ],
            }),
            true, // Se true, cria a tabela se ela ainda não existir
        );

        // Criação da chave estrangeira entre "tasks" e "users"
        await queryRunner.createForeignKey(
            `${this.schema}.tasks`,
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['user_id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove a chave estrangeira primeiro
        const table = await queryRunner.getTable(`${this.schema}.tasks`);
        const foreignKey = table.foreignKeys.find(
            (fk) => fk.columnNames.indexOf('user_id') !== -1,
        );

        if (foreignKey) {
            await queryRunner.dropForeignKey(
                `${this.schema}.tasks`,
                foreignKey,
            );
        }

        // Remove a tabela "tasks"
        await queryRunner.dropTable(`${this.schema}.tasks`);
    }
}
