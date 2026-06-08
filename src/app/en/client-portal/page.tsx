import EnglishClientPortalContent from "./EnglishClientPortalContent";

export const dynamic = "force-dynamic";

export default async function EnClientPortalPage({
  searchParams,
}: {
  searchParams?: Promise<{ email?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const email = params.email || "";

  return <EnglishClientPortalContent email={email} />;
}
