import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Star,
  ChevronDown,
  LayoutGrid,
  ArrowUpDown,
  Tent,
  Flame,
  Backpack,
  Lightbulb,
  Coffee,
  Compass,
  Trophy, // Ikon tambahan untuk terpopuler
} from "lucide-react";
import toolsData from "../data/tools.json";

const Category = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState("default");

  const categoryIcons = {
    Semua: LayoutGrid,
    Tenda: Tent,
    Masak: Coffee,
    Carrier: Backpack,
    Lampu: Lightbulb,
    Survival: Flame,
  };

  const categories = [
    "Semua",
    ...new Set(toolsData.map((item) => item.category)),
  ];

  useEffect(() => {
    setProducts(toolsData);
  }, []);

  // --- REVISI LOGIKA MENANGKAP PERINTAH SUARA (ANTI-LOCK) ---
  useEffect(() => {
    setProducts(toolsData);

    // Cek apakah ada perintah suara
    if (location.state?.voiceSearch) {
      const searchWord = location.state.voiceSearch;

      // 1. Jalankan perintah asisten
      if (categories.includes(searchWord)) {
        setSelectedCategory(searchWord);
        setSearchTerm("");
      } else {
        setSearchTerm(searchWord);
        setSelectedCategory("Semua");
      }

      // 2. RAHASIA: Langsung hapus state dari history browser
      // Ini supaya asisten cuma "numpang lewat" dan tidak mengunci filter lagi
      window.history.replaceState({}, document.title);

      // 3. Paksa hapus state di memory React Router agar location.state jadi null
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, categories, navigate, location.pathname]);

  const addToCart = (item) => {
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = currentCart.findIndex((i) => i.id === item.id);
    if (index > -1) {
      currentCart[index].jumlah += 1;
    } else {
      currentCart.push({ ...item, jumlah: 1, durasi: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(currentCart));
    alert(`${item.name} berhasil masuk keranjang!`);
  };

  // LOGIKA FILTERING & SORTING YANG DIPERBARUI
  const filteredProducts = products
    .filter((p) => {
      const matchCategory =
        selectedCategory === "Semua" || p.category === selectedCategory;
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "murah") return a.price - b.price;
      if (sortBy === "mahal") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating; // Urutkan Rating tertinggi ke terendah
      if (sortBy === "populer") return b.reviews - a.reviews; // Urutkan Jumlah sewa (reviews) terbanyak
      return 0;
    });

  return (
    <div className="max-w-8xl mx-auto px-4 space-y-10 pb-20 font-['Poppins']">
      {/* 1. Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-emerald-600">
            <Compass size={24} className="animate-spin-slow" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Premium Equipment
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">
            Katalog <span className="text-emerald-600">Alat Outdoor</span>
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative group flex-1 sm:w-80">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari perlengkapan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all shadow-sm font-medium text-sm"
            />
          </div>

          {/* DROPDOWN SORTING YANG DIPERBARUI */}
          <div className="relative group">
            <ArrowUpDown
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all shadow-sm font-semibold text-[12px] uppercase tracking-widest cursor-pointer"
            >
              <option value="default">Urutkan: Terbaru</option>
              <option value="murah">Harga: Terendah</option>
              <option value="mahal">Harga: Tertinggi</option>
              <option value="rating">Terfavorit: Rating</option>
              <option value="populer">Terpopuler: Sewa</option>
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              size={16}
            />
          </div>
        </div>
      </div>

      {/* 2. MODERN VISUAL CATEGORY TABS */}
      <div className="relative bg-slate-100/80 p-1.5 rounded-[2rem] border border-slate-200/50 inline-flex min-w-full md:min-w-fit overflow-x-auto scrollbar-hide">
        {categories.map((cat) => {
          const Icon = categoryIcons[cat] || LayoutGrid;
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`relative flex items-center gap-3 px-8 py-3.5 rounded-[1.5rem] transition-all duration-500 group z-10 whitespace-nowrap`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabBackground"
                  className="absolute inset-0 bg-emerald-600 rounded-[1.5rem] shadow-lg shadow-emerald-600/30"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon
                size={18}
                className={`relative z-20 transition-colors duration-300 ${isActive ? "text-white" : "text-slate-400 group-hover:text-emerald-600"}`}
              />
              <span
                className={`relative z-20 text-[11px] font-black uppercase tracking-widest transition-colors duration-300 ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-900"}`}
              >
                {cat}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((p) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={p.id}
              whileHover={{ y: -12 }}
              onClick={() => navigate(`/detail/${p.id}`)}
              className="bg-white rounded-[2.8rem] p-6 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-emerald-500/30 hover:shadow-[0_20px_50px_rgba(6,78,59,0.15)] transition-all duration-500 group relative cursor-pointer"
            >
              <div className="absolute top-8 left-8 z-20">
                <span className="bg-emerald-950/90 backdrop-blur-md text-white text-[8px] font-black px-3 py-1.5 rounded-lg shadow-md uppercase tracking-[0.15em] border border-white/10">
                  {p.category}
                </span>
              </div>

              <div className="relative rounded-[2.2rem] overflow-hidden h-64 bg-slate-50 mb-6 flex items-center justify-center p-8 border border-slate-100 shadow-inner group-hover:bg-slate-100 transition-colors">
                <img
                  src={p.img}
                  alt={p.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-110 transition duration-700 ease-in-out"
                />
              </div>

              <div className="space-y-4 px-1">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-black text-lg text-slate-800 leading-tight uppercase tracking-tight group-hover:text-emerald-700 transition-colors">
                    {p.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-orange-500 font-bold bg-orange-50 px-2.5 py-1 rounded-xl border border-orange-100 shadow-sm">
                    <Star size={14} fill="currentColor" />
                    <span className="text-xs">{p.rating}</span>
                  </div>
                </div>

                {/* INFO TAMBAHAN UNTUK POPULER (Jumlah Reviews/Sewa) */}
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  <Trophy size={12} className="text-emerald-500" />
                  <span>{p.reviews} x Telah Disewa</span>
                </div>

                <div className="pt-5 flex items-center justify-between border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1 leading-none">
                      Price / Day
                    </span>
                    <span className="text-2xl font-black text-emerald-950 tracking-tighter">
                      Rp {p.price.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(p);
                    }}
                    className="bg-slate-900 text-white w-14 h-14 rounded-2xl shadow-lg hover:bg-emerald-600 transition-all active:scale-90 flex items-center justify-center group/btn shadow-slate-200"
                  >
                    <ShoppingCart
                      size={22}
                      className="group-hover/btn:-rotate-12 transition-transform"
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 4. Empty State */}
      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[4rem] border border-dashed border-slate-200 shadow-inner">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6 shadow-sm">
            <Search size={48} />
          </div>
          <h3 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter">
            Alat Tidak Ditemukan
          </h3>
          <p className="text-slate-400 text-sm font-medium mt-2">
            Coba kata kunci lain atau bersihkan filter pencarian Anda.
          </p>
        </div>
      )}
    </div>
  );
};

export default Category;
