/**
 * Creates (or updates the password of) the admin account.
 * The password is typed interactively and never stored in a file — only a
 * bcrypt hash is written to the database.
 *
 * Usage: npm run create-admin
 */
import "dotenv/config";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { eq } from "drizzle-orm";
import { getDb, schema } from "../src/db";
import { hashPassword } from "../src/lib/auth";

async function main() {
  const rl = createInterface({ input: stdin, output: stdout });

  const email = (await rl.question("Admin email: ")).trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    console.error("That does not look like a valid email address.");
    process.exit(1);
  }

  const name = (await rl.question("Display name (optional): ")).trim() || "Efrata Alex";

  const password = (await rl.question("Password (min 10 characters, hidden input is not available here): ")).trim();
  if (password.length < 10) {
    console.error("Password must be at least 10 characters long.");
    process.exit(1);
  }
  const confirm = (await rl.question("Confirm password: ")).trim();
  if (password !== confirm) {
    console.error("Passwords do not match.");
    process.exit(1);
  }
  rl.close();

  const db = await getDb();
  const passwordHash = await hashPassword(password);
  const [existing] = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);

  if (existing) {
    await db.update(schema.users).set({ passwordHash, name }).where(eq(schema.users.id, existing.id));
    console.log(`\n✓ Password updated for ${email}. Sign in at /login`);
  } else {
    await db.insert(schema.users).values({ email, name, passwordHash, role: "ADMIN" });
    console.log(`\n✓ Admin account created for ${email}. Sign in at /login`);
  }
  process.exit(0);
}

main().catch((error) => {
  console.error("Could not create the admin account:", error);
  process.exit(1);
});
