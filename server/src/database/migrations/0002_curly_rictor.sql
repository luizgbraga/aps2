ALTER TABLE "users" RENAME COLUMN "email" TO "cpf";--> statement-breakpoint
ALTER TABLE "notifications" RENAME COLUMN "status" TO "confirmed";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "cpf" SET DATA TYPE varchar(11);--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "confirmed" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "confirmed" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_cpf_unique" UNIQUE("cpf");