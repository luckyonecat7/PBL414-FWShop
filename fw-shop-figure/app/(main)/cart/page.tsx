"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, DollarSign, X } from "lucide-react";
import { writeLog } from "../../../lib/logWriter";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    province: "",
    city: "",
    district: "",
    postal: "",
    street: "",
    details: "",
  });

  // Format harga Rupiah
  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  // Ambil cart dari localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(stored);
  }, []);

  // hitung subtotal, pajak & total
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleCheckout = () => {
    setShowAddressForm(true);
  };

  // ============================
  // 🔥 KIRIM ORDER KE API
  // ============================
  async function sendOrderToAPI() {
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart,
          address,
          total,
        }),
      });

      if (!res.ok) {
        alert("Gagal mengirim pesanan ke server.");
        return false;
      }

      alert("Pesanan berhasil dicatat di database!");
      return true;

    } catch (err) {
      console.error("Error:", err);
      alert("Terjadi kesalahan jaringan.");
      return false;
    }
  }

  // ============================
  // 🔥 HANDLE KONFIRMASI ALAMAT
  // ============================
  const handleConfirmAddress = async () => {
    const newErrors: Record<string, string> = {};

    if (!address.name.trim()) newErrors.name = "Nama wajib diisi.";
    if (!address.phone.trim()) newErrors.phone = "Nomor telepon wajib diisi.";
    if (!address.province.trim()) newErrors.province = "Provinsi wajib diisi.";
    if (!address.city.trim()) newErrors.city = "Kota wajib diisi.";
    if (!address.district.trim()) newErrors.district = "Kecamatan wajib diisi.";
    if (!address.postal.trim()) newErrors.postal = "Kode pos wajib diisi.";
    if (!address.street.trim()) newErrors.street = "Nama jalan wajib diisi.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    // 🔥 Kirim data ke API
    const success = await sendOrderToAPI();
    if (!success) return;

    // Clear cart setelah sukses
    localStorage.removeItem("cart");
    setCart([]);
    setShowAddressForm(false);
  };

  // hapus 1 item dari cart
  const handleRemoveItem = (itemId: number) => {
    const updated = cart.filter((i) => i.id !== itemId);
    localStorage.setItem("cart", JSON.stringify(updated));
    setCart(updated);

    writeLog({
      level: "INFO",
      action: "REMOVE_FROM_CART",
      ip: "127.0.0.1",
      user: "Anonymous",
      payload: { itemId },
    });
  };

  // Jika keranjang kosong
  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold text-text-light">Keranjang Anda Kosong</h1>
        <Link href="/shop" className="mt-4 inline-block text-accent hover:underline">
          Mulai Belanja
        </Link>
      </div>
    );
  }

  // =============================
  // RENDER HALAMAN CART
  // =============================

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-5xl font-extrabold mb-8 text-accent">Keranjang Belanja</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Daftar Item */}
        <div className="md:w-2/3 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center bg-secondary-dark p-4 rounded-xl shadow-lg"
            >
              <img src={item.imageUrl} className="w-20 h-20 rounded-md mr-4" />
              <div className="flex-grow">
                <h2 className="text-xl font-semibold text-text-light">{item.name}</h2>
                <p className="text-text-dim">Qty: {item.quantity}</p>
                <p className="text-lg font-bold text-green-400">{formatRupiah(item.price)}</p>
              </div>
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="p-2 text-text-dim hover:text-red-500"
              >
                <Trash2 />
              </button>
            </div>
          ))}
        </div>

        {/* Ringkasan */}
        <div className="md:w-1/3">
          <div className="bg-secondary-dark p-6 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-text-light border-b pb-2">
              Ringkasan Pesanan
            </h2>

            <div className="space-y-2 text-text-dim">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span>PPN (10%):</span>
                <span>{formatRupiah(tax)}</span>
              </div>

              <div className="flex justify-between font-bold text-xl text-text-light pt-2 border-t">
                <span>Total:</span>
                <span>{formatRupiah(total)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="mt-6 w-full py-3 bg-accent font-bold rounded-lg"
            >
              <DollarSign className="inline mr-2" />
              LANJUTKAN CHECKOUT
            </button>
          </div>
        </div>
      </div>

      {/* Modal Alamat */}
      {showAddressForm && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-secondary-dark p-8 rounded-xl w-full max-w-lg relative">
            <button
              onClick={() => setShowAddressForm(false)}
              className="absolute top-4 right-4 text-text-dim"
            >
              <X />
            </button>

            <h2 className="text-2xl font-bold text-accent mb-4">Alamat Pengiriman</h2>

            <div className="space-y-3">
              {Object.entries(address).map(([key, val]) => (
                <input
                  key={key}
                  type="text"
                  placeholder={key.toUpperCase()}
                  value={val}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      [key]: e.target.value,
                    })
                  }
                  className="w-full bg-primary-dark p-3 rounded-md border border-gray-600"
                />
              ))}
            </div>

            <button
              onClick={handleConfirmAddress}
              className="mt-6 w-full py-3 bg-accent font-bold rounded-lg"
            >
              Konfirmasi Pesanan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
