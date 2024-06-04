ALTER TABLE "occurences" RENAME TO "occurrences";--> statement-breakpoint
ALTER TABLE "occurrences" DROP CONSTRAINT "occurences_bairro_id_neighborhood_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "occurrences" ADD CONSTRAINT "occurrences_bairro_id_neighborhood_id_fk" FOREIGN KEY ("bairro_id") REFERENCES "neighborhood"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
