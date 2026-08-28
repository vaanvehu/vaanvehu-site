"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLang } from "@/contexts/LangContext";
import { useCheckout } from "@/contexts/CheckoutContext";
import { T } from "@/lib/i18n";

export default function CustomerPage() {
  const { lang } = useLang();
  const { state, setCustomer } = useCheckout();
  const t = T[lang];
  const router = useRouter();
  const invalid = !(state.customer.name.trim() && state.customer.phone.trim());

  return (
    <section className="max-w-[1240px] mx-auto px-4 vm:px-10 pt-6 vm:pt-[34px] pb-16 vm:pb-20">
      <div className="max-w-[640px]">
        <Link href="/cart" className="btn btn-secondary text-[19px] py-2 px-5 inline-flex items-center gap-2.5 mb-4.5 no-underline">
          {t.backToCart}
        </Link>
        <h3 className="text-[26px] vm:text-[38px] mb-4 vm:mb-6.5">{t.customerTitle}</h3>
        <div className="flex flex-col gap-4.5 vm:gap-5">
          <div className="field">
            <label className="text-[17px] vm:text-[18px]">{t.fullName}</label>
            <input className="input text-[17px] vm:text-[18px] p-3.5" value={state.customer.name} onChange={(e) => setCustomer({ name: e.target.value })} />
          </div>
          <div className="field">
            <label className="text-[17px] vm:text-[18px]">{t.phone}</label>
            <input className="input text-[17px] vm:text-[18px] p-3.5" type="tel" value={state.customer.phone} onChange={(e) => setCustomer({ phone: e.target.value })} />
          </div>
          <div className="field">
            <label className="text-[17px] vm:text-[18px]">{t.email}</label>
            <input className="input text-[17px] vm:text-[18px] p-3.5" type="email" value={state.customer.email} onChange={(e) => setCustomer({ email: e.target.value })} />
          </div>
        </div>
        <button
          disabled={invalid}
          onClick={() => router.push("/checkout/fulfillment")}
          className="btn btn-primary mt-6 vm:mt-7 text-[18px] vm:text-[19px] py-3.5 px-8"
        >
          {t.cont}
        </button>
      </div>
    </section>
  );
}
