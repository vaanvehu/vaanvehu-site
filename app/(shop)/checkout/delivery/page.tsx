import { getDeliveryCities } from "@/lib/catalog";
import DeliveryClient from "./DeliveryClient";

export const dynamic = "force-dynamic";

export default async function DeliveryPage() {
  const raw = await getDeliveryCities();
  const cities = raw.map(({ createdAt, updatedAt, neighborhoods, ...c }) => ({
    ...c,
    neighborhoods: neighborhoods.map(({ cityId, ...n }) => n),
  }));
  return <DeliveryClient cities={cities} />;
}
