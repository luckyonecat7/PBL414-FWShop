"use client";
import { useState } from "react";

export default function StatusSelector({ id, currentStatus }: { id: number; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const statuses = ["PENDING", "PAID", "SHIPPED", "COMPLETED"];

  async function updateStatus(newStatus: string) {
    setLoading(true);
    setStatus(newStatus);

    await fetch(`/api/orders/${id}`, {      // <-- route DISAMAKAN
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    setLoading(false);
  }

  return (
    <select
      className="p-2 border rounded-lg"
      value={status}
      disabled={loading}
      onChange={(e) => updateStatus(e.target.value)}
    >
      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}
