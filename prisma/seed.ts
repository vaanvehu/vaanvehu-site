// Seed script — loads the exact catalog / fulfillment / settings data captured
// from the design_handoff_vaanvehu prototype (Desktop.dc.html + Admin.dc.html).
// Idempotent and safe to run against a production database (it's wired into
// `npm run build`, so it runs automatically on every deploy) — it never
// inserts fake/demo data. For local development sample orders, see seed-demo.ts.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ── Sets ────────────────────────────────────────────────────────────────
const SETS = [
  {
    id: "special",
    nameHe: "סט מיוחד",
    nameEn: "SUPER Mehudar Set",
    nameFr: "Ensemble SUPER Mehudar",
    descHe: "המובחרים שבארבעת המינים, בבחירה קפדנית במיוחד",
    descEn: "The finest of the Arba Minim, selected with exceptional care.",
    descFr: "Les plus beaux des Arba Minim, sélectionnés avec un soin exceptionnel.",
    price: 720,
    image: "assets/etrog-3.jpg",
    includesHe: ["אתרוג חזון איש – רמת מיוחד", "לולב זהידי – רמת מיוחד", "הדסים א״א", "ערבות", "נרתיק"],
    includesEn: ["Chazon Ish Etrog – Special Grade", "Zehidi Lulav – Special Grade", "Mehudar A”A Hadassim", "Aravot", "Lulav Case"],
    includesFr: ["Etrog Chazon Ish – qualité Special", "Lulav Zehidi – qualité Special", "Hadassim Mehudar A”A", "Aravot", "Étui pour Lulav"],
    sort: 0,
    upgrades: [{ key: "kora", nameHe: "לולב קורה", nameEn: "Kora Lulav", nameFr: "Lulav Kora", price: 70, sort: 0 }],
  },
  {
    id: "mehudar-aa",
    nameHe: "סט מהודר א״א",
    nameEn: "Deluxe Mehudar Set",
    nameFr: "Ensemble Deluxe Mehudar",
    descHe: "רמת הידור גבוהה במיוחד, עם בחירה מוקפדת של האתרוג והלולב",
    descEn: "An exceptionally high level of hiddur, with a carefully selected Etrog and Lulav.",
    descFr: "Un niveau de hiddour exceptionnel, avec un Etrog et un Lulav soigneusement sélectionnés.",
    price: 540,
    image: "assets/etrog-4.jpg",
    includesHe: ["אתרוג חזון איש – רמת א״א", "לולב זהידי – רמת א״א", "הדסים א״א", "ערבות", "נרתיק"],
    includesEn: ["Chazon Ish Etrog – Mehudar A”A Grade", "Zehidi Lulav – Mehudar A”A Grade", "Mehudar A”A Hadassim", "Aravot", "Lulav Case"],
    includesFr: ["Etrog Chazon Ish – qualité Mehudar A”A", "Lulav Zehidi – qualité Mehudar A”A", "Hadassim Mehudar A”A", "Aravot", "Étui pour Lulav"],
    sort: 1,
    upgrades: [{ key: "kora", nameHe: "לולב קורה", nameEn: "Kora Lulav", nameFr: "Lulav Kora", price: 60, sort: 0 }],
  },
  {
    id: "mehudar-a",
    nameHe: "סט מהודר א׳",
    nameEn: "Mehudar Min HaMehudar Set",
    nameFr: "Ensemble Mehudar Min HaMehudar",
    descHe: "סט מהודר ברמה גבוהה, עם בחירה איכותית ומוקפדת של האתרוג, הלולב וההדסים",
    descEn: "A high-level Mehudar set, featuring a carefully selected Etrog, Lulav and Hadassim.",
    descFr: "Un ensemble Mehudar de haut niveau, avec un Etrog, un Lulav et des Hadassim soigneusement sélectionnés.",
    price: 380,
    image: "assets/etrog-lulav.jpg",
    includesHe: ["אתרוג חזון איש – מהודר א׳", "לולב זהידי – מהודר א׳", "הדסים – מהודר א׳", "ערבות"],
    includesEn: ["Chazon Ish Etrog – Mehudar A Grade", "Zehidi Lulav – Mehudar A Grade", "Hadassim – Mehudar A Grade", "Aravot"],
    includesFr: ["Etrog Chazon Ish – qualité Mehudar A", "Lulav Zehidi – qualité Mehudar A", "Hadassim – qualité Mehudar A", "Aravot"],
    sort: 2,
    upgrades: [
      { key: "kora", nameHe: "לולב קורה", nameEn: "Kora Lulav", nameFr: "Lulav Kora", price: 55, sort: 0 },
      { key: "hadasaa", nameHe: "הדסים א״א", nameEn: "Mehudar A”A Hadassim", nameFr: "Hadassim Mehudar A”A", price: 45, sort: 1 },
      { key: "case", nameHe: "נרתיק", nameEn: "Lulav Case", nameFr: "Étui pour Lulav", price: 35, sort: 2 },
    ],
  },
  {
    id: "mehudar",
    nameHe: "סט מהודר",
    nameEn: "Mehudar Set",
    nameFr: "Ensemble Mehudar",
    descHe: "ארבעת המינים ברמת הידור מוקפדת ובאיכות טובה",
    descEn: "A carefully selected set of Arba Minim, offering a fine level of hiddur and quality.",
    descFr: "Un ensemble d’Arba Minim soigneusement sélectionné, d’un beau niveau de hiddour et de qualité.",
    price: 260,
    image: "assets/etrog-5.jpg",
    includesHe: ["אתרוג חזון איש – מהודר", "לולב זהידי – מהודר", "הדסים – מהודר", "ערבות"],
    includesEn: ["Chazon Ish Etrog – Mehudar Grade", "Zehidi Lulav – Mehudar Grade", "Hadassim – Mehudar Grade", "Aravot"],
    includesFr: ["Etrog Chazon Ish – qualité Mehudar", "Lulav Zehidi – qualité Mehudar", "Hadassim – qualité Mehudar", "Aravot"],
    sort: 3,
    upgrades: [
      { key: "kora", nameHe: "לולב קורה", nameEn: "Kora Lulav", nameFr: "Lulav Kora", price: 50, sort: 0 },
      { key: "hadasaa", nameHe: "הדסים א״א", nameEn: "Mehudar A”A Hadassim", nameFr: "Hadassim Mehudar A”A", price: 40, sort: 1 },
      { key: "case", nameHe: "נרתיק", nameEn: "Lulav Case", nameFr: "Étui pour Lulav", price: 30, sort: 2 },
    ],
  },
  {
    id: "kosher",
    nameHe: "סט כשר",
    nameEn: "Kosher Set",
    nameFr: "Ensemble Kosher",
    descHe: "ארבעת המינים כשרים לברכה!",
    descEn: "A complete set of Arba Minim, Kosher for the mitzvah!",
    descFr: "Un ensemble complet d’Arba Minim, Kosher pour la mitsva !",
    price: 150,
    image: "assets/etrog-1.jpg",
    includesHe: ["אתרוג חזון איש – כשר", "לולב זהידי – כשר", "הדסים – כשר", "ערבות"],
    includesEn: ["Chazon Ish Etrog – Kosher Grade", "Zehidi Lulav – Kosher Grade", "Hadassim – Kosher Grade", "Aravot"],
    includesFr: ["Etrog Chazon Ish – qualité Kosher", "Lulav Zehidi – qualité Kosher", "Hadassim – qualité Kosher", "Aravot"],
    sort: 4,
    upgrades: [{ key: "case", nameHe: "נרתיק", nameEn: "Lulav Case", nameFr: "Étui pour Lulav", price: 25, sort: 0 }],
  },
];

