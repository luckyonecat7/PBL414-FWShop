"use client";

import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";

const topColor = "bg-[#1B263B]";
const bottomColor = "bg-[#1e1e1e]";

export default function AboutPage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState<any[]>([]);

  // Fetch comments
  const fetchComments = async () => {
    try {
      const res = await fetch("/api/comments");
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Submit comment
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!name || !message) {
      alert("Semua field wajib diisi!");
      return;
    }

    try {
      await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, message }),
      });

      setName("");
      setMessage("");
      fetchComments();
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-white">
      {/* BAGIAN ATAS */}
      <section
        className={`${topColor} flex flex-col items-center justify-center text-center flex-grow py-20 px-6`}
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-8 tracking-wide">
          FW SHOP’s STORY
        </h1>

        <div className="max-w-3xl space-y-8 text-lg leading-relaxed text-gray-300">
          <p>
            FW SHOP berdiri pada tahun 2025 dengan tujuan sederhana — menjadi
            tempat bagi para penggemar untuk menemukan figure menarik dan
            berkualitas tinggi.
          </p>

          <p>
            Kami percaya bahwa setiap figure bukan hanya koleksi, tetapi bentuk
            ekspresi dari karakter dan kisah yang menginspirasi. Karena itu,
            kami selalu berusaha menghadirkan produk original dengan detail
            terbaik.
          </p>

          <p>
            Dengan semangat kolektor sejati, FW SHOP berkomitmen untuk menjaga
            keaslian setiap item dan memberikan pengalaman belanja yang aman
            serta menyenangkan.
          </p>

          <blockquote className="italic text-gray-400 mt-10">
            “Kami membuat website ini sebagai bagian dari tugas PBL kami — tapi
            lebih dari itu, kami ingin menciptakan ruang bagi para pecinta
            figure untuk berbagi minat yang sama.”
          </blockquote>
        </div>
      </section>

      {/* SECTION COMMENT */}
      <section className="bg-[#111] py-16 px-6 text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Share Your Thoughts 💬
          </h2>

          <p className="text-center text-gray-400 mb-10">
            Kami percaya setiap kolektor punya cerita. Tinggalkan komentar,
            pengalaman, atau kesan kamu tentang FW SHOP di bawah ini — kami akan
            senang mendengarnya!
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-10">
            <input
              type="text"
              placeholder="Nama kamu..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded bg-[#1e1e1e] border border-gray-700 focus:outline-none"
            />

            <textarea
              placeholder="Tulis komentar kamu..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 rounded bg-[#1e1e1e] border border-gray-700 focus:outline-none"
              rows={4}
            />

            <button
              type="submit"
              className="bg-accent px-6 py-2 rounded hover:opacity-80 transition"
            >
              Kirim
            </button>
          </form>

          {/* LIST COMMENT */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-400 text-center">
                Belum ada komentar.
              </p>
            ) : (
              comments.map((c: any) => (
                <div
                  key={c.id}
                  className="bg-[#1e1e1e] p-4 rounded border border-gray-700"
                >
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-gray-300">{c.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(c.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* BAGIAN BAWAH */}
      <footer className={`${bottomColor} text-white py-12 px-10`}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Kontak */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <div className="space-y-4 text-gray-200">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-accent flex-shrink-0 mt-1" />
                <p>
                  <span className="font-semibold">
                    Alamat Toko (Pusat):
                  </span>
                  <br />
                  Jl. Kolektor Sejati No. 45, Blok A-10, Kota Batam, 40292
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={20} className="text-accent" />
                <span>+62 812-3456-7890 (Layanan Pelanggan)</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={20} className="text-accent" />
                <span>support@fwshop.com (Email Dukungan)</span>
              </div>
            </div>
          </div>

          {/* Sosial Media */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Follow Us</h2>
            <p className="text-gray-200 mb-6">
              Temukan kami di media sosial:
            </p>
            <div className="flex gap-6">
              <a
                href="https://www.instagram.com/fwshop_fig"
                target="_blank"
                className="opacity-70 hover:opacity-100 transition duration-300"
              >
                <Image
                  src="/images/ig1.png"
                  alt="Instagram"
                  width={45}
                  height={45}
                  className="rounded-full"
                />
              </a>

              <a
                href="https://www.tiktok.com/@fwshop_figure"
                target="_blank"
                className="opacity-70 hover:opacity-100 transition duration-300"
              >
                <Image
                  src="/images/tt1.png"
                  alt="TikTok"
                  width={45}
                  height={45}
                  className="rounded-full"
                />
              </a>

              <a
                href="https://www.facebook.com/fwshop.official"
                target="_blank"
                className="opacity-70 hover:opacity-100 transition duration-300"
              >
                <Image
                  src="/images/fb1.png"
                  alt="Facebook"
                  width={45}
                  height={45}
                  className="rounded-full"
                />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}