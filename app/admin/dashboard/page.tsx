'use client';
import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react"; // icon keranjang

export default function AdminDashboard() {
  const [role, setRole] = useState("");

  useEffect(() => {
    const cookieRole = document.cookie
      .split("; ")
      .find(row => row.startsWith("role="))
      ?.split("=")[1];

    setRole(cookieRole || "");
  }, []);

  if (role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1e1e1e] text-white">
        <h1 className="text-3xl font-bold">Akses Ditolak</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#1e1e1e] text-[#e0e1dd]">

      {/* Sidebar */}
      <aside className="w-64 bg-[#1b263b] p-6 border-r border-[#415a77]">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <ShoppingCart size={28} className="text-[#778da9]" />
          Admin Panel
        </h2>

        <ul className="space-y-4 text-[#e0e1dd]">
          <li className="hover:text-[#778da9] cursor-pointer">Dashboard</li>
          <li className="hover:text-[#778da9] cursor-pointer">Produk</li>
          <li className="hover:text-[#778da9] cursor-pointer">Stok</li>
          <li className="hover:text-[#778da9] cursor-pointer">Pengaturan</li>
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">Selamat Datang, Admin!</h1>
          <p className="text-[#778da9] mt-1">Kelola toko figur Anda dengan tampilan yang lebih modern.</p>
        </div>

        {/* Cards Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#1b263b] p-6 rounded-xl border border-[#415a77] shadow-lg">
            <h3 className="text-lg">Total Produk</h3>
            <p className="text-3xl font-bold text-[#778da9] mt-2">—</p>
          </div>

          <div className="bg-[#1b263b] p-6 rounded-xl border border-[#415a77] shadow-lg">
            <h3 className="text-lg">Stok Rendah</h3>
            <p className="text-3xl font-bold text-[#778da9] mt-2">—</p>
          </div>

          <div className="bg-[#1b263b] p-6 rounded-xl border border-[#415a77] shadow-lg">
            <h3 className="text-lg">Transaksi Hari Ini</h3>
            <p className="text-3xl font-bold text-[#778da9] mt-2">—</p>
          </div>
        </div>

        {/* Aksi Cepat */}
        <div className="bg-[#1b263b] p-8 rounded-xl border border-[#415a77] shadow max-w-md">
          <h2 className="text-xl font-semibold mb-4">Aksi Cepat</h2>
          <button
            onClick={() => updateStock(1, 50)}
            className="px-5 py-3 bg-[#778da9] hover:bg-[#415a77] text-[#1e1e1e] font-semibold rounded-lg transition w-full"
          >
            Ubah Stok Produk 1
          </button>
        </div>

      </main>
    </div>
  );
}

async function updateStock(productId: number, stock: number) {
  await fetch("/api/admin/update-stock", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, newStock: stock }),
  });
}
