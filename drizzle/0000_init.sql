CREATE TABLE "certifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"organization" varchar(200),
	"issued_date" varchar(40),
	"description" text DEFAULT '' NOT NULL,
	"image_url" text,
	"pdf_url" text,
	"verify_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"is_sample" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(64) NOT NULL,
	"role" varchar(16) NOT NULL,
	"content" text NOT NULL,
	"language" varchar(8) DEFAULT 'en' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chatbot_knowledge" (
	"id" serial PRIMARY KEY NOT NULL,
	"section" varchar(80) NOT NULL,
	"question" text DEFAULT '' NOT NULL,
	"answer" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "client_logos" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_name" varchar(160) NOT NULL,
	"website" text,
	"logo_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"is_sample" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer,
	"author_name" varchar(120) NOT NULL,
	"body" text NOT NULL,
	"approved" boolean DEFAULT false NOT NULL,
	"reported" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "favorites" (
	"visitor_id" integer NOT NULL,
	"project_id" integer NOT NULL,
	CONSTRAINT "favorites_visitor_id_project_id_pk" PRIMARY KEY("visitor_id","project_id")
);
--> statement-breakpoint
CREATE TABLE "inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"kind" varchar(16) DEFAULT 'contact' NOT NULL,
	"name" varchar(160) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(64),
	"company" varchar(160),
	"service" varchar(160),
	"budget" varchar(80),
	"deadline" varchar(80),
	"preferred_contact" varchar(40),
	"message" text DEFAULT '' NOT NULL,
	"attachment_url" text,
	"status" varchar(32) DEFAULT 'NEW' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_views" (
	"id" serial PRIMARY KEY NOT NULL,
	"path" text NOT NULL,
	"referrer_host" varchar(160),
	"device" varchar(32),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(160) DEFAULT 'Efrata Alex' NOT NULL,
	"title" text DEFAULT 'Video Editor · Social Media Manager · Graphic & Motion Designer' NOT NULL,
	"tagline" text DEFAULT 'I turn ideas into visual experiences.' NOT NULL,
	"intro" text DEFAULT '' NOT NULL,
	"bio" text DEFAULT '' NOT NULL,
	"philosophy" text DEFAULT '' NOT NULL,
	"approach" text DEFAULT '' NOT NULL,
	"experience" text DEFAULT '' NOT NULL,
	"email" varchar(255) DEFAULT 'ephratahh16@gmail.com' NOT NULL,
	"phone" varchar(64) DEFAULT '+251900395342' NOT NULL,
	"location" varchar(120) DEFAULT 'Ethiopia' NOT NULL,
	"availability" varchar(160) DEFAULT 'Available for creative projects' NOT NULL,
	"avatar_url" text,
	"cv_url" text,
	"about_video_url" text,
	"about_video_thumb_url" text,
	"about_video_captions_url" text,
	"skills" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_media" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"kind" varchar(16) DEFAULT 'image' NOT NULL,
	"url" text NOT NULL,
	"thumb_url" text,
	"caption" text,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"slug" varchar(200) NOT NULL,
	"category" varchar(80) DEFAULT 'Other' NOT NULL,
	"short_description" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"objective" text DEFAULT '' NOT NULL,
	"role" text DEFAULT '' NOT NULL,
	"results" text DEFAULT '' NOT NULL,
	"client" varchar(160),
	"project_date" varchar(40),
	"tools" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"cover_url" text,
	"before_url" text,
	"after_url" text,
	"seo_title" text,
	"seo_description" text,
	"featured" boolean DEFAULT false NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"is_sample" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(160) NOT NULL,
	"slug" varchar(160) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"icon" varchar(64) DEFAULT 'Sparkles' NOT NULL,
	"image_url" text,
	"video_url" text,
	"category" varchar(80) DEFAULT 'Other' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"key" varchar(80) PRIMARY KEY NOT NULL,
	"value" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "social_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"platform" varchar(60) NOT NULL,
	"url" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_name" varchar(160) NOT NULL,
	"role" varchar(160),
	"company" varchar(160),
	"quote" text NOT NULL,
	"rating" integer DEFAULT 5 NOT NULL,
	"photo_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"is_sample" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(160),
	"password_hash" text NOT NULL,
	"role" varchar(32) DEFAULT 'ADMIN' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "visitor_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(160),
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "visitor_accounts_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_visitor_id_visitor_accounts_id_fk" FOREIGN KEY ("visitor_id") REFERENCES "public"."visitor_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_media" ADD CONSTRAINT "project_media_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;