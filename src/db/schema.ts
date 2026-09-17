import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  primaryKey,
} from "drizzle-orm/pg-core";

/* ------------------------------- users ---------------------------------- */

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 160 }),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 32 }).notNull().default("ADMIN"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/* ------------------------------ profile --------------------------------- */

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull().default("Efrata Alex"),
  title: text("title").notNull().default("Video Editor · Social Media Manager · Graphic & Motion Designer"),
  tagline: text("tagline").notNull().default("I turn ideas into visual experiences."),
  intro: text("intro").notNull().default(""),
  bio: text("bio").notNull().default(""),
  philosophy: text("philosophy").notNull().default(""),
  approach: text("approach").notNull().default(""),
  experience: text("experience").notNull().default(""),
  email: varchar("email", { length: 255 }).notNull().default("ephratahh16@gmail.com"),
  phone: varchar("phone", { length: 64 }).notNull().default("+251900395342"),
  location: varchar("location", { length: 120 }).notNull().default("Ethiopia"),
  availability: varchar("availability", { length: 160 }).notNull().default("Available for creative projects"),
  avatarUrl: text("avatar_url"),
  cvUrl: text("cv_url"),
  aboutVideoUrl: text("about_video_url"),
  aboutVideoThumbUrl: text("about_video_thumb_url"),
  aboutVideoCaptionsUrl: text("about_video_captions_url"),
  skills: jsonb("skills").$type<string[]>().notNull().default([]),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/* ------------------------------ services -------------------------------- */

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 160 }).notNull(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  description: text("description").notNull().default(""),
  icon: varchar("icon", { length: 64 }).notNull().default("Sparkles"),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  category: varchar("category", { length: 80 }).notNull().default("Other"),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/* ------------------------------ projects -------------------------------- */

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  category: varchar("category", { length: 80 }).notNull().default("Other"),
  shortDescription: text("short_description").notNull().default(""),
  description: text("description").notNull().default(""),
  objective: text("objective").notNull().default(""),
  role: text("role").notNull().default(""),
  results: text("results").notNull().default(""),
  client: varchar("client", { length: 160 }),
  projectDate: varchar("project_date", { length: 40 }),
  tools: jsonb("tools").$type<string[]>().notNull().default([]),
  coverUrl: text("cover_url"),
  beforeUrl: text("before_url"),
  afterUrl: text("after_url"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  featured: boolean("featured").notNull().default(false),
  published: boolean("published").notNull().default(true),
  isSample: boolean("is_sample").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const projectMedia = pgTable("project_media", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  kind: varchar("kind", { length: 16 }).notNull().default("image"), // image | video
  url: text("url").notNull(),
  thumbUrl: text("thumb_url"),
  caption: text("caption"),
  sortOrder: integer("sort_order").notNull().default(0),
});

/* ---------------------------- testimonials ------------------------------ */

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  clientName: varchar("client_name", { length: 160 }).notNull(),
  role: varchar("role", { length: 160 }),
  company: varchar("company", { length: 160 }),
  quote: text("quote").notNull(),
  rating: integer("rating").notNull().default(5),
  photoUrl: text("photo_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  isSample: boolean("is_sample").notNull().default(false),
});

/* ---------------------------- client logos ------------------------------ */

export const clientLogos = pgTable("client_logos", {
  id: serial("id").primaryKey(),
  companyName: varchar("company_name", { length: 160 }).notNull(),
  website: text("website"),
  logoUrl: text("logo_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  isSample: boolean("is_sample").notNull().default(false),
});

/* --------------------------- certifications ----------------------------- */

export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  organization: varchar("organization", { length: 200 }),
  issuedDate: varchar("issued_date", { length: 40 }),
  description: text("description").notNull().default(""),
  imageUrl: text("image_url"),
  pdfUrl: text("pdf_url"),
  verifyUrl: text("verify_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  isSample: boolean("is_sample").notNull().default(false),
});

/* ------------------------------ inquiries ------------------------------- */

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  kind: varchar("kind", { length: 16 }).notNull().default("contact"), // contact | hire
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 64 }),
  company: varchar("company", { length: 160 }),
  service: varchar("service", { length: 160 }),
  budget: varchar("budget", { length: 80 }),
  deadline: varchar("deadline", { length: 80 }),
  preferredContact: varchar("preferred_contact", { length: 40 }),
  message: text("message").notNull().default(""),
  attachmentUrl: text("attachment_url"),
  status: varchar("status", { length: 32 }).notNull().default("NEW"),
  notes: text("notes").notNull().default(""),
  isRead: boolean("is_read").notNull().default(false),
  archived: boolean("archived").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/* ------------------------------- comments ------------------------------- */

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id, { onDelete: "cascade" }),
  authorName: varchar("author_name", { length: 120 }).notNull(),
  body: text("body").notNull(),
  approved: boolean("approved").notNull().default(false),
  reported: boolean("reported").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/* ----------------------------- social links ----------------------------- */

export const socialLinks = pgTable("social_links", {
  id: serial("id").primaryKey(),
  platform: varchar("platform", { length: 60 }).notNull(),
  url: text("url").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(false),
});

/* ---------------------------- site settings ----------------------------- */

export const siteSettings = pgTable("site_settings", {
  key: varchar("key", { length: 80 }).primaryKey(),
  value: text("value").notNull().default(""),
});

/* --------------------------- chatbot knowledge -------------------------- */

export const chatbotKnowledge = pgTable("chatbot_knowledge", {
  id: serial("id").primaryKey(),
  section: varchar("section", { length: 80 }).notNull(), // faq | pricing | availability | process | instructions | contact
  question: text("question").notNull().default(""),
  answer: text("answer").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 64 }).notNull(),
  role: varchar("role", { length: 16 }).notNull(),
  content: text("content").notNull(),
  language: varchar("language", { length: 8 }).notNull().default("en"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/* --------------------------- visitor accounts --------------------------- */

export const visitorAccounts = pgTable("visitor_accounts", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 160 }),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const favorites = pgTable(
  "favorites",
  {
    visitorId: integer("visitor_id")
      .notNull()
      .references(() => visitorAccounts.id, { onDelete: "cascade" }),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
  },
  (t) => ({ pk: primaryKey({ columns: [t.visitorId, t.projectId] }) })
);

/* ------------------------------- analytics ------------------------------ */

export const pageViews = pgTable("page_views", {
  id: serial("id").primaryKey(),
  path: text("path").notNull(),
  referrerHost: varchar("referrer_host", { length: 160 }),
  device: varchar("device", { length: 32 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
