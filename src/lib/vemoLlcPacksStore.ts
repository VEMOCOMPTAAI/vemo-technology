import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "vemo-llc-packs.json");

const DEFAULT_PAYLOAD = {
  states: ["New Mexico", "Wyoming"],
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
        "New Mexico": 129,
        Wyoming: 179,
      },
      features: [
        "LLC formation documents",
        "Frais de dépôt de l’État inclus",
        "Registered Agent offert la première année",
        "US phone number included for 3 months",
      ],
    },
    {
      id: "standard",
      label: "Standard",
      description: "La formule recommandée pour démarrer sérieusement.",
      recommended: true,
      prices: {
        "New Mexico": 149,
        Wyoming: 199,
      },
      features: [
        "LLC formation documents",
        "Frais de dépôt de l’État inclus",
        "Registered Agent offert la première année",
        "US phone number included for 3 months",
        "EIN application",
        "Assistance Stripe + Mercury",
      ],
    },
    {
      id: "premium",
      label: "Premium",
      description: "L’offre complète pour structurer votre activité.",
      recommended: false,
      prices: {
        "New Mexico": 199,
        Wyoming: 249,
      },
      features: [
        "LLC formation documents",
        "Frais de dépôt de l’État inclus",
        "Registered Agent offert la première année",
        "US phone number included for 3 months",
        "EIN application",
        "Stripe / PayPal assistance",
        "Wise / Mercury / Payoneer assistance",
        "Shopify included for 3 months + 1-year domain name",
      ],
    },
  ],
};

export function readVemoLlcPacksPayload() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_PAYLOAD, null, 2));
    }

    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

    return {
      states: Array.isArray(parsed.states) ? parsed.states : DEFAULT_PAYLOAD.states,
      registeredAgentRenewal: parsed.registeredAgentRenewal || DEFAULT_PAYLOAD.registeredAgentRenewal,
      packs: Array.isArray(parsed.packs) ? parsed.packs : DEFAULT_PAYLOAD.packs,
    };
  } catch {
    return DEFAULT_PAYLOAD;
  }
}

export function writeVemoLlcPacksPayload(payload: any) {
  const cleanPayload = {
    states: ["New Mexico", "Wyoming"],
    registeredAgentRenewal: {
      Wyoming: Number(payload?.registeredAgentRenewal?.Wyoming ?? 25),
      "New Mexico": Number(payload?.registeredAgentRenewal?.["New Mexico"] ?? 35),
    },
    packs: Array.isArray(payload?.packs) ? payload.packs : DEFAULT_PAYLOAD.packs,
  };

  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(cleanPayload, null, 2));

  return cleanPayload;
}
