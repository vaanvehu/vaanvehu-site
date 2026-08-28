import { getSets, SET_COVER_IMAGE } from "@/lib/catalog";
import SetsGrid from "@/components/shop/SetsGrid";

export const dynamic = "force-dynamic";

export default async function SetsPage() {
  const raw = await getSets();
  const sets = raw.map(({ createdAt, updatedAt, ...s }) => s);
  return <SetsGrid sets={sets} coverImage={SET_COVER_IMAGE} />;
}
