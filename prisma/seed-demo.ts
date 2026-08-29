// Local-development-only sample orders, so the admin dashboard isn't empty
// on first run. Never wired into `npm run build` — run it explicitly
// (`npm run db:seed:demo`) against a *local/dev* database only. Skips
// silently if any order already exists, so it's safe to re-run.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface DemoLine { kind: string; name: string; unitPrice: number; qty: number; extrasText?: string; pitamChoice?: string }
interface DemoOrder {
  number: string; lang: "he" | "en" | "fr"; status: string; paymentStatus: string;
  customerName: string; customerPhone: string; customerEmail: string;
  fulfillmentType: "pickup" | "delivery";
  pickupPointId?: string;
  deliveryCity?: string; deliveryNeighborhood?: string; street?: string; house?: string; apt?: string; floor?: string; addressNote?: string;
  total: number; note?: string; lines: DemoLine[];
}

async function main() {
  if ((await prisma.order.count()) > 0) {
    console.log("Orders already exist — skipping demo seed.");
    return;
  }

  const pickups = await prisma.pickupPoint.findMany({ orderBy: { sort: "asc" } });
  const demo: DemoOrder[] = [
    {
      number: "VN-11254", lang: "he", status: "new", paymentStatus: "paid",
      customerName: "ישראל כהן", customerPhone: "0501234567", customerEmail: "israel@example.com",
      fulfillmentType: "delivery", deliveryCity: "באר שבע", deliveryNeighborhood: "רמות", street: "הדס", house: "12", apt: "4", floor: "2", addressNote: "להתקשר לפני",
      total: 790, lines: [{ kind: "set", name: "סט מיוחד", unitPrice: 790, qty: 1, extrasText: "לולב קורה · עם פיטם", pitamChoice: "with" }],
    },
    {
      number: "VN-11253", lang: "en", status: "in_process", paymentStatus: "paid",
      customerName: "David Miller", customerPhone: "0521112233", customerEmail: "david@example.com",
      fulfillmentType: "pickup", pickupPointId: pickups[0]?.id, total: 520,
      lines: [{ kind: "set", name: "Mehudar Set", unitPrice: 260, qty: 2, extrasText: "With Pitam", pitamChoice: "with" }],
    },
    {
      number: "VN-11252", lang: "he", status: "ready", paymentStatus: "unpaid",
      customerName: "שמעון לוי", customerPhone: "0533334444", customerEmail: "shimon@example.com",
      fulfillmentType: "delivery", deliveryCity: "באר שבע", deliveryNeighborhood: "נווה זאב", street: "שקד", house: "8",
      total: 200, note: "ביקש אתרוג גדול",
      lines: [
        { kind: "product", name: "אתרוג חזון איש – א״א", unitPrice: 140, qty: 1, extrasText: "בלי פיטם", pitamChoice: "without" },
        { kind: "product", name: "לולב זהידי / חיאני", unitPrice: 60, qty: 1 },
      ],
    },
    {
      number: "VN-11251", lang: "fr", status: "out_for_delivery", paymentStatus: "paid",
      customerName: "Yaakov Attal", customerPhone: "0544445555", customerEmail: "yaakov@example.com",
      fulfillmentType: "delivery", deliveryCity: "באר שבע", deliveryNeighborhood: "רמות", street: "רותם", house: "21", apt: "9", floor: "3", addressNote: "קוד בניין 1234",
      total: 540, lines: [{ kind: "set", name: "Ensemble Deluxe Mehudar", unitPrice: 540, qty: 1, extrasText: "Avec Pitam", pitamChoice: "with" }],
    },
    {
      number: "VN-11250", lang: "he", status: "delivered", paymentStatus: "paid",
      customerName: "משה פרידמן", customerPhone: "0555556666", customerEmail: "moshe@example.com",
      fulfillmentType: "pickup", pickupPointId: pickups[2]?.id, total: 415,
      lines: [{ kind: "set", name: "סט מהודר א׳", unitPrice: 415, qty: 1, extrasText: "נרתיק · עם פיטם", pitamChoice: "with" }],
    },
    {
      number: "VN-11249", lang: "en", status: "ready", paymentStatus: "paid",
      customerName: "Sarah Cohen", customerPhone: "0566667777", customerEmail: "sarah@example.com",
      fulfillmentType: "delivery", deliveryCity: "עומר", deliveryNeighborhood: "מרכז", street: "האלה", house: "3",
      total: 450, lines: [{ kind: "set", name: "Kosher Set", unitPrice: 150, qty: 3 }],
    },
    {
      number: "VN-11248", lang: "he", status: "cancelled", paymentStatus: "paid",
      customerName: "אליהו בן דוד", customerPhone: "0577778888", customerEmail: "eliyahu@example.com",
      fulfillmentType: "delivery", deliveryCity: "באר שבע", deliveryNeighborhood: "שכונה ט׳", street: "יצחק נפחא", house: "17", apt: "2", floor: "1",
      total: 190, lines: [
        { kind: "set", name: "סט כשר", unitPrice: 150, qty: 1 },
        { kind: "product", name: "קוישלעך", unitPrice: 20, qty: 2 },
      ],
    },
    {
      number: "VN-11247", lang: "fr", status: "new", paymentStatus: "unpaid",
      customerName: "Chaim Levy", customerPhone: "0588889999", customerEmail: "chaim@example.com",
      fulfillmentType: "pickup", pickupPointId: pickups[1]?.id, total: 380,
      lines: [{ kind: "set", name: "Ensemble Mehudar Min HaMehudar", unitPrice: 380, qty: 1, extrasText: "Sans Pitam", pitamChoice: "without" }],
    },
  ];

  for (const o of demo) {
    const { lines, status, paymentStatus, ...rest } = o;
    await prisma.order.create({
      data: {
        ...rest,
        status: status as Parameters<typeof prisma.order.create>[0]["data"]["status"],
        paymentStatus: paymentStatus as Parameters<typeof prisma.order.create>[0]["data"]["paymentStatus"],
        lines: { create: lines },
      },
    });
  }
  console.log(`Seeded ${demo.length} demo orders.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
