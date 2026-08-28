import { getPickupPoints, getDeliveryCities } from "@/lib/catalog";
import SummaryClient from "./SummaryClient";

export const dynamic = "force-dynamic";

export default async function SummaryPage() {
  const [rawPoints, rawCities] = await Promise.all([getPickupPoints(), getDeliveryCities()]);
  const pickupPoints = rawPoints.map(({ createdAt, updatedAt, ...p }) => p);
  const cities = rawCities.map(({ createdAt, updatedAt, neighborhoods, ...c }) => ({
    ...c,
    neighborhoods: neighborhoods.map(({ cityId, ...n }) => n),
  }));
  return <SummaryClient pickupPoints={pickupPoints} cities={cities} />;
}
