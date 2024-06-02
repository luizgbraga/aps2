CREATE TABLE IF NOT EXISTS "alt_shapes" (
	"id" serial PRIMARY KEY NOT NULL,
	"trip_id" varchar,
	"pt_sequence" integer NOT NULL,
	"pt_lat" double precision,
	"pt_lon" double precision NOT NULL,
	"dist_traveled" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "affect" (
	"occurence_id" uuid NOT NULL,
	"route_id" varchar NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "alt_shapes" ADD CONSTRAINT "alt_shapes_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "affect" ADD CONSTRAINT "affect_occurence_id_occurences_id_fk" FOREIGN KEY ("occurence_id") REFERENCES "occurences"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "affect" ADD CONSTRAINT "affect_route_id_routes_id_fk" FOREIGN KEY ("route_id") REFERENCES "routes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
