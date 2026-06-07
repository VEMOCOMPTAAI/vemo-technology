"use client";

import { useEffect } from "react";

const dictionary: Record<string, string> = {
  "Documents de création LLC": "LLC formation documents",
  "Documents de creation LLC": "LLC formation documents",
  "Demande EIN": "EIN application",
  "US Phone Number offert 3 mois": "US phone number included for 3 months",
  "US Phone Number included for 3 mois": "US phone number included for 3 months",
  "Shopify offert 3 mois + nom de domaine 1 an": "Shopify included for 3 months + 1-year domain name",
  "Shopify offert 3 mois + domaine 1 an": "Shopify included for 3 months + 1-year domain name",
  "Shopify included for 3 mois + nom de domaine 1 an": "Shopify included for 3 months + 1-year domain name",
  "Shopify included for 3 months + nom de domaine 1 an": "Shopify included for 3 months + 1-year domain name",
  "Assistance Stripe / PayPal": "Stripe / PayPal assistance",
  "Assistance Wise / Mercury / Payoneer": "Wise / Mercury / Payoneer assistance",

  "COUNTRY DU MEMBRE": "MEMBER COUNTRY",
  "COUNTRY ADRESSE": "ADDRESS COUNTRY",
  "COUNTRY DU CLIENT": "CLIENT COUNTRY",
  "Member et Manager": "Member and Manager",
};

function translateText(value: string) {
  let result = value;

  for (const [fr, en] of Object.entries(dictionary)) {
    result = result.split(fr).join(en);
  }

  return result;
}

function walkAndTranslate(root: ParentNode) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    nodes.push(node);
  }

  for (const node of nodes) {
    const next = translateText(node.nodeValue || "");
    if (next !== node.nodeValue) {
      node.nodeValue = next;
    }
  }
}

export default function EnglishDomTranslator() {
  useEffect(() => {
    const run = () => walkAndTranslate(document.body);

    run();

    const observer = new MutationObserver(() => {
      run();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    const interval = window.setInterval(run, 300);

    return () => {
      observer.disconnect();
      window.clearInterval(interval);
    };
  }, []);

  return null;
}
