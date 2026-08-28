import { getEtrogTypes, getGrades, getProductsByCategory } from "@/lib/catalog";
import BuildYourOwn from "@/components/shop/BuildYourOwn";

export const dynamic = "force-dynamic";

export default async function BuildPage() {
  const [etrogTypes, grades, lulavim, hadasim, aravaExtras] = await Promise.all([
    getEtrogTypes(),
    getGrades(),
    getProductsByCategory(["lulav"]),
    getProductsByCategory(["hadas"]),
    getProductsByCategory(["arava", "extra"]),
  ]);
  const strip = <T extends { createdAt?: unknown; updatedAt?: unknown }>(rows: T[]) =>
    rows.map(({ createdAt, updatedAt, ...r }) => r);

  return (
    <BuildYourOwn
      etrogTypes={etrogTypes}
      grades={grades}
      lulavim={strip(lulavim)}
      hadasim={strip(hadasim)}
      arava={strip(aravaExtras)}
    />
  );
}
