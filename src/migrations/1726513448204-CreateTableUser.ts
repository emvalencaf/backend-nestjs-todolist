import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableUser1726513448204 implements MigrationInterface {
    private readonly schema = process.env.DB_SCHEMA || 'public'; // Substitua 'public' pelo schema desejado

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Criar a tabela 'users'
        await queryRunner.createTable(
            new Table({
                name: 'users',
                schema: this.schema,
                columns: [
                    {
                        name: 'user_id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'user_first_name',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'user_last_name',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'user_birthday',
                        type: 'date',
                        isNullable: false,
                    },
                    {
                        name: 'user_email',
                        type: 'varchar',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'user_password',
                        type: 'varchar',
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
                        onUpdate: 'now()',
                    },
                ],
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remover a tabela 'users'
        await queryRunner.dropTable(
            new Table({ name: 'users', schema: this.schema }),
            true,
        );
    }
}
