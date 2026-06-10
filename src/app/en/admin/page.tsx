import Link from "next/link";

const clients = [
  { name: "ABDEL CH", pack: "Premium", state: "New Mexico", amount: "199 USD", payment: "Under review", file: "Pending" },
  { name: "Client LLC", pack: "—", state: "—", amount: "—", payment: "Under review", file: "Pending" },
  { name: "Client LLC", pack: "—", state: "—", amount: "—", payment: "Under review", file: "Pending" },
];

export default function EnAdminPage() {
  return (
    <main className="min-h-screen bg-[#F3F7FB] text-[#111827]">
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-[32px] bg-white p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <div className="text-[28px] font-black tracking-[-0.04em]">
                <span className="text-[#123A63]">VEMO</span>
                <span className="text-[#F15A24]">TECH</span>
              </div>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.45em] text-[#64748B]">ADMIN</p>
            </div>

            <div className="flex gap-3">
              <Link
                href="/en/admin/packs"
                className="rounded-[14px] border border-[#DDE7F2] bg-white px-5 py-3 text-sm font-black text-[#111827]"
              >
                Pack settings
              </Link>
              <Link
                href="/en/admin/client-portal"
                className="rounded-[14px] bg-[#F15A24] px-5 py-3 text-sm font-black text-white"
              >
                Client portal
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              ["Files", "12"],
              ["Payments to review", "12"],
              ["In progress", "0"],
              ["Completed", "0"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[20px] border border-[#DDE7F2] bg-[#F8FAFC] p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#8AA0BC]">{label}</p>
                <p className="mt-5 text-3xl font-black text-[#123A63]">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-7 rounded-[32px] bg-white p-6">
          <div className="mb-5 grid gap-4 md:grid-cols-[1fr_380px]">
            <input
              placeholder="Search: LLC name, status..."
              className="h-14 rounded-[16px] border border-[#DDE7F2] bg-white px-5 text-sm font-black outline-none"
            />
            <select className="h-14 rounded-[16px] border border-[#DDE7F2] bg-white px-5 text-sm font-black outline-none">
              <option>All clients</option>
            </select>
          </div>

          <div className="overflow-hidden rounded-[22px] border border-[#DDE7F2]">
            <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1.2fr_1.2fr_150px] bg-[#F8FAFC] px-5 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-[#8AA0BC]">
              <span>Client / LLC</span>
              <span>Package</span>
              <span>State</span>
              <span>Amount</span>
              <span>Payment</span>
              <span>File</span>
              <span className="text-right">Actions</span>
            </div>

            <div className="divide-y divide-[#E6EDF5]">
              {clients.map((client, index) => (
                <div key={index} className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1.2fr_1.2fr_150px] items-center px-5 py-4 text-sm font-black text-[#123A63]">
                  <span>{client.name}</span>
                  <span>{client.pack}</span>
                  <span>{client.state}</span>
                  <span>{client.amount}</span>
                  <span>{client.payment}</span>
                  <span>{client.file}</span>
                  <div className="text-right">
                    <Link
                      href="/en/admin/client-portal"
                      className="inline-flex h-11 items-center justify-center rounded-[14px] bg-[#F15A24] px-7 text-sm font-black text-white"
                    >
                      Open
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
