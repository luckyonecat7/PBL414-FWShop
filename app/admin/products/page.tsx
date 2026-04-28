"use client";
import { useState, useEffect } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  description: string;
  size?: string | null;
  stock?: number | null;
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    imageUrl: "",
    description: "",
    size: "",
    stock: "",
  });

  const normalizeImageUrl = (u: string) => {
    if (!u) return "";
    const trimmed = u.trim();
    if (trimmed.startsWith("http") || trimmed.startsWith("/")) return trimmed;
    return "/" + trimmed;
  };

  const loadProducts = async () => {
    try {
      const res = await fetch("/api/product");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    }
  };

  const createProduct = async () => {
    if (!form.name || !form.price || !form.category || !form.imageUrl || !form.description)
      return alert("Lengkapi semua field!");

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock) || 0,
      size: form.size || null,
      imageUrl: normalizeImageUrl(form.imageUrl),
    };

    try {
      const res = await fetch("/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) return alert("Gagal membuat produk");

      setForm({ name: "", price: "", category: "", imageUrl: "", description: "", size: "", stock: "" });
      loadProducts();
      alert("Produk berhasil dibuat!");
    } catch {
      alert("Server error");
    }
  };

  const startEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      price: String(p.price),
      category: p.category,
      imageUrl: p.imageUrl,
      description: p.description,
      size: p.size || "",
      stock: p.stock?.toString() || "0",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateProduct = async () => {
    if (!editingProduct) return;

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock) || 0,
      size: form.size || null,
      imageUrl: normalizeImageUrl(form.imageUrl),
    };

    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) return alert("Gagal update");

      setEditingProduct(null);
      setForm({ name: "", price: "", category: "", imageUrl: "", description: "", size: "", stock: "" });
      loadProducts();
      alert("Berhasil update");
    } catch {
      alert("Server error");
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Hapus produk ini?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) loadProducts();
    } catch {
      alert("Server error");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d1b2a] text-[#e0e1dd] px-10 py-12">

      {/* HEADER */}
      <h1 className="text-4xl font-bold tracking-wide mb-10 text-center drop-shadow">
        📦 Manajemen Produk
      </h1>

      {/* FORM */}
      <div className="bg-[#1b263b] max-w-5xl w-full mx-auto p-8 rounded-2xl border border-[#415a77] shadow-lg">

        <h2 className="text-2xl font-semibold mb-6">
          {editingProduct ? "✏ Edit Produk" : "➕ Tambah Produk"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {[
            { label: "Nama Produk", key: "name" },
            { label: "Harga", key: "price" },
            { label: "Stok", key: "stock" },
            { label: "Ukuran (opsional)", key: "size" },
          ].map((i) => (
            <div key={i.key}>
              <label>{i.label}</label>
              <input
                className="w-full mt-1 p-2 rounded bg-[#415a77] outline-none"
                value={(form as any)[i.key]}
                onChange={(e) => setForm({ ...form, [i.key]: e.target.value })}
              />
            </div>
          ))}

          <div>
            <label>Kategori</label>
            <select
              className="w-full mt-1 p-2 rounded bg-[#415a77]"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Pilih Kategori</option>
              <option value="anime">Anime</option>
              <option value="game">Game</option>
              <option value="superhero">Superhero</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label>Image URL</label>
            <input
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full mt-1 p-2 rounded bg-[#415a77]"
            />
          </div>

          <div className="md:col-span-2">
            <label>Deskripsi</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full mt-1 p-2 rounded bg-[#415a77]"
            />
          </div>
        </div>

        <div className="mt-7 flex gap-3">
          {editingProduct ? (
            <>
              <button onClick={updateProduct} className="px-5 py-2 rounded bg-[#415a77] hover:bg-[#778da9]">
                💾 Simpan
              </button>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setForm({ name: "", price: "", category: "", imageUrl: "", description: "", size: "", stock: "" });
                }}
                className="px-5 py-2 rounded bg-gray-600 hover:bg-gray-500"
              >
                ✖ Batal
              </button>
            </>
          ) : (
            <button onClick={createProduct} className="px-5 py-2 rounded bg-[#415a77] hover:bg-[#778da9]">
              ➕ Tambah
            </button>
          )}
        </div>
      </div>

      {/* LIST PRODUK */}
      <h2 className="text-2xl font-semibold mt-14 mb-6 text-center">📄 Daftar Produk</h2>

      <div className="max-w-5xl mx-auto space-y-4">
        {products.length === 0 && <p className="text-center opacity-50">Belum ada produk.</p>}

        {products.map((p) => (
          <div key={p.id}
            className="bg-[#1b263b] p-5 rounded-xl border border-[#415a77] flex justify-between items-center hover:bg-[#223247] transition shadow">
            <div>
              <h3 className="font-bold text-xl">{p.name}</h3>
              <p className="text-sm text-[#8da9c4]">
                {p.category} • Rp {p.price.toLocaleString("id-ID")} • {p.stock ?? 0} pcs
              </p>
            </div>

            <div className="flex gap-2">
              <button onClick={() => startEdit(p)} className="px-3 py-1 rounded bg-[#415a77] hover:bg-[#778da9]">
                Edit
              </button>
              <button onClick={() => deleteProduct(p.id)} className="px-3 py-1 rounded bg-red-600 hover:bg-red-500">
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