// The sets grid / set-detail cover image is always this single image in the
// design (SET_IMAGE) — each set's own `image` is used only for cart-line thumbnails.
export const SET_COVER_IMAGE = "assets/etrog-lulav.jpg";

const GRADES = [
  { id: "special", nameHe: "מיוחד", nameEn: "Special", nameFr: "Special", price: 180, sort: 0 },
  { id: "aa", nameHe: "א״א", nameEn: "Mehudar A”A", nameFr: "Mehudar A”A", price: 140, sort: 1 },
  { id: "mehudar-a", nameHe: "מהודר א׳", nameEn: "Mehudar A", nameFr: "Mehudar A", price: 110, sort: 2 },
  { id: "mehudar", nameHe: "מהודר", nameEn: "Mehudar", nameFr: "Mehudar", price: 85, sort: 3 },
  { id: "kosher", nameHe: "כשר", nameEn: "Kosher", nameFr: "Kosher", price: 55, sort: 4 },
];

const ETROG_TYPES = [
  { id: "chazon-ish", nameHe: "חזון איש", nameEn: "Chazon Ish", nameFr: "Chazon Ish", image: "assets/etrog-2.jpg", pitamAsk: true, sort: 0 },
  { id: "temani", nameHe: "תימני", nameEn: "Teimani", nameFr: "Teimani", image: "assets/etrog-1.jpg", pitamAsk: false, sort: 1 },
  { id: "moroccan", nameHe: "מרוקאי", nameEn: "Moroccan", nameFr: "Marocain", image: "assets/etrog-moroccan.jpeg", pitamAsk: true, sort: 2 },
  { id: "calabria", nameHe: "קלבריא", nameEn: "Calabrian", nameFr: "Calabrais", image: "assets/etrog-calabria.png", pitamAsk: true, sort: 3 },
];

