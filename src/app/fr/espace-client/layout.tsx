import ClientPortalTopMenu from "@/components/client-portal/ClientPortalTopMenu";

export default function FrClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ClientPortalTopMenu lang="fr" />
      <div className="pt-[110px]">{children}</div>
    </>
  );
}
