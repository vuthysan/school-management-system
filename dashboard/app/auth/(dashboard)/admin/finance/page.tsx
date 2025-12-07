import { title } from "@/components/primitives";

export default function FinancePage() {
  return (
    <div>
      <h1 className={title()}>Finance Management</h1>
      <p className="mt-4 text-default-500">
        Manage fees, invoices, and payments.
      </p>
    </div>
  );
}
