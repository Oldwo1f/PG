import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1000000000000 implements MigrationInterface {
  name = 'InitialSchema1000000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Créer les types ENUM
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "user_role_enum" AS ENUM('user', 'admin');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "user_status_enum" AS ENUM('active', 'inactive', 'suspended', 'pending_verification');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "subscription_status_enum" AS ENUM('active', 'cancelled', 'past_due', 'incomplete');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Table: plans
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "plans" (
        "id" varchar(20) NOT NULL,
        "name" character varying NOT NULL,
        "priceMonthly" integer NOT NULL,
        "imageLimitMonthly" integer NOT NULL,
        "storageLimitBytes" bigint NOT NULL,
        "templateLimit" integer NOT NULL,
        "brandLimit" integer NOT NULL,
        "teamMemberLimit" integer NOT NULL,
        "integrationsIncluded" boolean NOT NULL DEFAULT true,
        CONSTRAINT "PK_plans" PRIMARY KEY ("id")
      )
    `);

    // Table: users
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "firstName" character varying,
        "lastName" character varying,
        "company" character varying,
        "phone" character varying,
        "acceptNewsletter" boolean NOT NULL DEFAULT false,
        "role" "user_role_enum" NOT NULL DEFAULT 'user',
        "status" "user_status_enum" NOT NULL DEFAULT 'pending_verification',
        "emailVerificationToken" character varying,
        "emailVerifiedAt" timestamp,
        "passwordResetToken" character varying,
        "passwordResetExpires" timestamp,
        "lastLoginAt" timestamp,
        "subscriptionEndsAt" timestamp,
        "imagesGeneratedThisMonth" integer NOT NULL DEFAULT 0,
        "monthlyUsageResetAt" timestamp,
        "apiKey" character varying,
        "isApiOnly" boolean NOT NULL DEFAULT false,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // Table: brands
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "brand" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "primaryColor" character varying NOT NULL,
        "secondaryColor" character varying NOT NULL,
        "tertiaryColor" character varying NOT NULL,
        "titleFont" character varying NOT NULL,
        "textFont" character varying NOT NULL,
        "tertiaryFont" character varying NOT NULL,
        "logoUrl" character varying NOT NULL,
        "backgrounds" jsonb NOT NULL DEFAULT '[]',
        "icons" jsonb NOT NULL DEFAULT '[]',
        "imageGroups" jsonb NOT NULL DEFAULT '[]',
        "textColor" character varying NOT NULL DEFAULT '#000000',
        "textColor2" character varying NOT NULL DEFAULT '#000000',
        "userId" uuid,
        CONSTRAINT "PK_brand" PRIMARY KEY ("id")
      )
    `);

    // Table: templates
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "templates" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "description" character varying,
        "category" character varying,
        "layout" jsonb NOT NULL,
        "tags" text[] NOT NULL DEFAULT '{}',
        "isActive" boolean NOT NULL DEFAULT true,
        "html" text NOT NULL,
        "variables" json,
        "brandVariables" json,
        "previewImage" character varying,
        "userId" uuid,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "PK_templates" PRIMARY KEY ("id")
      )
    `);

    // Table: images
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "images" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "filename" character varying NOT NULL,
        "originalName" character varying NOT NULL,
        "size" bigint NOT NULL,
        "url" character varying NOT NULL,
        "userId" uuid,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "PK_images" PRIMARY KEY ("id")
      )
    `);

    // Table: subscriptions
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "subscriptions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "planId" varchar(20) NOT NULL,
        "status" "subscription_status_enum" NOT NULL DEFAULT 'incomplete',
        "stripeSubscriptionId" character varying,
        "currentPeriodEnd" timestamptz,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_subscriptions_userId" UNIQUE ("userId"),
        CONSTRAINT "PK_subscriptions" PRIMARY KEY ("id")
      )
    `);

    // Table: usage_monthly
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "usage_monthly" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "monthYear" varchar(7) NOT NULL,
        "imagesGenerated" integer NOT NULL DEFAULT 0,
        "imagesUploaded" integer NOT NULL DEFAULT 0,
        CONSTRAINT "PK_usage_monthly" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_usage_monthly_userId_monthYear" UNIQUE ("userId", "monthYear")
      )
    `);

    // Table: usage_storage
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "usage_storage" (
        "userId" uuid NOT NULL,
        "bytesUsed" bigint NOT NULL DEFAULT 0,
        CONSTRAINT "PK_usage_storage" PRIMARY KEY ("userId")
      )
    `);

    // Foreign Keys
    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "brand" ADD CONSTRAINT "FK_brand_userId" 
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "templates" ADD CONSTRAINT "FK_templates_userId" 
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "images" ADD CONSTRAINT "FK_images_userId" 
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_subscriptions_userId" 
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_subscriptions_planId" 
        FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "usage_monthly" ADD CONSTRAINT "FK_usage_monthly_userId" 
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "usage_storage" ADD CONSTRAINT "FK_usage_storage_userId" 
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Indexes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_brand_userId" ON "brand" ("userId")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_templates_userId" ON "templates" ("userId")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_images_userId" ON "images" ("userId")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_subscriptions_userId" ON "subscriptions" ("userId")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_subscriptions_planId" ON "subscriptions" ("planId")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_usage_monthly_userId" ON "usage_monthly" ("userId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Supprimer les foreign keys
    await queryRunner.query(`ALTER TABLE "usage_storage" DROP CONSTRAINT IF EXISTS "FK_usage_storage_userId"`);
    await queryRunner.query(`ALTER TABLE "usage_monthly" DROP CONSTRAINT IF EXISTS "FK_usage_monthly_userId"`);
    await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT IF EXISTS "FK_subscriptions_planId"`);
    await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT IF EXISTS "FK_subscriptions_userId"`);
    await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT IF EXISTS "FK_images_userId"`);
    await queryRunner.query(`ALTER TABLE "templates" DROP CONSTRAINT IF EXISTS "FK_templates_userId"`);
    await queryRunner.query(`ALTER TABLE "brand" DROP CONSTRAINT IF EXISTS "FK_brand_userId"`);

    // Supprimer les tables
    await queryRunner.query(`DROP TABLE IF EXISTS "usage_storage"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "usage_monthly"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "subscriptions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "images"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "templates"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "brand"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "plans"`);

    // Supprimer les types ENUM
    await queryRunner.query(`DROP TYPE IF EXISTS "subscription_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "user_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "user_role_enum"`);
  }
}

