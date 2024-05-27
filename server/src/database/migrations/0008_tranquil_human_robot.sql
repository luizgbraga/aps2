ALTER TABLE "neighborhood" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "neighborhood" ADD COLUMN "zone" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "unread" integer DEFAULT 0 NOT NULL;