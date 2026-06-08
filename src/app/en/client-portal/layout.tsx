import type { ReactNode } from "react";
import ClientPortalTopMenu from "@/components/client-portal/ClientPortalTopMenu";

export default function EnClientPortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <ClientPortalTopMenu lang="en" />
      <div className="pt-[110px]">{children}</div>
    </>
  );
}
