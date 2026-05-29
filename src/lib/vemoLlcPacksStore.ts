import fs from "fs";
import path from "path";

export type VemoEditablePack = {
  id: "starter" | "standard" | "premium";
  label: string;
  description: string;
  recommended?: boolean;
  prices: Record<"Wyoming" | "New Mexico", number>;
  features: string[];
};

export type VemoEditablePacksPayload = {
  states: ["Wyoming", "New Mexico"];
  registeredAgentRenewal: Record<"Wyoming" | "New Mexico", number>;
  packs: VemoEditablePack[];
};

const DATA_FILE = path.join(process.cwd(), "data", "vemo-llc-packs.json");

export const DEFAULT_VEMO_PACKS_PAYLOAD: VemoEditablePacksPayload = {
  states: ["Wyoming", "New Mexico"],
  registeredAgentRenewal: {
    Wyoming: 25,
    "New Mexico": 35,
  },
  packs: [
    {
      id: "starter",
      label: "Starter",
      description: "L’essentiel pour créer votre LLC.",
      recommended: false,
      prices: {
        Wyoming: 300,
        "New Mexico": 250,
      },
      features: [
        "Documents de création LLC",
        "Frais de dépôt de l’État inclus",
        "Registered Agent offert la première année",
        "US Phone Number offert 3 mois",
      ],
    },
    {
      id: "standard",
      label: "Standard",
      description: "La formule recommandée pour démarrer sérieusement.",
      recommended: true,
      prices: {
        Wyoming: 600,
        "New Mexico": 550,
      },
      features: [
        "Documents de création LLC",
        "Frais de dépôt de l’État inclus",
        "Registered Agent offert la première année",
        "US Phone Number offert 3 mois",
        "Demande EIN",
        "Assistance Stripe + Mercury",
      ],
    },
    {
      id: "premium",
      label: "Premium",
      description: "L’offre complète pour structurer votre activité.",
      recommended: false,
      prices: {
        Wyoming: 1000,
        "New Mexico": 950,
      },
      features: [
        "Documents de création LLC",
        "Frais de dépôt de l’État inclus",
        "Registered Agent offert la première année",
        "US Phone Number offert 3 mois",
        "Demande EIN",
        "Assistance Stripe / PayPal",
        "Assistance Wise / Mercury / Payoneer",
        "Shopify offert 3 mois + nom de domaine 1 an",
      ],
    },
  ],
};

function cleanPayload(input: any): VemoEditablePacksPayload {
  const fallback = DEFAULT_VEMO_PACKS_PAYLOAD;

  const packs = Array.isArray(input?.packs) ? input.packs : fallback.packs;

  return {
    states: ["Wyoming", "New Mexico"],
    registeredAgentRenewal: {
      Wyoming: Number(input?.registeredAgentRenewal?.Wyoming ?? fallback.registeredAgentRenewal.Wyoming),
      "New Mexico": Number(
        input?.registeredAgentRenewal?.["New Mexico"] ?? fallback.registeredAgentRenewal["New Mexico"]
      ),
    },
    packs: packs.map((pack: any, index: number) => {
      const fallbackPack = fallback.packs[index] || fallback.packs[0];

      return {
        id: pack?.id || fallbackPack.id,
        label: String(pack?.label || fallbackPack.label),
        description: String(pack?.description || fallbackPack.description),
        recommended: Boolean(pack?.recommended),
        prices: {
          Wyoming: Number(pack?.prices?.Wyoming ?? fallbackPack.prices.Wyoming),
          "New Mexico": Number(pack?.prices?.["New Mexico"] ?? fallbackPack.prices["New Mexico"]),
        },
        features: Array.isArray(pack?.features)
          ? pack.features.map((x: any) => String(x).trim()).filter(Boolean)
          : fallbackPack.features,
      };
    }) as VemoEditablePack[],
  };
}

export function readVemoLlcPacksPayload(): VemoEditablePacksPayload {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_VEMO_PACKS_PAYLOAD, null, 2));
    }

    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return cleanPayload(JSON.parse(raw));
  } catch {
    return DEFAULT_VEMO_PACKS_PAYLOAD;
  }
}

export function writeVemoLlcPacksPayload(input: any): VemoEditablePacksPayload {
  const payload = cleanPayload(input);

  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2));

  return payload;
}
