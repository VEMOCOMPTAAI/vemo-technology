"use client";

type EnglishClientPortalContentProps = {
  email?: string;
};

export default function EnglishClientPortalContent({
  email = "",
}: EnglishClientPortalContentProps) {
  const clientEmail = email || "sheikh.abderrahim1@gmail.com";

  return (
    <main className="min-h-screen bg-[#F3F7FB] px-6 pb-10 text-[#111827]">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-[28px] bg-white p-8">
          <div className="text-[28px] font-black tracking-[-0.04em]">
            <span className="text-[#123A63]">VEMO</span>
            <span className="text-[#F15A24]">TECH</span>
          </div>

          <p className="mt-3 text-[10px] font-black uppercase tracking-[0.45em] text-[#8AA0BC]">
            Client portal
          </p>

          <h1 className="mt-8 text-3xl font-black tracking-[-0.04em]">
            My client space
          </h1>

          <p className="mt-4 text-sm font-black text-[#64748B]">
            {clientEmail}
          </p>
        </div>

        <section className="mt-6 rounded-[28px] bg-white p-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.45em] text-[#8AA0BC]">
              Progress
            </p>
            <h2 className="mt-4 text-2xl font-black tracking-[-0.04em]">
              My file status
            </h2>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <div className="rounded-[18px] border border-[#DDE7F2] bg-[#F8FAFC] p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#8AA0BC]">
                Payment
              </p>
              <p className="mt-4 text-sm font-black text-[#123A63]">
                Under review
              </p>
            </div>

            <div className="rounded-[18px] border border-[#DDE7F2] bg-[#F8FAFC] p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#8AA0BC]">
                File
              </p>
              <p className="mt-4 text-sm font-black text-[#123A63]">
                Pending
              </p>
            </div>

            <div className="rounded-[18px] border border-[#DDE7F2] bg-[#F8FAFC] p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#8AA0BC]">
                Current step
              </p>
              <p className="mt-4 text-sm font-black text-[#123A63]">
                File received
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div id="documents" className="rounded-[28px] bg-white p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.45em] text-[#8AA0BC]">
                  Documents
                </p>
                <h2 className="mt-4 text-2xl font-black tracking-[-0.04em]">
                  My documents
                </h2>
              </div>

              <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-[#F15A24] px-2 text-xs font-black text-white">
                0
              </span>
            </div>

            <div className="mt-7 rounded-[16px] border border-[#DDE7F2] bg-[#F8FAFC] px-5 py-4 text-sm font-black text-[#64748B]">
              No document available yet.
            </div>
          </div>

          <div id="messages" className="rounded-[28px] bg-white p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.45em] text-[#8AA0BC]">
                  Messages
                </p>
                <h2 className="mt-4 text-2xl font-black tracking-[-0.04em]">
                  VEMO messages
                </h2>
              </div>

              <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-[#F15A24] px-2 text-xs font-black text-white">
                0
              </span>
            </div>

            <div className="mt-7 rounded-[18px] border border-[#DDE7F2] bg-[#F8FAFC] p-5">
              <p className="text-sm font-black text-[#123A63]">
                Reply to VEMO
              </p>

              <input
                placeholder="Subject"
                className="mt-4 h-12 w-full rounded-[14px] border border-[#E5D8CF] bg-white px-4 text-sm font-bold outline-none"
              />

              <textarea
                placeholder="Your message..."
                className="mt-3 h-28 w-full resize-none rounded-[14px] border border-[#E5D8CF] bg-white px-4 py-4 text-sm font-bold outline-none"
              />

              <button className="mt-4 h-12 rounded-[14px] bg-[#F15A24] px-6 text-sm font-black text-white">
                Send
              </button>
            </div>

            <div className="mt-4 rounded-[14px] border border-[#DDE7F2] bg-[#F8FAFC] px-5 py-4 text-sm font-black text-[#64748B]">
              No message available.
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
