"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLang } from "@/contexts/LangContext";
import { useCheckout } from "@/contexts/CheckoutContext";
import { T } from "@/lib/i18n";

export default function FulfillmentPage() {
  const { lang } = useLang();
  const { setFulfillment } = useCheckout();
  const t = T[lang];
  const router = useRouter();

  const choose = (type: "pickup" | "delivery") => {
    setFulfillment(type);
    router.push(type === "pickup" ? "/checkout/pickup" : "/checkout/delivery");
  };

  return (
    <section className="max-w-[1240px] mx-auto px-4 vm:px-10 pt-6 vm:pt-[34px] pb-16 vm:pb-20">
      <div className="max-w-[760px]">
        <Link href="/checkout/customer" className="btn btn-secondary text-[19px] py-2 px-5 inline-flex items-center gap-2.5 mb-4.5 no-underline">
          {t.back}
        </Link>
        <h3 className="text-[26px] vm:text-[38px] mb-4 vm:mb-6.5">{t.fulfillTitle}</h3>
        <div className="grid grid-cols-1 vm:grid-cols-2 gap-3 vm:gap-5">
          <div onClick={() => choose("pickup")} className="card elev-sm cursor-pointer py-4.5 vm:py-8.5 px-5 text-center">
            <div className="card-title text-[24px] vm:text-[26px]">{t.pickup}</div>
          </div>
          <div onClick={() => choose("delivery")} className="card elev-sm cursor-pointer py-4.5 vm:py-8.5 px-5 text-center">
            <div className="card-title text-[24px] vm:text-[26px]">{t.delivery}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
