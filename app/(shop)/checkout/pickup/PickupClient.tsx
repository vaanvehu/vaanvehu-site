"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLang } from "@/contexts/LangContext";
import { useCheckout } from "@/contexts/CheckoutContext";
import { T, pickField } from "@/lib/i18n";

interface PickupRow {
  id: string;
  nameHe: string; nameEn: string | null; nameFr: string | null;
  addressHe: string; addressEn: string | null; addressFr: string | null;
  hoursHe: string; hoursEn: string | null; hoursFr: string | null;
}

export default function PickupClient({ points }: { points: PickupRow[] }) {
  const { lang } = useLang();
  const { state, setPickupPointId } = useCheckout();
  const t = T[lang];
  const router = useRouter();
  const invalid = !state.pickupPointId;

  return (
    <section className="max-w-[1240px] mx-auto px-4 vm:px-10 pt-6 vm:pt-[34px] pb-16 vm:pb-20">
      <div className="max-w-[760px]">
        <Link href="/checkout/fulfillment" className="btn btn-secondary text-[19px] py-2 px-5 inline-flex items-center gap-2.5 mb-4.5 no-underline">
          {t.back}
        </Link>
        <h3 className="text-[26px] vm:text-[38px] mb-1">{t.pickupTitle}</h3>
        <p className="text-[15px] vm:text-[16px] opacity-60 mb-4.5 vm:mb-6">{t.pickupNote}</p>
        <div className="flex flex-col gap-2.5 vm:gap-3">
          {points.map((p) => (
            <div
              key={p.id}
              onClick={() => setPickupPointId(p.id)}
              className="card cursor-pointer py-3.5 px-4.5"
              style={{ boxShadow: state.pickupPointId === p.id ? "0 0 0 2px var(--color-accent)" : "none" }}
            >
              <div className="card-title text-[19px] vm:text-[22px]">{pickField(p, "name", lang)}</div>
              <div className="card-body mt-1">{pickField(p, "address", lang)}</div>
              <div className="card-meta mt-1.5">{pickField(p, "hours", lang)}</div>
            </div>
          ))}
        </div>
        <button
          disabled={invalid}
          onClick={() => router.push("/checkout/summary")}
          className="btn btn-primary mt-5 vm:mt-6.5 text-[18px] vm:text-[19px] py-3.5 px-8"
        >
          {t.cont}
        </button>
      </div>
    </section>
  );
}
