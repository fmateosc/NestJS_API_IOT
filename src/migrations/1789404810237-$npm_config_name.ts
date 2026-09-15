import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1789404810237 implements MigrationInterface {
    name = ' $npmConfigName1789404810237'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devices" ADD "bridgeRuleEnabled" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devices" DROP COLUMN "bridgeRuleEnabled"`);
    }

}
