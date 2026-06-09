import type { ReactNode } from "react";
import AdminSessionBar from "@/components/admin/AdminSessionBar";

export default function EnAdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AdminSessionBar />
      {children}
    </>
  );
}
