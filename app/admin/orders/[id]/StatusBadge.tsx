export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PAID: "bg-blue-100 text-blue-800",
    SHIPPED: "bg-purple-100 text-purple-800",
    COMPLETED: "bg-green-100 text-green-800",
  };

  return (
    <span className={`px-3 py-1 text-sm rounded-lg font-medium ${colors[status]}`}>
      {status}
    </span>
  );
}
