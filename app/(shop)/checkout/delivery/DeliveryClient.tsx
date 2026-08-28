"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/contexts/LangContext";
import { useCheckout } from "@/contexts/CheckoutContext";
import { T, pickField } from "@/lib/i18n";

interface NeighborhoodRow { id: string; nameHe: string; nameEn: string | null; nameFr: string | null }
interface CityRow { id: string; nameHe: string; nameEn: string | null; nameFr: string | null; neighborhoods: NeighborhoodRow[] }

export default function DeliveryClient({ cities }: { cities: CityRow[] }) {
  const { lang } = useLang();
  const { state, setDelivery } = useCheckout();
  const t = T[lang];
  const router = useRouter();

  // default to the first active city/neighborhood once loaded, mirroring the design's initial state
  useEffect(() => {
    if (!state.delivery.city && cities[0]) {
      setDelivery({ city: cities[0].nameHe, neighborhood: cities[0].neighborhoods[0]?.nameHe ?? "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cities.length]);

  const selectedCity = cities.find((c) => c.nameHe === state.delivery.city) ?? cities[0];
  const invalid = !(state.delivery.street.trim() && state.delivery.house.trim() && state.delivery.city && state.delivery.neighborhood);

  return (
    <section className="max-w-[1240px] mx-auto px-4 vm:px-10 pt-6 vm:pt-[34px] pb-16 vm:pb-20">
      <div className="max-w-[760px]">
        <Link href="/checkout/fulfillment" className="btn btn-secondary text-[19px] py-2 px-5 inline-flex items-center gap-2.5 mb-4.5 no-underline">
          {t.back}
        </Link>
        <h3 className="text-[26px] vm:text-[38px] mb-3">{t.deliveryTitle}</h3>
        <div className="card mb-4.5 vm:mb-5.5 py-3.5 px-4" style={{ background: "var(--color-accent-100)", borderColor: "var(--color-accent-300)" }}>
          <p style={{ color: "var(--color-accent-800)" }} className="text-[15px] vm:text-[16px]">{t.deliveryNote}</p>
        </div>
        <div className="grid grid-cols-1 vm:grid-cols-2 gap-3.5 vm:gap-4.5">
          <div className="field">
            <label>{t.city}</label>
            <select
              className="input text-[17px] py-3.5 px-3"
              value={state.delivery.city}
              onChange={(e) => {
                const city = cities.find((c) => c.nameHe === e.target.value);
                setDelivery({ city: e.target.value, neighborhood: city?.neighborhoods[0]?.nameHe ?? "" });
              }}
            >
              {cities.map((c) => <option key={c.id} value={c.nameHe}>{pickField(c, "name", lang)}</option>)}
            </select>
          </div>
          <div className="field">
            <label>{t.neighborhood}</label>
            <select className="input text-[17px] py-3.5 px-3" value={state.delivery.neighborhood} onChange={(e) => setDelivery({ neighborhood: e.target.value })}>
              {(selectedCity?.neighborhoods ?? []).map((n) => (
                <option key={n.id} value={n.nameHe}>{pickField(n, "name", lang)}</option>
              ))}
            </select>
          </div>
          <div className="field vm:col-span-2">
            <label>{t.street}</label>
            <input className="input" value={state.delivery.street} onChange={(e) => setDelivery({ street: e.target.value })} />
          </div>
          <div className="flex gap-2.5 vm:gap-3.5 vm:col-span-2">
            <div className="field flex-1">
              <label>{t.house}</label>
              <input className="input" value={state.delivery.house} onChange={(e) => setDelivery({ house: e.target.value })} />
            </div>
            <div className="field flex-1">
              <label>{t.apt}</label>
              <input className="input" value={state.delivery.apt} onChange={(e) => setDelivery({ apt: e.target.value })} />
            </div>
            <div className="field flex-1">
              <label>{t.floor}</label>
              <input className="input" value={state.delivery.floor} onChange={(e) => setDelivery({ floor: e.target.value })} />
            </div>
          </div>
          <div className="field vm:col-span-2">
            <label>{t.addrNote}</label>
            <textarea className="input" value={state.delivery.note} onChange={(e) => setDelivery({ note: e.target.value })} />
          </div>
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
