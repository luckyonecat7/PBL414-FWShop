'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingCart, Search, X } from 'lucide-react';
import { writeLog } from '../../../lib/logWriter';

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

// helper normalize (sama seperti admin)
const normalizeImageUrl = (u?: string) => {
  if (!u) return '/images/placeholder.png'; // fallback image in public
  const t = u.trim();
  if (t.startsWith('http://') || t.startsWith('https://')) return t;
  if (t.startsWith('/')) return t;
  return '/' + t;
};

async function getProducts() {
  const res = await fetch('/api/product', { cache: 'no-store' });
  return res.ok ? res.json() : [];
}

export default function ShopPage() {
  const [ALL_PRODUCTS, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    getProducts().then((data) => {
      if (Array.isArray(data)) {
        // normalize imageUrl inside client so next/image won't crash
        const normalized = data.map((p: any) => ({
          ...p,
          imageUrl: normalizeImageUrl(p.imageUrl),
        }));
        setProducts(normalized);
      } else {
        setProducts([]);
      }
    }).catch((err) => {
      console.error("Fetch products failed:", err);
      setProducts([]);
    });
  }, []);

  const categories = [
    { name: 'Semua', slug: 'all' },
    { name: 'Anime', slug: 'anime' },
    { name: 'Game', slug: 'game' },
    { name: 'Superhero', slug: 'superhero' },
  ];

  const filteredProducts = ALL_PRODUCTS.filter((p) => {
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  function addToCart(product: Product, quantity: number = 1) {
    if (typeof window === 'undefined') return;

    const isLoggedIn = localStorage.getItem('fwshop-logged-in');
    const user = JSON.parse(localStorage.getItem('fwshop-user') || 'null');
    const userType = localStorage.getItem('fwshop-user-type');

    if (!isLoggedIn || !user || userType === 'guest') {
      alert('Anda belum punya akun. Silakan daftar atau login terlebih dahulu.');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((i: any) => i.id === product.id);

    if (existing) existing.quantity += quantity;
    else cart.push({ ...product, quantity });

    localStorage.setItem('cart', JSON.stringify(cart));

    writeLog({
      level: "INFO",
      action: "ADD_TO_CART",
      ip: "127.0.0.1",
      user: user.email || "Unknown",
      payload: { productId: product.id, name: product.name, price: product.price, quantity },
    });

    alert(`${quantity}x ${product.name} ditambahkan ke keranjang!`);
  }

  function ProductCard({ product, onQuickViewClick }: { product: Product; onQuickViewClick: (p: Product) => void }) {
    const isOutOfStock = (product.stock ?? 0) === 0;
    const isLimited = !isOutOfStock && (product.stock ?? 0) <= 1;

    // ensure image string valid for next/image (already normalized on load)
    const src = normalizeImageUrl(product.imageUrl);

    return (
      <div className="bg-secondary-dark rounded-xl shadow-2xl overflow-hidden group transition duration-300 hover:shadow-accent/50 hover:scale-[1.03] border border-secondary-dark hover:border-accent">
        <div className="relative h-64 overflow-hidden">
          <Image src={src} alt={product.name} width={400} height={400} className="w-full h-full object-cover" />
          {isLimited && <span className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded z-10">Stok Terbatas</span>}
          {isOutOfStock && <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20"><span className="text-red-500 font-bold text-sm">STOK HABIS</span></div>}
          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickViewClick(product); }} className="absolute inset-x-0 bottom-0 h-12 bg-gray-700/90 text-white font-bold text-sm uppercase flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-full group-hover:translate-y-0 z-30">QUICK VIEW</button>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-bold text-white mb-0.5">{product.name}</h3>
          <p className="text-xs text-gray-400 mb-1 capitalize">{product.category}</p>

          <div className="flex justify-between items-center mt-0">
            <span className="text-sm font-semibold text-green-500">Rp {Number(product.price).toLocaleString('id-ID')}</span>
            <button onClick={() => addToCart(product, 1)} disabled={isOutOfStock} className={`p-3 rounded-full transition duration-300 ${isOutOfStock ? "bg-gray-700 cursor-not-allowed" : "bg-accent hover:bg-secondary-dark"}`}>
              <ShoppingCart size={20} className="text-black" />
            </button>
          </div>

          {isOutOfStock && <p className="text-xs text-right text-red-400 mt-1">Stok Habis</p>}
        </div>
      </div>
    );
  }

  function QuickViewModal({ product, onClose }: { product: Product; onClose: () => void }) {
    const [quantity, setQuantity] = useState(0);
    const isOutOfStock = (product.stock ?? 0) === 0;
    const src = normalizeImageUrl(product.imageUrl);

    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-secondary-dark relative rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto border border-accent" onClick={(e) => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-3 right-3 text-white p-2 bg-secondary-dark rounded-full"><X size={24} /></button>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 relative h-80 overflow-hidden">
              <Image src={src} alt={product.name} width={500} height={500} className="w-full h-full object-cover" />
            </div>
            <div className="md:w-1/2 p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-accent mb-1">{product.name}</h2>
                <p className="text-xs text-gray-400 mb-2 uppercase">{product.category}</p>
                <p className="text-gray-300 text-sm max-h-32 overflow-y-auto">{product.description}</p>
                <p className={`text-sm font-semibold ${isOutOfStock ? 'text-red-500' : 'text-green-500'}`}>Stok: {isOutOfStock ? 'Habis' : product.stock}</p>
              </div>

              <div>
                <span className="text-2xl font-bold text-green-500">Rp {Number(product.price).toLocaleString('id-ID')}</span>
                <div className="flex items-center gap-3 mt-4">
                  <button onClick={() => setQuantity(q => Math.max(q - 1, 0))} disabled={quantity <= 0} className="px-3 py-2 bg-gray-700 rounded-lg">-</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(q + 1, product.stock ?? 99))} disabled={isOutOfStock} className="px-3 py-2 bg-gray-700 rounded-lg">+</button>
                  <button onClick={() => { addToCart(product, quantity); onClose(); }} disabled={quantity === 0 || isOutOfStock} className="flex-grow py-3 bg-accent text-black font-bold rounded-lg">Tambah</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-accent">FIGURE COLLECTION</h1>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex flex-wrap gap-3">
          {categories.map(cat => (
            <button key={cat.slug} onClick={() => setSelectedCategory(cat.slug)} className={`px-4 py-2 rounded-lg font-semibold ${selectedCategory === cat.slug ? 'bg-accent text-black' : 'bg-secondary-dark text-white'}`}>{cat.name}</button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <input type="text" placeholder="Cari produk..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-4 py-2 w-full rounded-lg bg-white text-black pr-10" />
          <Search size={20} className="absolute right-3 top-2.5 text-gray-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.length > 0 ? filteredProducts.map(p => <ProductCard key={p.id} product={p} onQuickViewClick={setSelectedProduct} />) : <p className="text-center text-gray-400 col-span-full">Tidak ada produk ditemukan.</p>}
      </div>

      {selectedProduct && <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
}
