CREATE TABLE IF NOT EXISTS "trips" (
	"id" varchar PRIMARY KEY NOT NULL,
	"route_id" varchar,
	"headsign" varchar(255) NOT NULL,
	"direction" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shapes" (
	"id" serial PRIMARY KEY NOT NULL,
	"trip_id" varchar,
	"pt_sequence" integer NOT NULL,
	"pt_lat" double precision,
	"pt_lon" double precision NOT NULL,
	"dist_traveled" double precision NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trips" ADD CONSTRAINT "trips_route_id_routes_id_fk" FOREIGN KEY ("route_id") REFERENCES "routes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shapes" ADD CONSTRAINT "shapes_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
