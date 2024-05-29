CREATE TABLE IF NOT EXISTS "subscriptions" (
	"user_id" uuid NOT NULL,
	"bairro_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_user_id_bairro_id_pk" PRIMARY KEY("user_id","bairro_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_bairro_id_neighborhood_id_fk" FOREIGN KEY ("bairro_id") REFERENCES "neighborhood"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
