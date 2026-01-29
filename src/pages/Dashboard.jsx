import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import toolsData from "../data/tools.json";
import {
  Star,
  TrendingUp,
  ShoppingCart,
  Users,
  ArrowRight,
  Zap,
  Search,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const speakWelcome = (name) => {
    window.speechSynthesis.cancel();
    const text = `Selamat datang kembali, ${name}! Senang melihat Anda di Tiga Titik Outdoor. Silakan pilih perlengkapan terbaik untuk petualangan Anda hari ini.`;
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    const targetVoice =
      voices.find((v) => v.name === "Google Bahasa Indonesia") ||
      voices.find((v) => v.lang === "id-ID");

    if (targetVoice) utterance.voice = targetVoice;
    utterance.lang = "id-ID";
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    // Cek apakah ada state isFirstLogin dari halaman login
    if (location.state?.isFirstLogin) {
      const name = location.state?.userName || "Petualang";

      // Beri sedikit delay agar transisi halaman selesai baru bersuara
      const timer = setTimeout(() => {
        speakWelcome(name);
      }, 1000);

      // Bersihkan state agar tidak bersuara lagi saat refresh
      window.history.replaceState({}, document.title);

      return () => clearTimeout(timer);
    }
  }, [location]);

  const addToCart = (item) => {
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = currentCart.findIndex((i) => i.id === item.id);

    if (index > -1) {
      currentCart[index].jumlah += 1;
    } else {
      currentCart.push({
        ...item,
        jumlah: 1,
        durasi: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(currentCart));
    alert(`${item.name} berhasil masuk keranjang (Default 1 Hari)`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-10 pb-20 font-['Poppins']"
    >
      {/* 1. HERO SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 relative bg-emerald-950 rounded-[3rem] p-10 overflow-hidden group shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-emerald-400/20 transition-all duration-700"></div>
          <div className="relative z-10 flex flex-col h-full justify-between text-white">
            <div>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-emerald-500/30">
                Tiga Titik Outdoor
              </span>
              <h1 className="text-4xl md:text-6xl font-black mt-6 leading-tight tracking-tighter">
                Eksplorasi Alam <br /> Tanpa{" "}
                <span className="text-emerald-400 italic">Batas.</span>
              </h1>
              <p className="text-emerald-100/60 mt-4 max-w-sm leading-relaxed text-sm">
                Penyewaan perlengkapan kemah profesional dengan kualitas
                terjamin.
              </p>
            </div>
            <button
              onClick={() => navigate("/category")}
              className="bg-emerald-500 text-white w-fit px-8 py-4 rounded-2xl font-bold mt-8 flex items-center gap-3 hover:bg-emerald-400 transition-all shadow-lg active:scale-95 group"
            >
              Jelajahi Sekarang{" "}
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
          <img
            src="https://www.pngplay.com/wp-content/uploads/12/Camping-Tent-Background-PNG-Image.png"
            className="absolute -right-12 -bottom-10 w-[400px] opacity-40 lg:opacity-100 object-contain pointer-events-none group-hover:scale-105 transition-all duration-1000"
            alt="Tent"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4 flex flex-col">
          <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] flex-1 flex flex-col justify-center shadow-sm">
            <Zap
              size={32}
              className="text-orange-500 mb-4"
              fill="currentColor"
            />
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              Ketersediaan
            </p>
            <h3 className="text-3xl font-black text-slate-800 mt-1 italic uppercase">
              Ready Stock
            </h3>
            <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
              <TrendingUp size={14} /> +12 Unit Baru
            </p>
          </div>
          <div className="bg-emerald-500 p-8 rounded-[2.5rem] flex-1 flex flex-col justify-center shadow-xl shadow-emerald-500/20 text-white">
            <Users size={32} className="mb-4" />
            <p className="text-emerald-100/80 text-xs font-bold uppercase tracking-widest">
              Happy Camper
            </p>
            <h3 className="text-3xl font-black mt-1 uppercase">2,500+</h3>
          </div>
        </motion.div>
      </div>

      {/* 2. CATALOG HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2 pt-4 border-b border-slate-200 pb-6">
        <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase text-left">
          Katalog <span className="text-emerald-600">Pilihan</span>
        </h2>
        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari perlengkapan..."
            className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all w-full md:w-[300px] shadow-sm"
          />
        </div>
      </div>

      {/* 3. PRODUCT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {toolsData.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            whileHover={{ y: -12 }}
            onClick={() => navigate(`/detail/${item.id}`)}
            className="bg-white rounded-[2.8rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 hover:border-emerald-500/30 hover:shadow-[0_20px_50px_rgba(6,78,59,0.1)] transition-all group relative cursor-pointer"
          >
            {/* Image Container dengan Background Halus */}
            <div className="relative rounded-[2.2rem] overflow-hidden h-64 bg-slate-50 mb-6 flex items-center justify-center p-8 border border-slate-100 shadow-inner">
              <span className="absolute top-4 left-4 z-20 bg-emerald-950 text-white text-[9px] font-bold px-3 py-2 rounded-xl shadow-md uppercase tracking-widest border border-white/10">
                {item.tag}
              </span>
              <img
                src={item.img}
                className="max-h-full max-w-full object-contain group-hover:scale-110 transition duration-700 ease-in-out"
                alt={item.name}
              />
            </div>

            <div className="space-y-4 px-1">
              <div className="flex justify-between items-start gap-4">
                <h3 className="font-black text-lg text-slate-800 leading-tight uppercase tracking-tight group-hover:text-emerald-700 transition-colors">
                  {item.name}
                </h3>
                <div className="flex items-center gap-1.5 text-orange-500 font-bold bg-orange-50 px-2.5 py-1 rounded-xl border border-orange-100">
                  <Star size={14} fill="currentColor" />
                  <span className="text-xs">{item.rating}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <div className="p-1.5 bg-emerald-50 rounded-lg">
                  <Users size={14} className="text-emerald-600" />
                </div>
                <span>{item.reviews} Penyewa Terpercaya</span>
              </div>

              <div className="pt-5 flex items-center justify-between border-t border-slate-100">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter mb-1 leading-none">
                    Harga Sewa / Hari
                  </span>
                  <span className="text-2xl font-black text-emerald-950 tracking-tight">
                    Rp {item.price.toLocaleString()}
                  </span>
                </div>

                <div className="relative group/tooltip">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item);
                    }}
                    className="bg-slate-900 text-white w-14 h-14 rounded-2xl shadow-lg hover:bg-emerald-600 transition-all active:scale-90 flex items-center justify-center group/btn"
                  >
                    <ShoppingCart
                      size={22}
                      className="group-hover/btn:rotate-12 transition-transform"
                    />
                  </button>

                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-4 py-2 bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl opacity-0 group-hover/tooltip:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-2xl z-30 translate-y-2 group-hover/tooltip:translate-y-0">
                    Sewa Alat Ini
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-800"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
