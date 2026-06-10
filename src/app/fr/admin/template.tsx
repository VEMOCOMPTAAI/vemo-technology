import AdminPasswordGate from "@/components/admin/AdminPasswordGate";
import AdminOpenClientPortalRedirect from "@/components/admin/AdminOpenClientPortalRedirect";

export default function AdminTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminPasswordGate>
      <AdminOpenClientPortalRedirect />
      {children}
    </AdminPasswordGate>
  );
}
