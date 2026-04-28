"use client";

import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    loadOrders();
  };

  const statusColors: any = {
    PENDING: "bg-yellow-500",
    PAID: "bg-blue-500",
    SHIPPED: "bg-purple-500",
    COMPLETED: "bg-green-500",
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">📦 Manajemen Pesanan</h1>

      {loading && <p>Loading...</p>}

      {!loading && orders.length === 0 && (
        <p className="text-gray-400">Belum ada pesanan.</p>
      )}

      <div className="space-y-6">
        {orders.map((o) => (
          <div
            key={o.id}
            className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Pesanan #{o.id}
              </h2>

              <span
                className={`px-3 py-1 rounded-full text-sm font-bold ${statusColors[o.status]}`}
              >
                {o.status}
              </span>
            </div>

            <div className="space-y-1 mb-4 text-gray-300">
              <p><b>Nama:</b> {o.customerName}</p>
              <p><b>Telepon:</b> {o.customerPhone}</p>

              <p className="mt-2 font-semibold">Alamat Pengiriman:</p>
              <pre className="bg-gray-900 p-3 rounded-lg text-gray-400 text-sm">
{JSON.stringify(JSON.parse(o.address), null, 2)}
              </pre>

              <p><b>Total:</b> Rp {o.totalAmount.toLocaleString("id-ID")}</p>
            </div>

            <div>
              <b>Barang:</b>
              <ul className="list-disc ml-6 text-gray-400">
                {o.items.map((i: any) => (
                  <li key={i.id}>
                    {i.name} — {i.quantity} pcs
                  </li>
                ))}
              </ul>
            </div>

            {/* STATUS DROPDOWN */}
            <div className="mt-5">
              <label className="block mb-1 text-gray-300 text-sm">
                Ubah Status Pesanan:
              </label>

              <select
                defaultValue={o.status}
                onChange={(e) => updateStatus(o.id, e.target.value)}
                className="bg-gray-700 p-2 rounded-md w-full border border-gray-600 text-white"
              >
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="SHIPPED">Shipped</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
