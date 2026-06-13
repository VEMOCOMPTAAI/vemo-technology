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
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 30 }}>
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
            <div style={{ fontWeight: 900, color: "#123A63", fontSize: 22, lineHeight: 1 }}>
              VEMO<span style={{ color: "#F15A24" }}>TECH</span>
            </div>
            <div style={{ color: "#8A98AD", fontSize: 10, letterSpacing: 4, fontWeight: 800, marginTop: 8 }}>
              ADMIN
            </div>
          </div>
        </div>

        <h1 style={{ margin: 0, color: "#111827", fontSize: 30, lineHeight: 1.15, fontWeight: 900 }}>
          Admin access
        </h1>

        <p style={{ marginTop: 12, marginBottom: 28, color: "#667085", fontWeight: 700, lineHeight: 1.6 }}>
          Sign in to manage client files.
        </p>

        <form method="POST" action="/en/admin/login">
          <label
            htmlFor="password"
            style={{
              display: "block",
              color: "#123A63",
              fontWeight: 900,
              fontSize: 13,
              marginBottom: 8,
            }}
          >
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            autoFocus
            required
            style={{
              width: "100%",
              height: 54,
              border: "1px solid #DDE5F0",
              borderRadius: 16,
              padding: "0 16px",
              fontSize: 16,
              outline: "none",
              boxSizing: "border-box",
              background: "#ffffff",
              color: "#111827",
            }}
          />

          <button
            type="submit"
            style={{
              marginTop: 22,
              width: "100%",
              height: 54,
              border: "none",
              borderRadius: 16,
              background: "#F15A24",
              color: "#ffffff",
              fontWeight: 900,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}
