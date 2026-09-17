/**
 * Seeds the database with Efrata's real brand details plus CLEARLY LABELLED
 * sample content. Every sample row has isSample = true so the website renders
 * a visible "Sample" badge. Replace it from /admin at any time.
 *
 * Usage: npm run seed
 */
import "dotenv/config";
import { getDb, schema, usingEmbeddedDatabase } from "../src/db";

async function main() {
  const db = await getDb();

  /* ---------------------------- profile ---------------------------------- */
  const [existingProfile] = await db.select().from(schema.profiles).limit(1);
  const profile = {
    name: "Efrata Alex",
    title: "Video Editor · Social Media Manager · Graphic Designer · Content Creator",
    tagline: "I turn ideas into visual experiences.",
    intro:
      "I am a multidisciplinary creative from Ethiopia working across video editing, motion graphics, graphic design and social media strategy for brands that want to be remembered.",
    bio: `I am Efrata Alex, a creative professional based in Ethiopia. I work with founders, brands and creators to turn rough ideas into finished visual stories — edited videos, motion graphics, brand visuals and social media content that actually performs.

My work sits at the intersection of design and storytelling. Before I open an editing timeline or a design canvas, I want to understand the goal: who is watching, what they should feel, and what they should do next.

This biography, like every other piece of text on this website, is fully editable from the admin dashboard.`,
    philosophy:
      "Good design is invisible; good storytelling is unforgettable. I aim for both — work that feels effortless to watch and impossible to ignore.",
    approach:
      "Discover the goal, plan the story, craft the visuals, refine with feedback, deliver assets ready for every platform.",
    experience:
      "Freelance creative work across video editing, motion graphics, graphic design, content creation and social media management for local brands and independent creators.",
    email: "ephratahh16@gmail.com",
    phone: "+251900395342",
    location: "Ethiopia",
    availability: "Available for creative projects",
    skills: [
      "Video Editing",
      "Motion Graphics",
      "Graphic Design",
      "Content Creation",
      "Social Media Management",
      "Social Media Marketing",
      "Adobe Premiere Pro",
      "After Effects",
      "Photoshop",
      "Illustrator",
      "Canva",
      "CapCut",
    ],
    aboutVideoThumbUrl: "/samples/video-thumb.jpg",
    updatedAt: new Date(),
  };
  if (existingProfile) {
    await db.update(schema.profiles).set(profile);
  } else {
    await db.insert(schema.profiles).values(profile);
  }
  console.log("✓ profile");

  /* ---------------------------- services -------------------------------- */
  const services = [
    {
      title: "Video Editing",
      slug: "video-editing",
      icon: "Film",
      category: "Video Editing",
      description:
        "Story-first editing for brand films, ads, reels and long-form content — pacing, colour, sound design and platform-ready exports.",
    },
    {
      title: "Motion Graphics",
      slug: "motion-graphics",
      icon: "Sparkles",
      category: "Motion Graphics",
      description:
        "Animated logos, kinetic typography, lower thirds and explainer animation that give static brands movement.",
    },
    {
      title: "Graphic Design",
      slug: "graphic-design",
      icon: "PenTool",
      category: "Graphic Design",
      description:
        "Brand identities, posters, packaging and social templates built on a consistent visual system.",
    },
    {
      title: "Social Media Management",
      slug: "social-media-management",
      icon: "CalendarClock",
      category: "Social Media Management",
      description:
        "Content calendars, publishing, community replies and monthly reporting so your channels never go quiet.",
    },
    {
      title: "Social Media Marketing",
      slug: "social-media-marketing",
      icon: "TrendingUp",
      category: "Social Media Marketing",
      description:
        "Campaign concepts, paid creative and performance iteration focused on reach, engagement and conversions.",
    },
    {
      title: "Content Creation",
      slug: "content-creation",
      icon: "Camera",
      category: "Content Creation",
      description:
        "End-to-end creative production: concept, shot list, capture, edit and delivery for every channel you publish on.",
    },
  ].map((service, index) => ({ ...service, sortOrder: index, published: true }));

  for (const service of services) {
    const existing = await db.select().from(schema.services);
    if (existing.some((s) => s.slug === service.slug)) continue;
    await db.insert(schema.services).values(service);
  }
  console.log("✓ services");

  /* ---------------------------- projects -------------------------------- */
  const projects = [
    {
      title: "SAMPLE — Highland Coffee Brand Film",
      slug: "sample-highland-coffee-brand-film",
      category: "Video Editing",
      shortDescription:
        "Sample portfolio entry showing how a brand film case study appears. Replace with your own work.",
      description:
        "This is placeholder content included so Efrata can see how a full case study looks before uploading real work. Nothing here describes an actual client engagement.",
      objective: "Demonstrate the case-study layout: objective, role, tools and results.",
      role: "Editor and colourist (sample).",
      results: "Sample entry — no real performance data is claimed.",
      client: "Sample client",
      projectDate: "2026",
      tools: ["Premiere Pro", "After Effects", "DaVinci Resolve"],
      coverUrl: "/samples/cover-1.jpg",
      featured: true,
      isSample: true,
    },
    {
      title: "SAMPLE — Motion Identity Pack",
      slug: "sample-motion-identity-pack",
      category: "Motion Graphics",
      shortDescription: "Sample entry demonstrating a motion graphics case study layout.",
      description: "Placeholder content. Replace this project from the admin dashboard.",
      objective: "Show how animated identity work can be presented.",
      role: "Motion designer (sample).",
      results: "Sample entry — no real metrics.",
      client: "Sample client",
      projectDate: "2026",
      tools: ["After Effects", "Illustrator"],
      coverUrl: "/samples/cover-2.jpg",
      featured: true,
      isSample: true,
    },
    {
      title: "SAMPLE — Social Campaign Design System",
      slug: "sample-social-campaign-design-system",
      category: "Graphic Design",
      shortDescription: "Sample entry showing a design-system style case study.",
      description: "Placeholder content for layout preview only.",
      objective: "Illustrate template and grid presentation.",
      role: "Designer (sample).",
      results: "Sample entry — no real metrics.",
      client: "Sample client",
      projectDate: "2026",
      tools: ["Figma", "Photoshop", "Illustrator"],
      coverUrl: "/samples/cover-3.jpg",
      isSample: true,
    },
  ].map((project, index) => ({ ...project, sortOrder: index, published: true }));

  for (const project of projects) {
    const existing = await db.select().from(schema.projects);
    if (existing.some((p) => p.slug === project.slug)) continue;
    await db.insert(schema.projects).values(project);
  }
  console.log("✓ sample projects (clearly labelled)");

  /* -------------------------- testimonials ------------------------------ */
  const testimonials = [
    {
      clientName: "Sample Client A",
      role: "Marketing Lead",
      company: "Sample Company",
      quote:
        "This is placeholder testimonial text so the layout can be reviewed. It is not a real client quote. Replace it from the admin dashboard.",
      rating: 5,
    },
    {
      clientName: "Sample Client B",
      role: "Founder",
      company: "Sample Studio",
      quote:
        "Placeholder testimonial. No real person has said this. Delete or replace before launching the website.",
      rating: 5,
    },
  ].map((testimonial, index) => ({ ...testimonial, sortOrder: index, published: true, isSample: true }));

  for (const testimonial of testimonials) {
    const existing = await db.select().from(schema.testimonials);
    if (existing.some((t) => t.quote === testimonial.quote)) continue;
    await db.insert(schema.testimonials).values(testimonial);
  }
  console.log("✓ sample testimonials (clearly labelled)");

  /* ---------------------------- logos ----------------------------------- */
  for (let i = 1; i <= 6; i++) {
    const name = `Sample Brand ${i}`;
    const existing = await db.select().from(schema.clientLogos);
    if (existing.some((l) => l.companyName === name)) continue;
    await db.insert(schema.clientLogos).values({ companyName: name, sortOrder: i, published: true, isSample: true });
  }
  console.log("✓ sample client logos (clearly labelled)");

  /* ------------------------- certifications ----------------------------- */
  const certifications = [
    {
      title: "SAMPLE — Video Editing Certificate",
      organization: "Sample Institute",
      issuedDate: "2026",
      description: "Placeholder certification entry. Replace with your real certificates.",
    },
    {
      title: "SAMPLE — Digital Marketing Certificate",
      organization: "Sample Academy",
      issuedDate: "2026",
      description: "Placeholder certification entry. Replace with your real certificates.",
    },
  ].map((certification, index) => ({ ...certification, sortOrder: index, published: true, isSample: true }));

  for (const certification of certifications) {
    const existing = await db.select().from(schema.certifications);
    if (existing.some((c) => c.title === certification.title)) continue;
    await db.insert(schema.certifications).values(certification);
  }
  console.log("✓ sample certifications (clearly labelled)");

  /* --------------------------- social links ----------------------------- */
  const socials = ["Instagram", "TikTok", "YouTube", "LinkedIn", "Telegram", "Behance"];
  for (const [index, platform] of socials.entries()) {
    const existing = await db.select().from(schema.socialLinks);
    if (existing.some((s) => s.platform === platform)) continue;
    // published = false until Efrata adds her real URL, so no fake links are shown.
    await db.insert(schema.socialLinks).values({ platform, url: "", sortOrder: index, published: false });
  }
  console.log("✓ social link placeholders (hidden until real URLs are added)");

  /* ---------------------------- settings -------------------------------- */
  const settings: Record<string, string> = {
    statProjects: "",
    statServices: "6",
    statClients: "",
    statYears: "",
    siteTitle: "Efrata Alex — Creative Portfolio",
    siteDescription: "Video editing, motion graphics, graphic design and social media for brands that want to be remembered.",
  };
  for (const [key, value] of Object.entries(settings)) {
    const existing = await db.select().from(schema.siteSettings);
    if (existing.some((s) => s.key === key)) continue;
    await db.insert(schema.siteSettings).values({ key, value });
  }
  console.log("✓ settings");

  /* ------------------------- chatbot knowledge -------------------------- */
  const knowledge = [
    {
      section: "Services",
      question: "What services does Efrata offer?",
      answer:
        "Efrata Alex offers video editing, social media management, social media marketing, graphic design, motion graphics and content creation.",
    },
    {
      section: "Contact",
      question: "How can I contact Efrata?",
      answer:
        "You can email ephratahh16@gmail.com, call or message +251900395342, or send an inquiry through the contact form on this website.",
    },
    {
      section: "Location",
      question: "Where is Efrata based?",
      answer: "Efrata Alex is based in Ethiopia and works with clients remotely.",
    },
    {
      section: "Process",
      question: "How does a project work?",
      answer:
        "A project starts with a short discovery conversation about goals and audience, then planning, production or editing, a revision round based on your feedback, and final delivery of platform-ready files.",
    },
    {
      section: "Pricing",
      question: "How much does a project cost?",
      answer:
        "Pricing depends on scope, length and turnaround. Efrata gives a quote after a short conversation about your project. Send an inquiry through the contact form for an estimate.",
    },
    {
      section: "Hiring",
      question: "How do I hire Efrata?",
      answer:
        "Use the Hire Me page to send project details — service needed, timeline, budget range and a description of the work. Efrata replies by email.",
    },
  ].map((entry, index) => ({ ...entry, sortOrder: index, published: true }));

  for (const entry of knowledge) {
    const existing = await db.select().from(schema.chatbotKnowledge);
    if (existing.some((k) => k.question === entry.question)) continue;
    await db.insert(schema.chatbotKnowledge).values(entry);
  }
  console.log("✓ chatbot knowledge base");

  console.log(
    `\nSeed complete using ${usingEmbeddedDatabase ? "the built-in local database (no DATABASE_URL set)" : "your PostgreSQL database"}.`
  );
  console.log("Next: npm run create-admin");
  process.exit(0);
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
