import "dotenv/config";
import { auth } from "../src/auth.js";
import prisma from "../src/db.js";
import { Role } from "../src/generated/prisma/enums.js";

const email = process.env.SEED_ADMIN_EMAIL!;
const password = process.env.SEED_ADMIN_PASSWORD!;
const name = process.env.SEED_ADMIN_NAME!;

if (!email || !password || !name) {
  console.error("Missing SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, or SEED_ADMIN_NAME in .env");
  process.exit(1);
}

const existing = await prisma.user.findUnique({ where: { email } });
if (existing) {
  console.log(`Admin user ${email} already exists — skipping.`);
  process.exit(0);
}

await auth.api.createUser({
  body: { email, password, name, role: Role.admin },
});

console.log(`Admin user created: ${email}`);
await prisma.$disconnect();
