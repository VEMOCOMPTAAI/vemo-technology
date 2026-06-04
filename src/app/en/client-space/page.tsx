import { redirect } from "next/navigation";

export default async function EnglishClientSpaceAliasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const email = Array.isArray(params.email) ? params.email[0] || "" : params.email || "";
  redirect(`/en/client-portal${email ? `?email=${encodeURIComponent(email)}` : ""}`);
}
