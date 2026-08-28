import { prisma } from "@/lib/prisma";
import CatalogRow from "@/components/admin/CatalogRow";

export default async function AdminCatalogPage() {
  const [sets, etrogTypes, grades, products] = await Promise.all([
    prisma.setProduct.findMany({ orderBy: { sort: "asc" }, include: { upgrades: { orderBy: { sort: "asc" } } } }),
    prisma.etrogType.findMany({ orderBy: { sort: "asc" } }),
    prisma.grade.findMany({ orderBy: { sort: "asc" } }),
    prisma.product.findMany({ orderBy: [{ category: "asc" }, { sort: "asc" }] }),
  ]);

  const CATEGORY_LABEL: Record<string, string> = { lulav: "לולבים", hadas: "הדסים", arava: "ערבות", extra: "תוספות" };

  return (
    <>
      <h3 className="text-[30px] vd:text-[38px] mb-1">מוצרים</h3>
      <p className="text-[16px] opacity-70 mb-5">שינוי מחיר, שם והצגה — בלי שינוי בקוד</p>

      <GroupHeader title="סטים מוכנים" count={sets.length} />
      <div className="card p-0 overflow-x-auto mb-7">
        {sets.map((s) => (
          <div key={s.id}>
            <CatalogRow model="set" id={s.id} name={s.nameHe} price={s.price} active={s.active} image={s.image} />
            {s.upgrades.length > 0 && (
              <div className="pe-4.5 ps-16 py-1.5" style={{ background: "color-mix(in srgb, var(--color-accent-100) 25%, transparent)" }}>
                {s.upgrades.map((u) => (
                  <div key={u.id} className="py-1">
                    <CatalogRow model="setUpgrade" id={u.id} name={u.nameHe} price={u.price} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <GroupHeader title="אתרוגים – סוגים" count={etrogTypes.length} />
      <div className="card p-0 overflow-x-auto mb-7">
        {etrogTypes.map((t) => (
          <CatalogRow key={t.id} model="etrogType" id={t.id} name={t.nameHe} active={t.active} image={t.image} meta={t.pitamAsk ? "שואל פיטם" : "ללא פיטם"} />
        ))}
      </div>

      <GroupHeader title="אתרוגים – רמות" count={grades.length} />
      <div className="card p-0 overflow-x-auto mb-7">
        {grades.map((g) => (
          <CatalogRow key={g.id} model="grade" id={g.id} name={g.nameHe} price={g.price} active={g.active} />
        ))}
      </div>

      <GroupHeader title="לולבים, הדסים, ערבות ותוספות" count={products.length} />
      <div className="card p-0 overflow-x-auto mb-7">
        {products.map((p) => (
          <CatalogRow key={p.id} model="product" id={p.id} name={p.nameHe} price={p.price} active={p.active} image={p.image} meta={CATEGORY_LABEL[p.category]} />
        ))}
      </div>
    </>
  );
}

function GroupHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center gap-3 mb-3 py-2.5 px-4 rounded-[10px]" style={{ background: "color-mix(in srgb, var(--color-accent-100) 48%, transparent)", border: "1px solid var(--color-accent-300)" }}>
      <span className="w-2 h-2 rotate-45" style={{ background: "var(--color-accent)" }} />
      <span className="font-[var(--font-heading)] text-[24px]" style={{ color: "var(--brand-green)" }}>{title}</span>
      <span className="text-[14px] opacity-65">{count} פריטים</span>
    </div>
  );
}
