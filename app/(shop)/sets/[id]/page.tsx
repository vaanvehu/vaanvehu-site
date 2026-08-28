import { notFound } from "next/navigation";
import { getSet, SET_COVER_IMAGE } from "@/lib/catalog";
import SetDetail from "@/components/shop/SetDetail";

export const dynamic = "force-dynamic";

export default async function SetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const raw = await getSet(id);
  if (!raw) notFound();
  const { createdAt, updatedAt, ...set } = raw;
  return <SetDetail set={set} coverImage={SET_COVER_IMAGE} />;
}
