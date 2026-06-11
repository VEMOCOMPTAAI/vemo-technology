export default function Page() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 440,
          border: "1px solid #E5EAF2",
          borderRadius: 24,
          padding: 32,
          background: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              background: "#F15A24",
              color: "#ffffff",
              display: "grid",
              placeItems: "center",
              fontWeight: 900,
            }}
          >
            V
          </div>

          <div>
            <div style={{ fontWeight: 900, color: "#123A63", fontSize: 22 }}>
              VEMO<span style={{ color: "#F15A24" }}>TECH</span>
            </div>
            <div style={{ color: "#8A98AD", fontSize: 10, letterSpacing: 4, fontWeight: 800 }}>
              ADMIN
            </div>
          </div>
        </div>

        <h1 style={{ margin: 0, color: "#111827", fontSize: 30, fontWeight: 900 }}>
          Accès administrateur
        </h1>

        <p style={{ marginTop: 12, marginBottom: 28, color: "#667085", fontWeight: 700 }}>
          Page admin temporaire stable.
        </p>

        <a
          href="/fr/admin/client-portal"
          style={{
            display: "flex",
            height: 54,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 16,
            background: "#F15A24",
            color: "#ffffff",
            textDecoration: "none",
            fontWeight: 900,
          }}
        >
          Entrer dans l’espace admin
        </a>
      </section>
    </main>
  );
}
