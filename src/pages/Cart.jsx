import React, { useState, useEffect } from "react";
import {
  Trash2,
  ShoppingCart as CartIcon,
  CreditCard,
  CheckCircle2,
  Circle,
  ArrowRight,
  PackageSearch,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setItems(savedCart);

    // ✅ jangan auto select apa pun
    setSelectedItems([]);
  }, []);

  const updateLocalStorage = (newCart) => {
    setItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    setSelectedItems(
      selectedItems.filter((id) => newCart.some((item) => item.id === id)),
    );
  };

  const removeItem = (id) => {
    const newCart = items.filter((item) => item.id !== id);
    updateLocalStorage(newCart);
  };

  const toggleSelect = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map((item) => item.id));
    }
  };

  const itemsTerpilih = items.filter((item) => selectedItems.includes(item.id));
  const totalAkhir = itemsTerpilih.reduce(
    (acc, curr) => acc + curr.price * curr.jumlah * curr.durasi,
    0,
  );

  const handleCheckout = () => {
    if (itemsTerpilih.length === 0) return;
    localStorage.setItem("checkout_temp", JSON.stringify(itemsTerpilih));
    navigate("/sewa-alat");
  };

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-40 space-y-8 font-['Poppins']"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full"></div>
          <CartIcon
            size={100}
            className="text-slate-200 relative z-10"
            strokeWidth={1}
          />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter">
            Keranjang Kosong
          </h2>
          <p className="text-slate-400 font-medium">
            Petualanganmu dimulai dari sini. Tambahkan beberapa alat!
          </p>
        </div>
        <button
          onClick={() => navigate("/category")}
          className="group flex items-center gap-3 bg-emerald-500 text-white px-10 py-4 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-500/30 hover:bg-emerald-400 transition-all active:scale-95"
        >
          Mulai Belanja{" "}
          <ArrowRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto pb-20 px-4 space-y-12 pb-24 font-['Poppins']">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
            Keranjang <span className="text-emerald-600">Sewa</span>
          </h1>
          <p className="text-slate-400 font-semibold uppercase text-[10px] tracking-[0.3em]">
            Manajemen Perlengkapan Outdoor Anda
          </p>
        </div>

        <button
          onClick={toggleSelectAll}
          className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold text-[12px] uppercase  transition-all border-2 ${
            selectedItems.length === items.length
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
          }`}
        >
          {selectedItems.length === items.length ? (
            <CheckCircle2
              size={16}
              fill="currentColor"
              className="text-emerald-600"
            />
          ) : (
            <Circle size={16} />
          )}
          {selectedItems.length === items.length
            ? "Semua Terpilih"
            : "Pilih Semua"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Item List Container */}
        <div className="lg:col-span-2 space-y-5">
          <AnimatePresence mode="popLayout">
            {items.map((item) => {
              const isSelected = selectedItems.includes(item.id);
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={item.id}
                  className={`group p-8 rounded-[3rem] flex items-center transition-all border-2 ${
                    isSelected
                      ? "bg-white border-emerald-500 shadow-[0_20px_50px_-20px_rgba(16,185,129,0.15)]"
                      : "bg-white border-slate-50 opacity-60 grayscale-[0.5]"
                  }`}
                >
                  {/* Select Trigger */}
                  <button
                    onClick={() => toggleSelect(item.id)}
                    className={`mr-8 transition-all transform active:scale-75 ${
                      isSelected
                        ? "text-emerald-500 scale-110"
                        : "text-emerald-200 hover:text-emerald-300"
                    }`}
                  >
                    {isSelected ? (
                      <div className="bg-emerald-500 p-1 rounded-full shadow-lg shadow-emerald-500/40">
                        <CheckCircle2
                          size={28}
                          className="text-white"
                          strokeWidth={3}
                        />
                      </div>
                    ) : (
                      <Circle size={32} strokeWidth={1.5} />
                    )}
                  </button>

                  {/* Image Product */}
                  <div className="w-28 h-28 bg-slate-50 rounded-[2rem] flex items-center justify-center p-4 shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-500">
                    <img
                      src={item.img}
                      className="max-h-full max-w-full object-contain drop-shadow-xl"
                      alt={item.name}
                    />
                  </div>

                  {/* Info Product */}
                  <div className="ml-8 flex-1">
                    <h3 className="font-black uppercase text-base text-slate-800 tracking-tight leading-tight mb-2 group-hover:text-emerald-700 transition-colors">
                      {item.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-[10px] bg-slate-100 px-3 py-1 rounded-full font-bold text-slate-500 uppercase tracking-widest">
                        {item.jumlah} Unit
                      </span>
                      <span className="text-[10px] bg-emerald-50 px-3 py-1 rounded-full font-bold text-emerald-600 uppercase tracking-widest">
                        {item.durasi} Hari Sewa
                      </span>
                    </div>
                    <p className="text-emerald-700 font-black text-xl italic tracking-tighter">
                      Rp{" "}
                      {(
                        item.price *
                        item.jumlah *
                        item.durasi
                      ).toLocaleString()}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-4 p-4 text-red-500 bg-red-50 hover:text-red-600 hover:bg-red-100 rounded-[1.5rem] transition-all"
                  >
                    <Trash2 size={24} strokeWidth={1.5} />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Summary Card: Glassmorphism Style */}
        <div className="sticky top-28">
          <div className="bg-emerald-950 p-10 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden border border-emerald-900/50">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-[80px]"></div>

            <div className="relative z-10 space-y-8">
              <div className="border-b border-emerald-900/50 pb-6">
                <div className="flex items-center gap-2 mb-2">
                  <PackageSearch size={16} className="text-emerald-500" />
                  <h4 className="text-[9px] font-bold text-emerald-400 uppercase tracking-[0.4em]">
                    Checkout Plan
                  </h4>
                </div>
                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                  Ringkasan <span className="text-emerald-500">Tagihan</span>
                </h2>
              </div>

              {/* Items List inside Summary */}
              <div className="space-y-5 max-h-60 overflow-y-auto pr-2 custom-scrollbar border-b border-emerald-900/50 pb-8">
                <AnimatePresence>
                  {itemsTerpilih.length > 0 ? (
                    itemsTerpilih.map((item) => (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        key={item.id}
                        className="flex justify-between items-center group/item"
                      >
                        <div className="flex flex-col">
                          <span className="text-[12px] font-bold text-emerald-100/60 uppercase w-52 group-hover/item:text-white transition-colors">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-emerald-500 font-black uppercase">
                            {item.jumlah}x Unit
                          </span>
                        </div>
                        <span className="text-[13px] font-black text-white">
                          Rp{" "}
                          {(
                            item.price *
                            item.jumlah *
                            item.durasi
                          ).toLocaleString()}
                        </span>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-[10px] text-emerald-700/50 font-bold italic uppercase tracking-widest leading-relaxed">
                        Silakan pilih item
                        <br />
                        untuk melihat total
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Final Totals */}
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">
                      Total Pembayaran
                    </span>
                    <span className="text-4xl font-black italic text-white tracking-tighter shadow-sm">
                      Rp {totalAkhir.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] bg-white/10 px-3 py-1 rounded-full font-bold text-emerald-400 uppercase tracking-widest border border-white/5">
                      {selectedItems.length} Item
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={selectedItems.length === 0}
                  className={`group w-full py-6 rounded-[2rem] font-bold uppercase text-[13px] transition-all flex items-center justify-center gap-3 relative overflow-hidden ${
                    selectedItems.length > 0
                      ? "bg-emerald-500 text-emerald-950 shadow-2xl shadow-emerald-500/40 hover:bg-emerald-400 hover:-translate-y-1 active:translate-y-0"
                      : "bg-emerald-900/30 text-emerald-800 cursor-not-allowed grayscale"
                  }`}
                >
                  <CreditCard size={20} strokeWidth={2.5} />
                  Konfirmasi Sewa Alat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
