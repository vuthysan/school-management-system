import { title } from "@/components/primitives";

export default function TransportPage() {
  return (
    <div>
      <h1 className={title()}>Transport Management</h1>
      <p className="mt-4 text-default-500">
        Manage routes, vehicles, and transport allocation.
      </p>
    </div>
  );
}
