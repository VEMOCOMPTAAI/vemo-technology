from pathlib import Path

file = Path("src/app/app/dossiers/[id]/page.tsx")
txt = file.read_text(encoding="utf-8")

# Vérifie si le bloc cible existe
target = '''              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black">
                Paiement : {paymentLabel(dossier.payment_status)}
              </div>'''

replacement = '''              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black">
                Paiement : {paymentLabel(dossier.payment_status)}
              </div>

              {paymentLabel(dossier.payment_status) !== "Payé" ? (
                <button
                  type="button"
                  onClick={() => {
                    if (dossier?.id) {
                      window.location.href = `/paiement/${dossier.id}`;
                    }
                  }}
                  className="w-full rounded-2xl bg-white px-5 py-4 text-center font-black text-[#111a33] shadow-xl transition hover:bg-red-50"
                >
                  Payer maintenant
                </button>
              ) : (
                <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-black text-green-700">
                  Paiement confirmé
                </div>
              )}'''

if target not in txt:
    raise SystemExit("ERREUR: bloc Paiement introuvable dans la page client.")

txt = txt.replace(target, replacement)
file.write_text(txt, encoding="utf-8")
print("✅ Bouton paiement ajouté.")
