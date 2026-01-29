import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  ChevronLeft,
  ShoppingCart,
  ShieldCheck,
  Share2,
  Heart,
  MessageCircle,
  Info,
  ArrowRight,
  AlertCircle, // Ikon untuk kondisi stok habis
} from "lucide-react";
import toolsData from "../data/tools.json";

export default function DetailAlat() {
  const { id } = useParams();
  const navigate = useNavigate();

  // STATE
  const [jumlah, setJumlah] = useState(1);
  const [durasi, setDurasi] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentStock, setCurrentStock] = useState(0);

  const item = toolsData.find((t) => t.id === parseInt(id));

  // Efek untuk menghitung stok sisa berdasarkan isi keranjang
  useEffect(() => {
    if (item) {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const itemInCart = cart.find((i) => i.id === item.id);
      const qtyInCart = itemInCart ? itemInCart.jumlah : 0;
      setCurrentStock(item.stock - qtyInCart);
    }
  }, [id, item]);

  if (!item)
    return (
      <div className="text-center py-20 font-bold">Produk tidak ditemukan!</div>
    );

  const handleAddToCart = () => {
    if (currentStock === 0)
      return alert("Maaf, stok sudah habis atau sudah penuh disewa!");
    if (jumlah > currentStock)
      return alert(`Stok barang tidak mencukupi! Sisa stok: ${currentStock}`);

    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = currentCart.findIndex((i) => i.id === item.id);
    if (index > -1) {
      currentCart[index].jumlah += jumlah;
      currentCart[index].durasi = durasi;
    } else {
      currentCart.push({ ...item, jumlah, durasi });
    }
    localStorage.setItem("cart", JSON.stringify(currentCart));

    // Update tampilan stok setelah masuk keranjang
    setCurrentStock((prev) => prev - jumlah);
    alert(`${item.name} masuk keranjang!`);
  };

  const handleCheckout = () => {
    if (currentStock === 0)
      return alert("Maaf, alat ini sedang tidak tersedia!");
    if (jumlah > currentStock)
      return alert(`Stok barang tidak mencukupi! Sisa stok: ${currentStock}`);

    const checkoutData = [{ ...item, jumlah, durasi }];
    localStorage.setItem("checkout_temp", JSON.stringify(checkoutData));
    navigate("/sewa-alat");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-20 max-w-7xl mx-auto font-sans"
    >
      {/* Header Navigasi */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-700 font-bold transition-all group"
        >
          <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-emerald-50 transition-all border border-slate-100">
            <ChevronLeft size={20} />
          </div>
          Kembali ke Katalog
        </button>
        <div className="flex gap-3">
          <button className="p-2.5 bg-white rounded-xl shadow-sm text-slate-400 hover:text-emerald-600 border border-slate-100 transition-all">
            <Share2 size={20} />
          </button>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 transition-all ${isFavorite ? "text-red-500 border-red-100" : "text-slate-400"}`}
          >
            <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* AREA GAMBAR */}
        <div className="space-y-6">
          <div className="rounded-[3rem] overflow-hidden bg-gray-50 shadow-2xl border-4 border-white h-[600px] flex items-center justify-center p-10">
            <img
              src={item.img}
              className="max-h-full max-w-full object-contain"
              alt={item.name}
            />
          </div>

          <div className="grid grid-cols-4 gap-4 px-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl bg-gray-50 border-2 border-white shadow-sm flex items-center justify-center p-2 opacity-60 hover:opacity-100 cursor-pointer transition-all"
              >
                <img
                  src={item.img}
                  className="max-h-full max-w-full object-contain"
                  alt="Thumb"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Informasi Produk */}
        <div className="space-y-8 bg-white p-8 lg:p-10 rounded-[3rem] shadow-sm border border-slate-50">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-4 py-1.5 rounded-lg uppercase tracking-wider">
                {item.tag}
              </span>
              <div className="flex items-center gap-1 text-orange-500 font-bold text-sm bg-orange-50 px-3 py-1 rounded-lg">
                <Star size={16} fill="currentColor" /> {item.rating}
                <span className="text-slate-400 font-medium ml-1">
                  ({item.reviews} Ulasan)
                </span>
              </div>
            </div>
            <h1 className="text-4xl font-black text-slate-900 leading-tight uppercase tracking-tight">
              {item.name}
            </h1>
            <p className="text-slate-400 mt-2 font-medium">
              ID Produk:{" "}
              <span className="font-bold text-emerald-600">TT-00{item.id}</span>
            </p>
          </div>

          <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 flex justify-between items-center shadow-inner">
            <div>
              <p className="text-[10px] text-emerald-600 font-black uppercase mb-1 tracking-widest">
                Harga Sewa / Hari
              </p>
              <h2 className="text-4xl font-black text-emerald-950 tracking-tighter">
                Rp {item.price.toLocaleString()}
              </h2>
            </div>
            <div className="text-right">
              {currentStock > 0 ? (
                <div className="space-y-1">
                  <p className="text-emerald-700 font-bold flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-emerald-100">
                    <ShieldCheck size={20} /> Tersedia
                  </p>
                  <p className="text-[11px] font-black text-emerald-600 uppercase pr-2">
                    Stok: {currentStock} Unit
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-red-600 font-bold flex items-center gap-2 bg-red-50 px-4 py-2 rounded-2xl shadow-sm border border-red-100">
                    <AlertCircle size={20} /> Full Sewa
                  </p>
                  <p className="text-[10px] font-black text-red-500 uppercase pr-2">
                    Habis Tersewa
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em] flex items-center gap-2">
                <Info size={18} className="text-emerald-600" /> Deskripsi Produk
              </h3>
            </div>
            <p className="text-slate-500 leading-relaxed text-sm italic font-medium">
              {item.desc}
            </p>

            <div className="grid grid-cols-2 gap-4">
              {item.specs.map((spec, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100"
                >
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">
                    {spec}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Aksi Checkout */}
          <div className="pt-8 border-t border-slate-100 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Unit */}
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Unit
                </p>
                <div className="flex items-center bg-slate-100 rounded-2xl p-1 shadow-inner h-12">
                  <button
                    onClick={() => setJumlah(Math.max(1, jumlah - 1))}
                    className="w-10 h-10 flex items-center justify-center font-bold text-slate-500 hover:bg-white hover:rounded-xl transition-all"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-black text-slate-800">
                    {jumlah}
                  </span>
                  <button
                    onClick={() => setJumlah(jumlah + 1)}
                    className="w-10 h-10 flex items-center justify-center font-bold text-slate-500 hover:bg-white hover:rounded-xl transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
              {/* Hari */}
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Hari
                </p>
                <div className="flex items-center bg-slate-100 rounded-2xl p-1 shadow-inner h-12">
                  <button
                    onClick={() => setDurasi(Math.max(1, durasi - 1))}
                    className="w-10 h-10 flex items-center justify-center font-bold text-slate-500 hover:bg-white hover:rounded-xl transition-all"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-black text-slate-800">
                    {durasi}
                  </span>
                  <button
                    onClick={() => setDurasi(durasi + 1)}
                    className="w-10 h-10 flex items-center justify-center font-bold text-slate-500 hover:bg-white hover:rounded-xl transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-4]">
              <div className="flex gap-3">
                {/* BUTTON KERANJANG */}
                <button
                  onClick={handleAddToCart}
                  disabled={currentStock === 0}
                  className={`flex-[2] border border-emerald py-4 rounded-2xl font-bold uppercase text-[12px] tracking-[0.1em] flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 ${
                    currentStock === 0
                      ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200/50"
                  }`}
                >
                  <ShoppingCart size={18} strokeWidth={2} />+ Keranjang
                </button>

                {/* BUTTON CHAT */}
                <button className="flex-1 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 hover:text-emerald-600 border border-slate-200/60 transition-all duration-300 flex items-center justify-center active:scale-90">
                  <MessageCircle size={22} strokeWidth={2} />
                </button>
              </div>

              {/* BUTTON CHECKOUT */}
              <button
                onClick={handleCheckout}
                disabled={currentStock === 0}
                className={`group relative w-full overflow-hidden py-5 rounded-[2rem] transition-all duration-500 active:scale-[0.98] ${
                  currentStock === 0
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-emerald-950 text-white hover:shadow-[0_20px_40px_-15px_rgba(6,78,59,0.4)]"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                <div className="relative flex items-center justify-center gap-3">
                  <div className="flex flex-col items-start mr-2 border-r border-white/20 pr-5">
                    <span className="text-[9px] font-black opacity-50 leading-none mb-1.5 uppercase tracking-[0.15em]">
                      Total Sewa
                    </span>
                    <span className="text-sm font-black tracking-tight font-sans">
                      Rp {(item.price * jumlah * durasi).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-black uppercase tracking-[0.1em] italic">
                      {currentStock === 0 ? "Stok Habis" : "Sewa Sekarang"}
                    </span>
                    <ArrowRight
                      size={18}
                      strokeWidth={3}
                      className="group-hover:translate-x-1.5 transition-transform duration-300"
                    />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