const LULAVIM = [
  { key: "zehidi-chiani", nameHe: "זהידי / חיאני", nameEn: "Zehidi / Hayani", nameFr: "Zehidi / Hayani", price: 60, image: "assets/lulav-1.jpg", sort: 0 },
  { key: "dari", nameHe: "דרי", nameEn: "Der’i", nameFr: "Der’i", price: 55, image: "assets/lulav-4.png", sort: 1 },
  { key: "zehidi-kora", nameHe: "זהידי קורה", nameEn: "Zehidi Kora", nameFr: "Zehidi Kora", price: 90, image: "assets/lulav-1.jpg", sort: 2 },
  { key: "dari-kora", nameHe: "דרי קורה", nameEn: "Der’i Kora", nameFr: "Der’i Kora", price: 85, image: "assets/lulav-3.jpg", sort: 3 },
];

const HADASIM = [
  { key: "bavad", nameHe: "א׳ באב״ד", nameEn: "Mehudar A – BaBad", nameFr: "Mehudar A – BaBad", price: 20, image: "assets/hadas-1.jpg", sort: 0 },
  { key: "weiss", nameHe: "א״א וייס", nameEn: "Mehudar A”A – Weiss", nameFr: "Mehudar A”A – Weiss", price: 35, image: "assets/hadas-2.jpg", sort: 1 },
  { key: "stern", nameHe: "א״א שטרן", nameEn: "Mehudar A”A – Stern", nameFr: "Mehudar A”A – Stern", price: 35, image: "assets/hadas-1.jpg", sort: 2 },
  { key: "klein", nameHe: "א״א קליין", nameEn: "Mehudar A”A – Klein", nameFr: "Mehudar A”A – Klein", price: 35, image: "assets/hadas-2.jpg", sort: 3 },
  { key: "tzinorot", nameHe: "א״א צינורות", nameEn: "Mehudar A”A – Tzinorot", nameFr: "Mehudar A”A – Tzinorot", price: 40, image: "assets/hadas-1.jpg", sort: 4 },
];

const ARAVOT = [
  { key: "aravot-set", nameHe: "סט ערבות", nameEn: "Aravot Set", nameFr: "Ensemble Aravot", price: 15, image: "assets/arava-1.jpg", sort: 0 },
];

