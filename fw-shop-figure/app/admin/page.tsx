"use client";

import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#1e1e1e",
        padding: "40px 30px",
        color: "#e0e1dd",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          textAlign: "center",
          marginTop: "80px", // ✨ turun sedikit agar tidak terlalu atas-tengah kosong
        }}
      >
        {/* Welcome */}
        <h1
          style={{
            fontSize: "34px",
            fontWeight: "bold",
            marginBottom: "12px",
          }}
        >
          Selamat Datang, Admin!
        </h1>
        <p style={{ color: "#9aa6b2", marginBottom: "40px", fontSize: "15px" }}>
          Silakan pilih menu untuk melanjutkan.
        </p>

        {/* Wrapper Button */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "22px", // ✨ jarak lebih lapang
          }}
        >
          {/* Kelola Produk */}
          <Link href="/admin/products">
            <button
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "10px",
                fontWeight: "bold",
                backgroundColor: "#1b263b",
                color: "#e0e1dd",
                fontSize: "17px",
                transition: "0.25s",
                cursor: "pointer",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#415a77")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#1b263b")
              }
            >
              📦 Manajemen Produk
            </button>
          </Link>

          {/* Manajemen Pesanan */}
          <Link href="/admin/orders">
            <button
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "10px",
                fontWeight: "bold",
                backgroundColor: "#1b263b",
                color: "#e0e1dd",
                fontSize: "17px",
                transition: "0.25s",
                cursor: "pointer",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#415a77")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#1b263b")
              }
            >
              🛒 Manajemen Pesanan
            </button>
          </Link>
        </div>

        {/* Footer kecil biar tidak kosong */}
        <p style={{ marginTop: "60px", fontSize: "13px", color: "#6c7a89" }}>
          © {new Date().getFullYear()} Admin Panel — FW SHOP
        </p>
      </div>
    </div>
  );
}
