import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLog1743871471903 implements MigrationInterface {
    name = 'CreateLog1743871471903'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "varient_value" DROP CONSTRAINT "FK_0aaf15f24606ca542c2b6a4a5b5"`);
        await queryRunner.query(`ALTER TABLE "varient_value" DROP CONSTRAINT "FK_ab2ab5f5b8eacede125b0b157eb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ab2ab5f5b8eacede125b0b157e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0aaf15f24606ca542c2b6a4a5b"`);
        await queryRunner.query(`CREATE TABLE "log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "message" character varying NOT NULL, "hasRead" boolean NOT NULL DEFAULT false, "receiverId" uuid NOT NULL, "href" character varying NOT NULL, CONSTRAINT "PK_350604cbdf991d5930d9e618fbd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ab2ab5f5b8eacede125b0b157e" ON "varient_value" ("varientId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0aaf15f24606ca542c2b6a4a5b" ON "varient_value" ("valueAttrId") `);
        await queryRunner.query(`ALTER TABLE "log" ADD CONSTRAINT "FK_fa17831f18540d7be6a55f9f1cf" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "varient_value" ADD CONSTRAINT "FK_ab2ab5f5b8eacede125b0b157eb" FOREIGN KEY ("varientId") REFERENCES "varient"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "varient_value" ADD CONSTRAINT "FK_0aaf15f24606ca542c2b6a4a5b5" FOREIGN KEY ("valueAttrId") REFERENCES "value_attr"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "varient_value" DROP CONSTRAINT "FK_0aaf15f24606ca542c2b6a4a5b5"`);
        await queryRunner.query(`ALTER TABLE "varient_value" DROP CONSTRAINT "FK_ab2ab5f5b8eacede125b0b157eb"`);
        await queryRunner.query(`ALTER TABLE "log" DROP CONSTRAINT "FK_fa17831f18540d7be6a55f9f1cf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0aaf15f24606ca542c2b6a4a5b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ab2ab5f5b8eacede125b0b157e"`);
        await queryRunner.query(`DROP TABLE "log"`);
        await queryRunner.query(`CREATE INDEX "IDX_0aaf15f24606ca542c2b6a4a5b" ON "varient_value" ("valueAttrId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ab2ab5f5b8eacede125b0b157e" ON "varient_value" ("varientId") `);
        await queryRunner.query(`ALTER TABLE "varient_value" ADD CONSTRAINT "FK_ab2ab5f5b8eacede125b0b157eb" FOREIGN KEY ("varientId") REFERENCES "varient"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "varient_value" ADD CONSTRAINT "FK_0aaf15f24606ca542c2b6a4a5b5" FOREIGN KEY ("valueAttrId") REFERENCES "value_attr"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
