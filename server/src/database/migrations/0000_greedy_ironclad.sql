CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cpf" varchar(14) NOT NULL,
	"password" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_cpf_unique" UNIQUE("cpf")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "neighborhood" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"zone" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "occurences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" varchar NOT NULL,
	"description" varchar(255) NOT NULL,
	"latitude" varchar(255) NOT NULL,
	"longitude" varchar(255) NOT NULL,
	"bairro_id" uuid NOT NULL,
	"confirmed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "admins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	CONSTRAINT "admins_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscriptions" (
	"user_id" uuid NOT NULL,
	"bairro_id" uuid NOT NULL,
	"unread" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_user_id_bairro_id_pk" PRIMARY KEY("user_id","bairro_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "routes" (
	"id" varchar PRIMARY KEY NOT NULL,
	"short_name" varchar(255) NOT NULL,
	"long_name" varchar(255) NOT NULL,
	"desc_name" varchar(255),
	"type" integer NOT NULL,
	"color" varchar(255) NOT NULL,
	"text_color" varchar(255) NOT NULL
);
--> statement-breakpoint
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
 ALTER TABLE "occurences" ADD CONSTRAINT "occurences_bairro_id_neighborhood_id_fk" FOREIGN KEY ("bairro_id") REFERENCES "neighborhood"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_bairro_id_neighborhood_id_fk" FOREIGN KEY ("bairro_id") REFERENCES "neighborhood"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
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
