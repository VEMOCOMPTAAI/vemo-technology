export type VemoLlcState = "Wyoming" | "New Mexico";

export type VemoLlcPackId = "starter" | "standard" | "premium";

export type VemoLlcPack = {
  id: VemoLlcPackId;
  label: string;
  description: string;
  recommended?: boolean;
  prices: Record<VemoLlcState, number>;
  features: string[];
};

export const REGISTERED_AGENT_RENEWAL_BY_STATE: Record<VemoLlcState, number> = {
  Wyoming: 25,
  "New Mexico": 35,
};

export const VEMO_LLC_PACKS: VemoLlcPack[] = [
  {
    id: "starter",
    label: "Starter",
    description: "L’essentiel pour créer votre LLC.",
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
];

export function getVemoLlcPackPrice(packId: VemoLlcPackId, state: VemoLlcState) {
  return VEMO_LLC_PACKS.find((pack) => pack.id === packId)?.prices[state] || 0;
}

export function getVemoLlcPackFeatures(packId: VemoLlcPackId, state: VemoLlcState) {
  const pack = VEMO_LLC_PACKS.find((item) => item.id === packId);
  if (!pack) return [];

  return [
    ...pack.features,
    `Renouvellement Registered Agent : ${REGISTERED_AGENT_RENEWAL_BY_STATE[state]} USD / an`,
  ];
}
