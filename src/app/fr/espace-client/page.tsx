import ClientPortalWorkspace from "@/components/client-portal/ClientPortalWorkspace";

export const dynamic = "force-dynamic";

export default async function FrEspaceClientPage({
  searchParams,
}: {
  searchParams?: Promise<{ email?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const email = params.email || "";

  return <ClientPortalWorkspace lang="fr" email={email} />;
}
