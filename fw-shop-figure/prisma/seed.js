const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const products = [
  { name: "Monkey D. Luffy", price: 350000, category: 'anime', imageUrl: '/images/luffy.jpg', description: "Figure PVC skala 1/8 karakter utama One Piece yang energik. Detail api dinamis, tinggi sekitar 25 cm.", size: "25 cm", stock: 1 },
  { name: "Roronoa Zoro", price: 370000, category: 'anime', imageUrl: '/images/zoro.jpg', description: "Figure PVC detail tinggi Roronoa Zoro dengan tiga katananya, pose menyerang. Tinggi sekitar 26 cm.", size: "26 cm", stock: 3 },
  { name: "Nami", price: 340000, category: 'anime', imageUrl: '/images/nami.jpg', description: "Figure akurat dari karakter navigator One Piece, Nami. Desain pakaian musim panas. Tinggi sekitar 23 cm.", size: "23 cm", stock: 0 },
  { name: "Tanjiro Kamado", price: 360000, category: 'anime', imageUrl: '/images/tanjiro.jpg', description: "Figure Tanjiro Kamado dari Kimetsu no Yaiba dengan detail pedang Nichirin dan efek pernafasan air. Tinggi 24 cm.", size: "24 cm", stock: 0 },
  { name: "Nezuko Kamado", price: 350000, category: 'anime', imageUrl: '/images/nezuko.jpg', description: "Figure imut Nezuko dalam pose menyerang yang menggemaskan. Tinggi 22 cm.", size: "22 cm", stock: 1 },
  { name: "Gundam RX-78-2", price: 420000, category: 'anime', imageUrl: '/images/gundam.jpg', description: "Model kit klasik dari seri Mobile Suit Gundam, RX-78-2. Detail sempurna untuk kolektor. Tinggi 30 cm.", size: "30 cm", stock: 3 },
  { name: "Mini Elden Melina", price: 350000, category: 'game', imageUrl: '/images/eldenmelina.jpg', description: "Figure Melina dari Elden Ring dengan gaya Nendoroid yang lucu dilengkapi jubah dan stand. Tinggi 10 cm.", size: "10 cm", stock: 3 },
  { name: "Mini Ranni The Witch", price: 360000, category: 'game', imageUrl: '/images/witchrani.jpg', description: "Figure Ranni the Witch dengan efek biru magis dan topi lebar. Tinggi 10 cm.", size: "10 cm", stock: 4 },
  { name: "Genshin Impact Raiden Shogun", price: 480000, category: 'game', imageUrl: '/images/raiden.jpeg', description: "Figure Raiden Shogun dengan efek petir ungu dan Musou no Hitotachi. Tinggi 28 cm.", size: "28 cm", stock: 1 },
  { name: "Genshin Impact Zhongli", price: 470000, category: 'game', imageUrl: '/images/zhongli.jpg', description: "Figure Zhongli dengan efek batu geo dan jubah panjang. Tinggi 27 cm.", size: "27 cm", stock: 2 },
  { name: "Iron Man", price: 650000, category: 'superhero', imageUrl: '/images/ironman.jpg', description: "Figure Iron Man Mark 85 dengan detail armor nano suit dan efek repulsor. Tinggi 30 cm.", size: "30 cm", stock: 2 },
  { name: "Deadpool", price: 600000, category: 'superhero', imageUrl: '/images/deadpool.jpg', description: "Figure Deadpool dengan dua pedang dan pose kocak/action yang khas. Tinggi 26 cm.", size: "26 cm", stock: 1 },
];

async function main() {
  const hash = await bcrypt.hash("pbl327", 10);

  await prisma.user.upsert({
    where: { email: "admin@fwshop.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@fwshop.com",
      password: hash,
      role: "ADMIN",
    },
  });

  console.log("Admin user created!");

  // Insert products
  for (const p of products) {
    await prisma.product.upsert({
      where: { name: p.name },
      update: {},
      create: p,
    });
  }

  console.log("Products seeded!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error("Seed Error: ", e);
    prisma.$disconnect();
    process.exit(1);
  });
