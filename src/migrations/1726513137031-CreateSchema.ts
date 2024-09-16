import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSchema1726513137031 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createSchema(process.env.DB_SCHEMA, true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropSchema(process.env.DB_SCHEMA, true);
    }
}
