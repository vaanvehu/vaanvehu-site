export type PitamChoice = "with" | "without" | null;

export interface CartLine {
  key: string;
  kind: "set" | "product";
  name: string;
  image: string | null;
  unitPrice: number;
  qty: number;
  extrasText: string;
  pitamChoice: PitamChoice;
  note: string;
}
