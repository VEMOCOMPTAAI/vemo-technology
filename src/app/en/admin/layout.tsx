import AdminPasswordGate from "@/components/admin/AdminPasswordGate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AdminPasswordGate>
      <main style={{ minHeight: "100vh", background: "#F4F7FA", fontFamily: "Arial, sans-serif", color: "#111827" }}>
        <header style={{ height: 86, background: "#ffffff", borderBottom: "1px solid #E5EAF2" }}>
          <div
            style={{
              maxWidth: 1232,
              margin: "0 auto",
              height: "100%",
              padding: "0 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#123A63", lineHeight: 1 }}>
                VEMO<span style={{ color: "#F15A24" }}>TECH</span>
              </div>
              <div style={{ marginTop: 7, fontSize: 10, letterSpacing: 4, color: "#8A98AD", fontWeight: 900 }}>
                ADMIN
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <a href="/en/admin/packs" style={{ height: 46, padding: "0 20px", border: "1px solid #DDE5F0", borderRadius: 15, background: "#ffffff", color: "#123A63", textDecoration: "none", display: "flex", alignItems: "center", fontWeight: 900, fontSize: 14 }}>
                Pack settings
              </a>

              <a href="/fr/admin" style={{ height: 46, padding: "0 18px", border: "1px solid #DDE5F0", borderRadius: 15, background: "#ffffff", color: "#123A63", textDecoration: "none", display: "flex", alignItems: "center", fontWeight: 900, fontSize: 14 }}>
                FR
              </a>

              <a href="/en/admin/login" style={{ height: 46, padding: "0 22px", borderRadius: 15, background: "#F15A24", color: "#ffffff", textDecoration: "none", display: "flex", alignItems: "center", fontWeight: 900, fontSize: 14 }}>
                Sign out
              </a>
            </div>
          </div>
        </header>

        {children}
      </main>
    </AdminPasswordGate>
  );
}