const EXTRAS = [
  { key: "case", nameHe: "נרתיק", nameEn: "Lulav Case", nameFr: "Étui pour Lulav", price: 35, image: "assets/nartik.jpeg", sort: 1 },
  { key: "kishlach", nameHe: "קוישלעך", nameEn: "Koishelach", nameFr: "Koishelach", price: 20, image: "assets/koishlech.png", sort: 2 },
];

const PICKUP_POINTS = [
  {
    nameHe: "נקודת איסוף – רמת אלחנן", nameEn: "Pickup Location – Ramat Elchanan", nameFr: "Point de retrait – Ramat Elchanan",
    addressHe: "רח׳ הרב עוזיאל 12, בני ברק", addressEn: "12 HaRav Uziel St., Bnei Brak", addressFr: "12 rue HaRav Uziel, Bnei Brak",
    hoursHe: "א׳–ה׳ 10:00–20:00, ו׳ 9:00–13:00", hoursEn: "Sun–Thu 10:00–20:00, Fri 9:00–13:00", hoursFr: "Dim.–Jeu. 10:00–20:00, Ven. 9:00–13:00",
    phone: "03-1234567", note: "לצלצל בפעמון העליון", sort: 0,
  },
  {
    nameHe: "נקודת איסוף – פרדס כץ", nameEn: "Pickup Location – Pardes Katz", nameFr: "Point de retrait – Pardes Katz",
    addressHe: "רח׳ עזרא 5, בני ברק", addressEn: "5 Ezra St., Bnei Brak", addressFr: "5 rue Ezra, Bnei Brak",
    hoursHe: "א׳–ה׳ 11:00–21:00", hoursEn: "Sun–Thu 11:00–21:00", hoursFr: "Dim.–Jeu. 11:00–21:00",
    phone: "", note: "", sort: 1,
  },
  {
    nameHe: "נקודת איסוף – גבעת שאול", nameEn: "Pickup Location – Givat Shaul", nameFr: "Point de retrait – Givat Shaul",
    addressHe: "רח׳ בן פורת 3, ירושלים", addressEn: "3 Ben Porat St., Jerusalem", addressFr: "3 rue Ben Porat, Jérusalem",
    hoursHe: "א׳–ה׳ 10:00–19:00, ו׳ 9:00–12:30", hoursEn: "Sun–Thu 10:00–19:00, Fri 9:00–12:30", hoursFr: "Dim.–Jeu. 10:00–19:00, Ven. 9:00–12:30",
    phone: "", note: "", sort: 2,
  },
];

const DELIVERY_CITIES = [
  {
    nameHe: "באר שבע", nameEn: "Be’er Sheva", nameFr: "Beer-Sheva", active: true, price: 25, minimum: 100, freeOver: 350, sort: 0,
    neighborhoods: [
      { nameHe: "רמות", nameEn: "Ramot", nameFr: "Ramot" },
      { nameHe: "נווה זאב", nameEn: "Neve Ze’ev", nameFr: "Neve Ze’ev" },
      { nameHe: "רמות ב׳", nameEn: "Ramot B", nameFr: "Ramot B" },
      { nameHe: "שכונה ט׳", nameEn: "Shchuna 9", nameFr: "Quartier 9" },
      { nameHe: "נחל עשן", nameEn: "Nachal Ashan", nameFr: "Nahal Ashan" },
      { nameHe: "אחר / לא ברשימה", nameEn: "Other / not listed", nameFr: "Autre / non listé" },
    ],
  },
  {
    nameHe: "עומר", nameEn: "Omer", nameFr: "Omer", active: true, price: 35, minimum: 150, freeOver: 400, sort: 1,
    neighborhoods: [
      { nameHe: "מרכז", nameEn: "Center", nameFr: "Centre" },
      { nameHe: "אחר / לא ברשימה", nameEn: "Other / not listed", nameFr: "Autre / non listé" },
    ],
  },
  {
    nameHe: "להבים", nameEn: "Lehavim", nameFr: "Lehavim", active: false, price: 40, minimum: 200, freeOver: 500, sort: 2,
    neighborhoods: [{ nameHe: "אחר / לא ברשימה", nameEn: "Other / not listed", nameFr: "Autre / non listé" }],
  },
  {
    nameHe: "מיתר", nameEn: "Meitar", nameFr: "Meitar", active: true, price: 40, minimum: 200, freeOver: 500, sort: 3,
    neighborhoods: [{ nameHe: "אחר / לא ברשימה", nameEn: "Other / not listed", nameFr: "Autre / non listé" }],
  },
];

