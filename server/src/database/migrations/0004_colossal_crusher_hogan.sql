ALTER TABLE "admins" RENAME COLUMN "cpf" TO "username";--> statement-breakpoint
ALTER TABLE "admins" DROP CONSTRAINT "admins_cpf_unique";--> statement-breakpoint
ALTER TABLE "admins" ADD CONSTRAINT "admins_username_unique" UNIQUE("username");