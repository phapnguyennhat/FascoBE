import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangePrimary1741006607826 implements MigrationInterface {
    name = 'ChangePrimary1741006607826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "varient_value" DROP CONSTRAINT "FK_ab2ab5f5b8eacede125b0b157eb"`);
        await queryRunner.query(`ALTER TABLE "varient_value" DROP CONSTRAINT "FK_0aaf15f24606ca542c2b6a4a5b5"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_3feda63c129805f4cbb907b3f6c"`);
        await queryRunner.query(`ALTER TABLE "product_tag" DROP CONSTRAINT "FK_be7e39b01493cea5fb90b1ef7d3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0aaf15f24606ca542c2b6a4a5b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ab2ab5f5b8eacede125b0b157e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_be7e39b01493cea5fb90b1ef7d"`);
        await queryRunner.query(`ALTER TABLE "product" RENAME COLUMN "categoryName" TO "categoryId"`);
        await queryRunner.query(`ALTER TABLE "product_tag" RENAME COLUMN "tagName" TO "tagId"`);
        await queryRunner.query(`ALTER TABLE "product_tag" RENAME CONSTRAINT "PK_903d9cb134149656fe391188a05" TO "PK_d6fdd837e6bce433d7dc43bc444"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "PK_23c05c292c439d77b0de816b500"`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "PK_52ed46113ccd539004fd1b016ea" PRIMARY KEY ("name", "id")`);
        await queryRunner.query(`ALTER TABLE "tag" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "PK_6a9775008add570dc3e5a0bab7b"`);
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "PK_88f7f2e3d14df543d66d12bf116" PRIMARY KEY ("name", "id")`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "PK_52ed46113ccd539004fd1b016ea"`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "PK_88f7f2e3d14df543d66d12bf116"`);
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "categoryId" uuid`);
        await queryRunner.query(`ALTER TABLE "product_tag" DROP CONSTRAINT "PK_d6fdd837e6bce433d7dc43bc444"`);
        await queryRunner.query(`ALTER TABLE "product_tag" ADD CONSTRAINT "PK_fd22d97428d2b0c25be95fb3567" PRIMARY KEY ("productId")`);
        await queryRunner.query(`ALTER TABLE "product_tag" DROP COLUMN "tagId"`);
        await queryRunner.query(`ALTER TABLE "product_tag" ADD "tagId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_tag" DROP CONSTRAINT "PK_fd22d97428d2b0c25be95fb3567"`);
        await queryRunner.query(`ALTER TABLE "product_tag" ADD CONSTRAINT "PK_d6fdd837e6bce433d7dc43bc444" PRIMARY KEY ("productId", "tagId")`);
        await queryRunner.query(`CREATE INDEX "IDX_9f8fcad8ca5a6000b79bf3c747" ON "product_tag" ("tagId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ab2ab5f5b8eacede125b0b157e" ON "varient_value" ("varientId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0aaf15f24606ca542c2b6a4a5b" ON "varient_value" ("valueAttrId") `);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_tag" ADD CONSTRAINT "FK_9f8fcad8ca5a6000b79bf3c7475" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "varient_value" ADD CONSTRAINT "FK_ab2ab5f5b8eacede125b0b157eb" FOREIGN KEY ("varientId") REFERENCES "varient"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "varient_value" ADD CONSTRAINT "FK_0aaf15f24606ca542c2b6a4a5b5" FOREIGN KEY ("valueAttrId") REFERENCES "value_attr"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "varient_value" DROP CONSTRAINT "FK_0aaf15f24606ca542c2b6a4a5b5"`);
        await queryRunner.query(`ALTER TABLE "varient_value" DROP CONSTRAINT "FK_ab2ab5f5b8eacede125b0b157eb"`);
        await queryRunner.query(`ALTER TABLE "product_tag" DROP CONSTRAINT "FK_9f8fcad8ca5a6000b79bf3c7475"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_ff0c0301a95e517153df97f6812"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0aaf15f24606ca542c2b6a4a5b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ab2ab5f5b8eacede125b0b157e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9f8fcad8ca5a6000b79bf3c747"`);
        await queryRunner.query(`ALTER TABLE "product_tag" DROP CONSTRAINT "PK_d6fdd837e6bce433d7dc43bc444"`);
        await queryRunner.query(`ALTER TABLE "product_tag" ADD CONSTRAINT "PK_fd22d97428d2b0c25be95fb3567" PRIMARY KEY ("productId")`);
        await queryRunner.query(`ALTER TABLE "product_tag" DROP COLUMN "tagId"`);
        await queryRunner.query(`ALTER TABLE "product_tag" ADD "tagId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_tag" DROP CONSTRAINT "PK_fd22d97428d2b0c25be95fb3567"`);
        await queryRunner.query(`ALTER TABLE "product_tag" ADD CONSTRAINT "PK_d6fdd837e6bce433d7dc43bc444" PRIMARY KEY ("productId", "tagId")`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "categoryId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "PK_8e4052373c579afc1471f526760"`);
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "PK_88f7f2e3d14df543d66d12bf116" PRIMARY KEY ("name", "id")`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03"`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "PK_52ed46113ccd539004fd1b016ea" PRIMARY KEY ("name", "id")`);
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "PK_88f7f2e3d14df543d66d12bf116"`);
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "PK_6a9775008add570dc3e5a0bab7b" PRIMARY KEY ("name")`);
        await queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "PK_52ed46113ccd539004fd1b016ea"`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "PK_23c05c292c439d77b0de816b500" PRIMARY KEY ("name")`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "product_tag" RENAME CONSTRAINT "PK_d6fdd837e6bce433d7dc43bc444" TO "PK_903d9cb134149656fe391188a05"`);
        await queryRunner.query(`ALTER TABLE "product_tag" RENAME COLUMN "tagId" TO "tagName"`);
        await queryRunner.query(`ALTER TABLE "product" RENAME COLUMN "categoryId" TO "categoryName"`);
        await queryRunner.query(`CREATE INDEX "IDX_be7e39b01493cea5fb90b1ef7d" ON "product_tag" ("tagName") `);
        await queryRunner.query(`CREATE INDEX "IDX_ab2ab5f5b8eacede125b0b157e" ON "varient_value" ("varientId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0aaf15f24606ca542c2b6a4a5b" ON "varient_value" ("valueAttrId") `);
        await queryRunner.query(`ALTER TABLE "product_tag" ADD CONSTRAINT "FK_be7e39b01493cea5fb90b1ef7d3" FOREIGN KEY ("tagName") REFERENCES "tag"("name") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_3feda63c129805f4cbb907b3f6c" FOREIGN KEY ("categoryName") REFERENCES "category"("name") ON DELETE NO ACTION ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "varient_value" ADD CONSTRAINT "FK_0aaf15f24606ca542c2b6a4a5b5" FOREIGN KEY ("valueAttrId") REFERENCES "value_attr"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "varient_value" ADD CONSTRAINT "FK_ab2ab5f5b8eacede125b0b157eb" FOREIGN KEY ("varientId") REFERENCES "varient"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
