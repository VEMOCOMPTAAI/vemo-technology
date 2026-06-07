import ClientPortalTopMenu from "@/components/client-portal/ClientPortalTopMenu";

export default function EnClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ClientPortalTopMenu lang="en" />
      <div className="pt-[110px]">{children}</div>
    </>
  );
}
