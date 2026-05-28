"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestSupabasePage() {
  const [message, setMessage] = useState("");

  async function testInsert() {
    setMessage("Test en cours...");

    const { data, error } = await supabase
      .from("llc_orders")
      .insert([
        {
          language: "fr",
          status: "new",
          package_name: "Standard",
          entity_type: "LLC",
          jurisdiction: "New Mexico",
          company_name: "TEST SITE VEMO",
          designator: "LLC",
          full_company_name: "TEST SITE VEMO LLC",
          first_name: "Test",
          last_name: "Site",
          email: "test-site@example.com",
          phone_country: "MA",
          phone_number: "600000000",
          phone_e164: "+212600000000",
          residence_country: "MA",
          service_fee: 349,
          state_fee: 50,
          options_fee: 0,
          total_amount: 399,
          currency: "USD",
          payment_status: "pending",
        },
      ])
      .select();

    if (error) {
      console.error(error);
      setMessage("ERREUR : " + error.message);
      return;
    }

    setMessage("OK : ligne créée dans Supabase. ID = " + data?.[0]?.id);
  }

  return (
    <main className="min-h-screen bg-[#fff7f1] p-10 text-[#111a33]">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-black">Test Supabase</h1>

        <p className="mt-4 text-slate-600">
          Clique sur le bouton pour créer une ligne test dans la table llc_orders.
        </p>

        <button
          onClick={testInsert}
          className="mt-6 rounded-2xl bg-[#9F1239] px-6 py-4 font-black text-white"
        >
          Tester insertion Supabase
        </button>

        {message && (
          <pre className="mt-6 whitespace-pre-wrap rounded-2xl bg-slate-100 p-4 text-sm font-bold">
            {message}
          </pre>
        )}
      </div>
    </main>
  );
}