const MESSAGE_TEMPLATES = [
  { id: "m1", title: "אישור הזמנה", subject: "אישור הזמנה #{מספר} — וְאַנְוֵהוּ", body: "שלום {שם},\nקיבלנו את הזמנתך #{מספר} בסך {סכום}.\nנעדכן אותך בהמשך התהליך.\nוְאַנְוֵהוּ", sort: 0 },
  { id: "m2", title: "מוכן לאיסוף", subject: "הזמנה #{מספר} מוכנה לאיסוף", body: "שלום {שם},\nהזמנה #{מספר} מוכנה לאיסוף בנקודה שבחרת.\nוְאַנְוֵהוּ", sort: 1 },
  { id: "m3", title: "יצא למשלוח", subject: "הזמנה #{מספר} יצאה למשלוח", body: "שלום {שם},\nהזמנה #{מספר} יצאה כעת למשלוח.\nוְאַנְוֵהוּ", sort: 2 },
  { id: "m4", title: "עדכון סטטוס כללי", subject: "עדכון על הזמנה #{מספר}", body: "שלום {שם},\nעדכון על הזמנה #{מספר}: {סטטוס}.\nוְאַנְוֵהוּ", sort: 3 },
];

async function main() {
  console.log("Seeding catalog…");

  for (const s of SETS) {
    const { upgrades, ...set } = s;
    await prisma.setProduct.upsert({ where: { id: set.id }, update: set, create: set });
    for (const u of upgrades) {
      await prisma.setUpgrade.upsert({
        where: { setId_key: { setId: set.id, key: u.key } },
        update: u,
        create: { ...u, setId: set.id },
      });
    }
  }

  for (const g of GRADES) {
    await prisma.grade.upsert({ where: { id: g.id }, update: g, create: g });
  }

  for (const t of ETROG_TYPES) {
    await prisma.etrogType.upsert({ where: { id: t.id }, update: t, create: t });
  }

  const flat = [
    ...LULAVIM.map((p) => ({ ...p, category: "lulav" })),
    ...HADASIM.map((p) => ({ ...p, category: "hadas" })),
    ...ARAVOT.map((p) => ({ ...p, category: "arava" })),
    ...EXTRAS.map((p) => ({ ...p, category: "extra" })),
  ];
  for (const p of flat) {
    await prisma.product.upsert({ where: { key: p.key }, update: p, create: p });
  }

  // Pickup points / delivery cities are only re-seeded if none exist yet,
  // since admins edit them directly afterwards.
  if ((await prisma.pickupPoint.count()) === 0) {
    for (const p of PICKUP_POINTS) await prisma.pickupPoint.create({ data: p });
  }
  if ((await prisma.deliveryCity.count()) === 0) {
    for (const c of DELIVERY_CITIES) {
      const { neighborhoods, ...city } = c;
      await prisma.deliveryCity.create({
        data: { ...city, neighborhoods: { create: neighborhoods.map((n, i) => ({ ...n, sort: i })) } },
      });
    }
  }

  for (const t of MESSAGE_TEMPLATES) {
    await prisma.messageTemplate.upsert({ where: { id: t.id }, update: t, create: t });
  }

  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, businessEmail: "vanvehu4minim@gmail.com", whatsappNumber: "052-6665954", autoSend: true },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
