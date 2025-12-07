import { title } from "@/components/primitives";

export default function LibraryPage() {
  return (
    <div>
      <h1 className={title()}>Library Management</h1>
      <p className="mt-4 text-default-500">
        Manage books, borrowing, and inventory.
      </p>
    </div>
  );
}
