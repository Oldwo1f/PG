"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddApiKeyColumns1752000000000 = void 0;
class AddApiKeyColumns1752000000000 {
    constructor() {
        this.name = 'AddApiKeyColumns1752000000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "apiKey" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "isApiOnly" boolean DEFAULT false`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "isApiOnly"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "apiKey"`);
    }
}
exports.AddApiKeyColumns1752000000000 = AddApiKeyColumns1752000000000;
//# sourceMappingURL=1752000000000-AddApiKeyColumns.js.map