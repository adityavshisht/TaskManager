import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Demo users
  await prisma.user.createMany({
    data: [
      { email: "ada@example.com", name: "Ada" },
      { email: "linus@example.com", name: "Linus" },
      { email: "grace@example.com", name: "Grace" }
    ],
    skipDuplicates: true // avoids errors if you re-run the seed
  });

  // (Optional) confirm in console
  const count = await prisma.user.count();
  console.log(`✅ Seeded users. Total users now: ${count}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
