import { PROJECT_CATEGORIES, SOCIAL_PLATFORMS } from "./utils";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "checkbox"
  | "image"
  | "video"
  | "file"
  | "list";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  options?: readonly string[];
  required?: boolean;
  help?: string;
  full?: boolean;
};

export type ResourceKey =
  | "projects"
  | "services"
  | "testimonials"
  | "logos"
  | "certifications"
  | "knowledge"
  | "social"
  | "media";

export type ResourceConfig = {
  key: ResourceKey;
  label: string;
  singular: string;
  titleField: string;
  fields: Field[];
  hasOrder?: boolean;
  hasPublish?: boolean;
};

const ICON_CHOICES = ["Film", "CalendarClock", "TrendingUp", "Megaphone", "PenTool", "Wand2", "Camera", "Sparkles", "Award"] as const;

export const RESOURCES: Record<ResourceKey, ResourceConfig> = {
  projects: {
    key: "projects",
    label: "Projects",
    singular: "Project",
    titleField: "title",
    hasOrder: true,
    hasPublish: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug (URL)", type: "text", help: "Leave empty to generate from the title." },
      { name: "category", label: "Category", type: "select", options: PROJECT_CATEGORIES, required: true },
      { name: "client", label: "Client", type: "text" },
      { name: "projectDate", label: "Date", type: "text", help: "e.g. March 2026" },
      { name: "shortDescription", label: "Short description", type: "textarea", full: true },
      { name: "description", label: "Full description", type: "textarea", full: true },
      { name: "objective", label: "Objective", type: "textarea", full: true },
      { name: "role", label: "My role", type: "textarea", full: true },
      { name: "results", label: "Results", type: "textarea", full: true },
      { name: "tools", label: "Tools / software", type: "list", help: "Comma separated." },
      { name: "coverUrl", label: "Cover image", type: "image" },
      { name: "beforeUrl", label: "Before image", type: "image" },
      { name: "afterUrl", label: "After image", type: "image" },
      { name: "seoTitle", label: "SEO title", type: "text" },
      { name: "seoDescription", label: "SEO description", type: "textarea", full: true },
      { name: "featured", label: "Featured on homepage", type: "checkbox" },
      { name: "published", label: "Published", type: "checkbox" },
      { name: "isSample", label: "Mark as sample/placeholder", type: "checkbox" },
      { name: "sortOrder", label: "Sort order", type: "number" },
    ],
  },

  services: {
    key: "services",
    label: "Services",
    singular: "Service",
    titleField: "title",
    hasOrder: true,
    hasPublish: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text" },
      { name: "category", label: "Linked project category", type: "select", options: PROJECT_CATEGORIES, required: true },
      { name: "icon", label: "Icon", type: "select", options: ICON_CHOICES },
      { name: "description", label: "Description", type: "textarea", full: true },
      { name: "imageUrl", label: "Image", type: "image" },
      { name: "videoUrl", label: "Video (optional)", type: "video" },
      { name: "published", label: "Published", type: "checkbox" },
      { name: "sortOrder", label: "Sort order", type: "number" },
    ],
  },

  testimonials: {
    key: "testimonials",
    label: "Testimonials",
    singular: "Testimonial",
    titleField: "clientName",
    hasOrder: true,
    hasPublish: true,
    fields: [
      { name: "clientName", label: "Client name", type: "text", required: true },
      { name: "role", label: "Role", type: "text" },
      { name: "company", label: "Company", type: "text" },
      { name: "quote", label: "Testimonial", type: "textarea", required: true, full: true },
      { name: "rating", label: "Star rating (1-5)", type: "number" },
      { name: "photoUrl", label: "Profile photo", type: "image" },
      { name: "published", label: "Published", type: "checkbox" },
      { name: "isSample", label: "Mark as sample/placeholder", type: "checkbox" },
      { name: "sortOrder", label: "Sort order", type: "number" },
    ],
  },

  logos: {
    key: "logos",
    label: "Client logos",
    singular: "Logo",
    titleField: "companyName",
    hasOrder: true,
    hasPublish: true,
    fields: [
      { name: "companyName", label: "Company name", type: "text", required: true },
      { name: "website", label: "Website URL", type: "text" },
      { name: "logoUrl", label: "Logo (SVG, PNG, WebP)", type: "image" },
      { name: "published", label: "Visible", type: "checkbox" },
      { name: "isSample", label: "Mark as sample/placeholder", type: "checkbox" },
      { name: "sortOrder", label: "Sort order", type: "number" },
    ],
  },

  certifications: {
    key: "certifications",
    label: "Certifications",
    singular: "Certification",
    titleField: "title",
    hasOrder: true,
    hasPublish: true,
    fields: [
      { name: "title", label: "Certificate title", type: "text", required: true },
      { name: "organization", label: "Issuing organization", type: "text" },
      { name: "issuedDate", label: "Date", type: "text" },
      { name: "description", label: "Description", type: "textarea", full: true },
      { name: "imageUrl", label: "Certificate image", type: "image" },
      { name: "pdfUrl", label: "Certificate PDF", type: "file" },
      { name: "verifyUrl", label: "Verification link", type: "text" },
      { name: "published", label: "Published", type: "checkbox" },
      { name: "isSample", label: "Mark as sample/placeholder", type: "checkbox" },
      { name: "sortOrder", label: "Sort order", type: "number" },
    ],
  },

  knowledge: {
    key: "knowledge",
    label: "AI knowledge",
    singular: "Knowledge entry",
    titleField: "question",
    hasOrder: true,
    hasPublish: true,
    fields: [
      {
        name: "section",
        label: "Section",
        type: "select",
        options: ["faq", "services", "pricing", "availability", "biography", "process", "contact", "instructions"],
        required: true,
      },
      { name: "question", label: "Question / topic", type: "text", full: true },
      { name: "answer", label: "Answer the chatbot may use", type: "textarea", required: true, full: true },
      { name: "published", label: "Active", type: "checkbox" },
      { name: "sortOrder", label: "Sort order", type: "number" },
    ],
  },

  social: {
    key: "social",
    label: "Social links",
    singular: "Social link",
    titleField: "platform",
    hasOrder: true,
    hasPublish: true,
    fields: [
      { name: "platform", label: "Platform", type: "select", options: SOCIAL_PLATFORMS, required: true },
      { name: "url", label: "Profile URL", type: "text", full: true },
      { name: "published", label: "Show on website", type: "checkbox" },
      { name: "sortOrder", label: "Sort order", type: "number" },
    ],
  },

  media: {
    key: "media",
    label: "Project media",
    singular: "Media item",
    titleField: "caption",
    hasOrder: true,
    fields: [
      { name: "projectId", label: "Project ID", type: "number", required: true },
      { name: "kind", label: "Type", type: "select", options: ["image", "video"], required: true },
      { name: "url", label: "File", type: "file", required: true },
      { name: "thumbUrl", label: "Thumbnail (videos)", type: "image" },
      { name: "caption", label: "Caption", type: "text", full: true },
      { name: "sortOrder", label: "Order", type: "number" },
    ],
  },
};
