CREATE TABLE IF NOT EXISTS "admins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cpf" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	CONSTRAINT "admins_cpf_unique" UNIQUE("cpf")
);
