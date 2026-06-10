import AdminOpenClientPortalRedirect from "@/components/admin/AdminOpenClientPortalRedirect";

export default function AdminTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminOpenClientPortalRedirect />
      {children}
    </>
  );
}
