import { Suspense } from "react";
import PaymentSuccessPage from "@/components/PaymentSuccessPage";

export default function EnglishPaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <PaymentSuccessPage lang="en" />
    </Suspense>
  );
}