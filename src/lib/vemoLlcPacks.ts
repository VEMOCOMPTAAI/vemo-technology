export type VemoLlcPlanId = "starter" | "standard" | "premium";
export type VemoLlcState = "New Mexico" | "Wyoming";

export type VemoLlcPack = {
  id: VemoLlcPlanId;
  label: string;
  recommended?: boolean;
  shortDescription: string;
  prices: Record<VemoLlcState, number>;
  features: string[];
};

export function registeredAgentRenewalAmount(state: string) {
  return state === "Wyoming" ? 25 : 35;
}

export function registeredAgentRenewalLabel(state: string) {
  return state === "Wyoming"
    ? "Renouvellement Registered Agent : 25 USD / an"
    : "Renouvellement Registered Agent : 35 USD / an";
}

export const VEMO_LLC_PACKS: VemoLlcPack[] = [
  {
    id: "starter",
    label: "Starter",
    shortDescription: "Pour démarrer simplement votre LLC.",
    prices: {
      "New Mexico": 129,
      "Wyoming": 179
    },
    features: [
      "Documents de création LLC",
      "Frais de dépôt de l’État inclus",
      "Registered Agent offert la première année",
      "REGISTERED_AGENT_RENEWAL",
      "US Phone Number offert 3 mois"
    ]
  },
  {
    id: "standard",
    label: "Standard",
    recommended: true,
    shortDescription: "La formule recommandée pour la plupart des non-résidents.",
    prices: {
      "New Mexico": 149,
      "Wyoming": 199
    },
    features: [
      "Documents de création LLC",
      "Frais de dépôt de l’État inclus",
      "Registered Agent offert la première année",
      "REGISTERED_AGENT_RENEWAL",
      "US Phone Number offert 3 mois",
      "Demande EIN",
      "Assistance Stripe + Mercury"
    ]
  },
  {
    id: "premium",
    label: "Premium",
    shortDescription: "Accompagnement complet avec paiements, outils et présence en ligne.",
    prices: {
      "New Mexico": 199,
      "Wyoming": 249
    },
    features: [
      "Documents de création LLC",
      "Frais de dépôt de l’État inclus",
      "Registered Agent offert la première année",
      "REGISTERED_AGENT_RENEWAL",
      "US Phone Number offert 3 mois",
      "Demande EIN",
      "Assistance Stripe / PayPal",
      "Assistance Wise / Mercury / Payoneer",
      "Shopify offert 3 mois + nom de domaine 1 an"
    ]
  }
];

export function getVemoLlcPack(id: string) {
  return VEMO_LLC_PACKS.find((pack) => pack.id === id) || VEMO_LLC_PACKS[1];
}

export function getVemoLlcPackPrice(id: string, state: string) {
  const pack = getVemoLlcPack(id);
  return pack.prices[state as VemoLlcState] || pack.prices["New Mexico"];
}

export function getVemoLlcPackFeatures(id: string, state: string) {
  const pack = getVemoLlcPack(id);

  return pack.features.map((feature) => {
    if (feature === "REGISTERED_AGENT_RENEWAL") {
      return registeredAgentRenewalLabel(state);
    }

    return feature;
  });
}
