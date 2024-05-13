CREATE TABLE IF NOT EXISTS "occurences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"description" varchar(255) NOT NULL,
	"latitude" varchar(255) NOT NULL,
	"longitude" varchar(255) NOT NULL,
	"bairro_id" uuid NOT NULL,
	"confirmed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "occurences" ADD CONSTRAINT "occurences_bairro_id_neighborhood_id_fk" FOREIGN KEY ("bairro_id") REFERENCES "neighborhood"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
