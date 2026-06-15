const packs = [
  ["New Mexico Starter", "129 USD", "New Mexico LLC + formation documents."],
  ["New Mexico Standard", "149 USD", "New Mexico LLC + EIN + banking guidance."],
  ["New Mexico Premium", "199 USD", "New Mexico LLC + EIN + full tracking + priority support."],
  ["Wyoming Starter", "149 USD", "Wyoming LLC + formation documents."],
  ["Wyoming Standard", "179 USD", "Wyoming LLC + EIN + banking guidance."],
  ["Wyoming Premium", "229 USD", "Wyoming LLC + EIN + full tracking + priority support."],
];

export default function Page() {
  return (
    <main style={{ minHeight: "100vh", background: "#F4F7FA", fontFamily: "Arial, sans-serif", color: "#111827" }}>
      <header style={{ height: 86, background: "#ffffff", borderBottom: "1px solid #E5EAF2" }}>
        <div style={{ maxWidth: 1232, margin: "0 auto", height: "100%", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#123A63" }}>VEMO<span style={{ color: "#F15A24" }}>TECH</span></div>
            <div style={{ marginTop: 7, fontSize: 10, letterSpacing: 4, color: "#8A98AD", fontWeight: 900 }}>ADMIN</div>
          </div>
          <a href="/en/admin" style={{ height: 46, padding: "0 20px", borderRadius: 15, background: "#F15A24", color: "#ffffff", textDecoration: "none", display: "flex", alignItems: "center", fontWeight: 900 }}>Back to admin</a>
        </div>
      </header>

      <section style={{ maxWidth: 1232, margin: "0 auto", padding: "34px 24px" }}>
        <div style={{ background: "#ffffff", border: "1px solid #E5EAF2", borderRadius: 32, padding: 32 }}>
          <h1 style={{ margin: 0, fontSize: 34, fontWeight: 900 }}>Pack settings</h1>
          <p style={{ marginTop: 10, marginBottom: 26, color: "#667085", fontWeight: 700 }}>Separate packs for New Mexico and Wyoming.</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
            {packs.map(([name, price, desc]) => (
              <div key={name} style={{ border: "1px solid #DDE5F0", borderRadius: 22, padding: 22, background: "#ffffff" }}>
                <div style={{ color: "#123A63", fontWeight: 900, fontSize: 18 }}>{name}</div>
                <div style={{ marginTop: 14, color: "#F15A24", fontWeight: 900, fontSize: 28 }}>{price}</div>
                <p style={{ marginTop: 12, color: "#667085", fontWeight: 700, lineHeight: 1.5 }}>{desc}</p>
                <button style={{ marginTop: 14, height: 44, padding: "0 18px", border: "none", borderRadius: 14, background: "#F15A24", color: "#ffffff", fontWeight: 900 }}>Edit</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
