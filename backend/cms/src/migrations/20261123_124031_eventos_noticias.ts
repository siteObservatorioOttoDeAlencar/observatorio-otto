import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_eventos_tipo" AS ENUM('observacao', 'oficina', 'palestra', 'visita');
  CREATE TYPE "public"."enum_eventos_situacao" AS ENUM('agendado', 'realizado', 'cancelado');
  CREATE TYPE "public"."enum_eventos_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__eventos_v_version_tipo" AS ENUM('observacao', 'oficina', 'palestra', 'visita');
  CREATE TYPE "public"."enum__eventos_v_version_situacao" AS ENUM('agendado', 'realizado', 'cancelado');
  CREATE TYPE "public"."enum__eventos_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_noticias_categoria" AS ENUM('astrofisica', 'historia-da-ciencia', 'observacional', 'instrumentacao');
  CREATE TYPE "public"."enum_noticias_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__noticias_v_version_categoria" AS ENUM('astrofisica', 'historia-da-ciencia', 'observacional', 'instrumentacao');
  CREATE TYPE "public"."enum__noticias_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "eventos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"tipo" "enum_eventos_tipo",
  	"inicio" timestamp(3) with time zone,
  	"fim" timestamp(3) with time zone,
  	"local" varchar,
  	"descricao" jsonb,
  	"publico_alvo" varchar,
  	"situacao" "enum_eventos_situacao" DEFAULT 'agendado',
  	"link_inscricao" varchar,
  	"relato" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_eventos_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "eventos_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_eventos_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_titulo" varchar,
  	"version_tipo" "enum__eventos_v_version_tipo",
  	"version_inicio" timestamp(3) with time zone,
  	"version_fim" timestamp(3) with time zone,
  	"version_local" varchar,
  	"version_descricao" jsonb,
  	"version_publico_alvo" varchar,
  	"version_situacao" "enum__eventos_v_version_situacao" DEFAULT 'agendado',
  	"version_link_inscricao" varchar,
  	"version_relato" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__eventos_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_eventos_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "noticias" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"slug" varchar,
  	"resumo" varchar,
  	"categoria" "enum_noticias_categoria",
  	"autor" varchar,
  	"corpo" jsonb,
  	"capa_id" integer,
  	"data_publicacao" timestamp(3) with time zone,
  	"projeto_relacionado" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_noticias_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_noticias_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_titulo" varchar,
  	"version_slug" varchar,
  	"version_resumo" varchar,
  	"version_categoria" "enum__noticias_v_version_categoria",
  	"version_autor" varchar,
  	"version_corpo" jsonb,
  	"version_capa_id" integer,
  	"version_data_publicacao" timestamp(3) with time zone,
  	"version_projeto_relacionado" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__noticias_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "eventos_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "noticias_id" integer;
  ALTER TABLE "eventos_rels" ADD CONSTRAINT "eventos_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."eventos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "eventos_rels" ADD CONSTRAINT "eventos_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_eventos_v" ADD CONSTRAINT "_eventos_v_parent_id_eventos_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."eventos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_eventos_v_rels" ADD CONSTRAINT "_eventos_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_eventos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_eventos_v_rels" ADD CONSTRAINT "_eventos_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "noticias" ADD CONSTRAINT "noticias_capa_id_media_id_fk" FOREIGN KEY ("capa_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_noticias_v" ADD CONSTRAINT "_noticias_v_parent_id_noticias_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."noticias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_noticias_v" ADD CONSTRAINT "_noticias_v_version_capa_id_media_id_fk" FOREIGN KEY ("version_capa_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "eventos_updated_at_idx" ON "eventos" USING btree ("updated_at");
  CREATE INDEX "eventos_created_at_idx" ON "eventos" USING btree ("created_at");
  CREATE INDEX "eventos__status_idx" ON "eventos" USING btree ("_status");
  CREATE INDEX "eventos_rels_order_idx" ON "eventos_rels" USING btree ("order");
  CREATE INDEX "eventos_rels_parent_idx" ON "eventos_rels" USING btree ("parent_id");
  CREATE INDEX "eventos_rels_path_idx" ON "eventos_rels" USING btree ("path");
  CREATE INDEX "eventos_rels_media_id_idx" ON "eventos_rels" USING btree ("media_id");
  CREATE INDEX "_eventos_v_parent_idx" ON "_eventos_v" USING btree ("parent_id");
  CREATE INDEX "_eventos_v_version_version_updated_at_idx" ON "_eventos_v" USING btree ("version_updated_at");
  CREATE INDEX "_eventos_v_version_version_created_at_idx" ON "_eventos_v" USING btree ("version_created_at");
  CREATE INDEX "_eventos_v_version_version__status_idx" ON "_eventos_v" USING btree ("version__status");
  CREATE INDEX "_eventos_v_created_at_idx" ON "_eventos_v" USING btree ("created_at");
  CREATE INDEX "_eventos_v_updated_at_idx" ON "_eventos_v" USING btree ("updated_at");
  CREATE INDEX "_eventos_v_latest_idx" ON "_eventos_v" USING btree ("latest");
  CREATE INDEX "_eventos_v_rels_order_idx" ON "_eventos_v_rels" USING btree ("order");
  CREATE INDEX "_eventos_v_rels_parent_idx" ON "_eventos_v_rels" USING btree ("parent_id");
  CREATE INDEX "_eventos_v_rels_path_idx" ON "_eventos_v_rels" USING btree ("path");
  CREATE INDEX "_eventos_v_rels_media_id_idx" ON "_eventos_v_rels" USING btree ("media_id");
  CREATE UNIQUE INDEX "noticias_slug_idx" ON "noticias" USING btree ("slug");
  CREATE INDEX "noticias_capa_idx" ON "noticias" USING btree ("capa_id");
  CREATE INDEX "noticias_updated_at_idx" ON "noticias" USING btree ("updated_at");
  CREATE INDEX "noticias_created_at_idx" ON "noticias" USING btree ("created_at");
  CREATE INDEX "noticias__status_idx" ON "noticias" USING btree ("_status");
  CREATE INDEX "_noticias_v_parent_idx" ON "_noticias_v" USING btree ("parent_id");
  CREATE INDEX "_noticias_v_version_version_slug_idx" ON "_noticias_v" USING btree ("version_slug");
  CREATE INDEX "_noticias_v_version_version_capa_idx" ON "_noticias_v" USING btree ("version_capa_id");
  CREATE INDEX "_noticias_v_version_version_updated_at_idx" ON "_noticias_v" USING btree ("version_updated_at");
  CREATE INDEX "_noticias_v_version_version_created_at_idx" ON "_noticias_v" USING btree ("version_created_at");
  CREATE INDEX "_noticias_v_version_version__status_idx" ON "_noticias_v" USING btree ("version__status");
  CREATE INDEX "_noticias_v_created_at_idx" ON "_noticias_v" USING btree ("created_at");
  CREATE INDEX "_noticias_v_updated_at_idx" ON "_noticias_v" USING btree ("updated_at");
  CREATE INDEX "_noticias_v_latest_idx" ON "_noticias_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_eventos_fk" FOREIGN KEY ("eventos_id") REFERENCES "public"."eventos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_noticias_fk" FOREIGN KEY ("noticias_id") REFERENCES "public"."noticias"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_eventos_id_idx" ON "payload_locked_documents_rels" USING btree ("eventos_id");
  CREATE INDEX "payload_locked_documents_rels_noticias_id_idx" ON "payload_locked_documents_rels" USING btree ("noticias_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "eventos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "eventos_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_eventos_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_eventos_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "noticias" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_noticias_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "eventos" CASCADE;
  DROP TABLE "eventos_rels" CASCADE;
  DROP TABLE "_eventos_v" CASCADE;
  DROP TABLE "_eventos_v_rels" CASCADE;
  DROP TABLE "noticias" CASCADE;
  DROP TABLE "_noticias_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_eventos_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_noticias_fk";
  
  DROP INDEX "payload_locked_documents_rels_eventos_id_idx";
  DROP INDEX "payload_locked_documents_rels_noticias_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "eventos_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "noticias_id";
  DROP TYPE "public"."enum_eventos_tipo";
  DROP TYPE "public"."enum_eventos_situacao";
  DROP TYPE "public"."enum_eventos_status";
  DROP TYPE "public"."enum__eventos_v_version_tipo";
  DROP TYPE "public"."enum__eventos_v_version_situacao";
  DROP TYPE "public"."enum__eventos_v_version_status";
  DROP TYPE "public"."enum_noticias_categoria";
  DROP TYPE "public"."enum_noticias_status";
  DROP TYPE "public"."enum__noticias_v_version_categoria";
  DROP TYPE "public"."enum__noticias_v_version_status";`)
}
