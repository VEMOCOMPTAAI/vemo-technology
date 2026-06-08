import type { ReactNode } from "react";
import ClientPortalTopMenu from "@/components/client-portal/ClientPortalTopMenu";

export default function FrEspaceClientLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <ClientPortalTopMenu lang="fr" />
      <div className="pt-[110px]">{children}</div>
    </>
  );
}
