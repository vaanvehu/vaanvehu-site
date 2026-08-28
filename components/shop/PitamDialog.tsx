"use client";

import { useState } from "react";
import { useLang } from "@/contexts/LangContext";
import { T, PITAM_TEXT, money } from "@/lib/i18n";

export interface PitamUpgradeOption {
  id: string;
  name: string;
  price: number;
}

interface Props {
  itemName: string;
  pitamAsk: boolean;
  upgrades?: PitamUpgradeOption[];
  basePrice?: number;
  onClose: () => void;
  onConfirm: (result: { pitamChoice: "with" | "without" | null; note: string; upgradeIds: string[] }) => void;
}

// Mount this component only while the dialog should be visible (e.g. `{dialogOpen && <PitamDialog .../>}`)
// — mounting fresh is what resets its internal state for each new item, no effect needed.
export default function PitamDialog({ itemName, pitamAsk, upgrades = [], basePrice = 0, onClose, onConfirm }: Props) {
  const { lang } = useLang();
  const t = T[lang];
  const [pitamChoice, setPitamChoice] = useState<"with" | "without" | null>(null);
  const [noteShown, setNoteShown] = useState(false);
  const [note, setNote] = useState("");
  const [selectedUpgrades, setSelectedUpgrades] = useState<Record<string, boolean>>({});

  const invalid = pitamAsk && !pitamChoice;
  const upgradeIds = Object.keys(selectedUpgrades).filter((id) => selectedUpgrades[id]);
  const upgradeTotal = upgrades.filter((u) => selectedUpgrades[u.id]).reduce((a, u) => a + u.price, 0);

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-title">{t.pitamTitle}</div>
        <div className="dialog-body flex flex-col gap-0">
          <p className="text-[18px] opacity-85 mt-1.5 mb-5">{itemName}</p>

          {pitamAsk && (
            <div className="flex gap-3 mb-4">
              <button onClick={() => setPitamChoice("with")} className={`btn ${pitamChoice === "with" ? "btn-primary" : "btn-secondary"} flex-1 justify-center text-[18px] py-3.5`}>
                {t.pitamWith}
              </button>
              <button onClick={() => setPitamChoice("without")} className={`btn ${pitamChoice === "without" ? "btn-primary" : "btn-secondary"} flex-1 justify-center text-[18px] py-3.5`}>
                {t.pitamWithout}
              </button>
            </div>
          )}

          {upgrades.length > 0 && (
            <>
              <div className="font-[var(--font-heading)] text-[22px] mt-2.5 mb-2">{t.upgradesTitle}</div>
              <div className="flex flex-col gap-2 mb-3.5">
                {upgrades.map((u) => {
                  const checked = !!selectedUpgrades[u.id];
                  return (
                    <div
                      key={u.id}
                      onClick={() => setSelectedUpgrades((s) => ({ ...s, [u.id]: !s[u.id] }))}
                      className="cursor-pointer flex items-center gap-3 text-[18px]"
                    >
                      <span
                        className="w-5 h-5 rounded-[3px] flex-none border"
                        style={{ borderColor: "var(--color-accent-700)", background: checked ? "var(--color-accent-700)" : "transparent" }}
                      />
                      <span className="flex-1">{u.name}</span>
                      <span style={{ color: "var(--color-accent-700)" }}>+{u.price}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between mb-4 font-[var(--font-heading)]">
                <span className="text-[18px]">{t.setTotal}</span>
                <span className="text-[24px] font-semibold" style={{ color: "var(--color-accent-700)" }}>
                  {money(basePrice + upgradeTotal, lang)}
                </span>
              </div>
            </>
          )}

          <button onClick={() => setNoteShown((v) => !v)} className={`btn ${noteShown ? "btn-primary" : "btn-ghost"} text-[16px] py-2.5 px-4 mb-3`}>
            {t.pitamNoteBtn}
          </button>
          {noteShown && (
            <textarea className="input mb-3" value={note} onChange={(e) => setNote(e.target.value)} />
          )}
        </div>
        <div className="dialog-actions">
          <button onClick={onClose} className="btn btn-ghost text-[17px] py-3 px-5">{t.cancel}</button>
          <button
            disabled={invalid}
            onClick={() => onConfirm({ pitamChoice: pitamAsk ? pitamChoice : null, note, upgradeIds })}
            className="btn btn-primary text-[17px] py-3 px-6"
          >
            {t.pitamConfirm}
          </button>
        </div>
      </div>
    </div>
  );
}

export function pitamExtrasText(lang: "he" | "en" | "fr", pitamChoice: "with" | "without" | null, note: string): string {
  const parts: string[] = [];
  if (pitamChoice) parts.push(PITAM_TEXT[lang][pitamChoice]);
  if (note.trim()) parts.push(note.trim());
  return parts.join(" · ");
}
