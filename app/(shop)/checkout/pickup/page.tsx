import { getPickupPoints } from "@/lib/catalog";
import PickupClient from "./PickupClient";

export const dynamic = "force-dynamic";

export default async function PickupPage() {
  const raw = await getPickupPoints();
  const points = raw.map(({ createdAt, updatedAt, ...p }) => p);
  return <PickupClient points={points} />;
}
