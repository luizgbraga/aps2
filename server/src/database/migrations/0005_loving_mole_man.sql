CREATE TABLE IF NOT EXISTS "routes" (
	"route_id" uuid PRIMARY KEY NOT NULL,
	"short_name" varchar(255) NOT NULL,
	"long_name" varchar(255) NOT NULL,
	"desc" varchar(255),
	"type" integer NOT NULL,
	"color" varchar(255) NOT NULL,
	"text_color" varchar(255) NOT NULL
);
