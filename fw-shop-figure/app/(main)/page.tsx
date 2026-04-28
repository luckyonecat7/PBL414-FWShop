// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Gambar Background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition duration-1000 ease-in-out transform hover:scale-105"
          style={{ backgroundImage: `url('/images/background.jpeg')` }} // Ganti sesuai nama file kamu
        >
          {/* Lapisan Gelap Transparan */}
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>

        {/* Konten Utama */}
        <div className="relative z-10 text-center p-4 text-white">
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-wider mb-4">
            Welcome to FW SHOP
          </h1>
          <p className="text-lg mb-8">FIND YOUR FAVORITE FIGURE</p>

          <Link href="/shop" passHref>
            <button className="px-10 py-4 text-lg font-semibold uppercase tracking-wider bg-blue-700 hover:bg-transparent hover:text-blue-400 border-2 border-blue-700 transition duration-300 transform hover:scale-110 shadow-xl shadow-blue-700/30">
              SHOP NOW
            </button>
          </Link>
        </div>
      </div>

      {/* Bagian Konten Home Lain */}
      <div className="py-16 text-center">
        <h2 className="text-4xl font-bold text-blue-700 mb-4">
          The Latest Releases
        </h2>
        <p className="text-gray-400">
          Elegance meets artistry in our new arrivals.
        </p>
      </div>
    </main>
  );
}
