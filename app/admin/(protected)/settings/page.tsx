import { prisma } from "@/lib/prisma";
import CityEditor from "@/components/admin/CityEditor";
import PickupEditor from "@/components/admin/PickupEditor";
import TemplateEditor from "@/components/admin/TemplateEditor";
import SettingsGeneral from "@/components/admin/SettingsGeneral";
import { AddCityButton, AddPickupButton } from "@/components/admin/AddButtons";

export default async function AdminSettingsPage() {
  const [settings, cities, pickups, templates] = await Promise.all([
    prisma.settings.upsert({ where: { id: 1 }, update: {}, create: { id: 1, businessEmail: "vanvehu4minim@gmail.com", whatsappNumber: "052-6665954", autoSend: true } }),
    prisma.deliveryCity.findMany({ orderBy: { sort: "asc" }, include: { neighborhoods: { orderBy: { sort: "asc" } } } }),
    prisma.pickupPoint.findMany({ orderBy: { sort: "asc" } }),
    prisma.messageTemplate.findMany({ orderBy: { sort: "asc" } }),
  ]);

  return (
    <>
      <h3 className="text-[30px] vd:text-[38px] mb-1">הגדרות</h3>
      <p className="text-[16px] opacity-70 mb-5.5">לאן ואיך אפשר לשלוח · נקודות איסוף</p>

      <div className="flex items-center gap-3 mb-3">
        <span className="font-[var(--font-heading)] text-[24px]" style={{ color: "var(--brand-green)" }}>ערים למשלוח</span>
        <span className="flex-1 h-px" style={{ background: "var(--color-divider)" }} />
        <AddCityButton />
      </div>
      <div className="card p-0 overflow-x-auto mb-7">
        <div className="grid gap-3 py-3 px-4.5 border-b font-[var(--font-heading)] text-[16px]" style={{ gridTemplateColumns: "minmax(160px,1.2fr) 110px 120px 120px 140px", minWidth: 720, borderColor: "var(--color-divider)", background: "color-mix(in srgb, var(--color-accent-100) 35%, transparent)" }}>
          <span>עיר</span><span>מצב</span><span>מחיר משלוח</span><span>מינימום</span><span>חינם מעל</span>
        </div>
        {cities.map((c) => <CityEditor key={c.id} city={c} />)}
      </div>

      <div className="flex items-center gap-3 mb-3">
        <span className="font-[var(--font-heading)] text-[24px]" style={{ color: "var(--brand-green)" }}>נקודות איסוף</span>
        <span className="flex-1 h-px" style={{ background: "var(--color-divider)" }} />
        <AddPickupButton />
      </div>
      <div className="grid gap-3.5 mb-7.5" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))" }}>
        {pickups.map((p) => <PickupEditor key={p.id} pickup={p} />)}
      </div>

      <SettingsGeneral businessEmail={settings.businessEmail} whatsappNumber={settings.whatsappNumber} autoSend={settings.autoSend} />

      <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))" }}>
        {templates.map((t) => <TemplateEditor key={t.id} template={t} />)}
      </div>
    </>
  );
}
