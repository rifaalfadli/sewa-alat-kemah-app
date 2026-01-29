import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Webcam from "react-webcam";
import {
  ShieldAlert,
  Upload,
  CreditCard,
  Landmark,
  Wallet,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Camera,
  Box,
  Receipt,
  ChevronRight,
  X,
  FileText,
} from "lucide-react";
import usersData from "../data/users.json";

export default function SewaAlat() {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [items, setItems] = useState([]);
  const [metode, setMetode] = useState("transfer");
  const [agreed, setAgreed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [ktpPreview, setKtpPreview] = useState(null);

  // Fungsi Ambil Gambar dari Webcam
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setSelfiePreview(imageSrc);
    setIsCameraOpen(false); // Tutup kamera setelah memotret
  }, [webcamRef]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("checkout_temp")) || [];
    if (data.length === 0) {
      navigate("/dashboard");
    } else {
      setItems(data);
    }

    const savedUserId = localStorage.getItem("user_id");
    if (savedUserId) {
      const localUsers =
        JSON.parse(localStorage.getItem("registered_users")) || [];
      const allUsers = [...usersData, ...localUsers];
      const foundUser = allUsers.find((u) => u.id === savedUserId);
      if (foundUser) setCurrentUser(foundUser);
    }
  }, [navigate]);

  const subtotal = items.reduce(
    (acc, curr) => acc + curr.price * (curr.jumlah || 1) * (curr.durasi || 1),
    0,
  );

  const handleBayar = (e) => {
    e.preventDefault();

    if (!ktpPreview) return alert("Harap upload foto KTP/SIM Anda!");
    if (!selfiePreview) return alert("Harap lakukan verifikasi foto selfie!");
    if (!agreed) return alert("Anda harus menyetujui ketentuan hukum!");

    const riwayat = JSON.parse(localStorage.getItem("riwayat_transaksi")) || [];
    const orderBaru = {
      id_transaksi: `TRX-${Date.now()}`,
      tanggal: new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      items: items,
      total: subtotal + 5000,
      metode: metode,
      status: "Berhasil",
    };

    riwayat.unshift(orderBaru);
    localStorage.setItem("riwayat_transaksi", JSON.stringify(riwayat));
    localStorage.removeItem("checkout_temp");
    localStorage.removeItem("cart");

    setShowSuccess(true);
    setTimeout(() => {
      navigate("/riwayat");
    }, 2500);
  };

  if (items.length === 0 || !currentUser) return null;

  return (
    <div className="relative font-['Poppins'] bg-slate-50 min-h-screen">
      {/* 1. MODAL CAMERA (LIVE PREVIEW) */}
      <AnimatePresence>
        {isCameraOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center px-4 bg-slate-900/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-[2.5rem] p-6 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setIsCameraOpen(false)}
                className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <X size={20} />
              </button>

              <h3 className="text-lg font-black text-slate-800 uppercase mb-4 text-center tracking-tight">
                Ambil Foto Selfie
              </h3>

              <div className="relative rounded-3xl overflow-hidden bg-slate-200 aspect-[3/4] shadow-inner">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: "user" }}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={capture}
                  className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-500/30 hover:bg-emerald-500 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Camera size={18} /> Potret Sekarang
                </button>
                <p className="text-[10px] text-slate-400 text-center font-medium">
                  Pastikan wajah terlihat jelas di area kamera
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[2rem] p-10 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} strokeWidth={3} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                Sewa Berhasil!
              </h2>
              <p className="text-slate-500 text-sm mt-2">
                Pesanan Anda sedang diproses.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-8xl mx-auto pb-20 px-4"
      >
        {/* Header Rapi */}
        <div className="flex items-center gap-3 mb-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">
              Konfirmasi <span className="text-emerald-600">Penyewaan</span>
            </h1>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
              Pembayaran Aman
            </p>
          </div>
        </div>

        <form onSubmit={handleBayar} className="space-y-6 text-left">
          {/* 1. Alamat Pengiriman */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:border-emerald-200">
            <div className="p-1 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 w-full" />
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-emerald-600">
                <MapPin size={18} strokeWidth={2.5} />
                <h3 className="text-sm font-black uppercase tracking-wider">
                  Alamat Pengiriman
                </h3>
              </div>
              <div className="pl-7">
                <p className="text-sm font-bold text-slate-800 italic">
                  {currentUser.nama}{" "}
                  <span className="text-slate-400 font-medium not-italic ml-2">
                    | {currentUser.telp || currentUser.no_hp}
                  </span>
                </p>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  {currentUser.alamat}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Rincian Peralatan */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2 text-slate-800 border-b border-slate-100 pb-4">
              <Box size={18} className="text-emerald-600" />
              <h3 className="text-sm font-black uppercase tracking-wider">
                Rincian Peralatan
              </h3>
            </div>
            <div className="space-y-6">
              {items.map((i, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center p-2 shrink-0">
                    <img
                      src={i.img}
                      alt={i.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-tight">
                      {i.name}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                        {i.jumlah} Unit × {i.durasi} Hari
                      </span>
                    </div>
                    <p className="text-sm font-black text-emerald-600 mt-1">
                      Rp {(i.price * i.jumlah * i.durasi).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* BAGIAN VERIFIKASI DENGAN PREVIEW */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                Dokumen Wajib <span className="text-red-500">*</span>
              </h4>

              {/* Verifikasi KTP */}
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 transition-all group">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl shadow-sm border border-slate-100 transition-all ${ktpPreview ? "bg-emerald-500 text-white" : "bg-white text-slate-400 group-hover:text-emerald-600"}`}
                    >
                      {ktpPreview ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <FileText size={18} />
                      )}
                    </div>
                    <span className="text-[11px] font-black text-slate-500 uppercase group-hover:text-emerald-700">
                      Verifikasi KTP / SIM{" "}
                      <span className="text-red-500 ml-1 font-bold">*</span>
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-slate-300" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    required
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) setKtpPreview(URL.createObjectURL(file));
                    }}
                  />
                </label>
                {ktpPreview && (
                  <div className="flex items-center gap-4 p-4 bg-white border border-emerald-100 rounded-2xl shadow-sm">
                    <img
                      src={ktpPreview}
                      alt="KTP"
                      className="w-20 h-12 object-cover rounded-lg border border-slate-200"
                    />
                    <div>
                      <p className="text-[10px] font-black text-emerald-700 uppercase">
                        KTP Berhasil Diupload
                      </p>
                      <button
                        type="button"
                        onClick={() => setKtpPreview(null)}
                        className="text-[9px] font-bold text-red-500 uppercase hover:underline"
                      >
                        Hapus & Ganti
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Verifikasi Selfie */}
              <div className="space-y-3">
                <div
                  onClick={() => setIsCameraOpen(true)}
                  className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl shadow-sm border border-slate-100 transition-all ${selfiePreview ? "bg-emerald-500 text-white" : "bg-white text-slate-400 group-hover:text-emerald-600"}`}
                    >
                      {selfiePreview ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <Camera size={18} />
                      )}
                    </div>
                    <span className="text-[11px] font-black text-slate-500 uppercase group-hover:text-emerald-700">
                      Verifikasi Selfie{" "}
                      <span className="text-red-500 ml-1 font-bold">*</span>
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-slate-300" />
                </div>
                {selfiePreview && (
                  <div className="flex items-center gap-4 p-4 bg-white border border-emerald-100 rounded-2xl shadow-sm">
                    <img
                      src={selfiePreview}
                      alt="Selfie"
                      className="w-16 h-16 object-cover rounded-xl border border-slate-200"
                    />
                    <div>
                      <p className="text-[10px] font-black text-emerald-700 uppercase">
                        Selfie Terverifikasi
                      </p>
                      <button
                        type="button"
                        onClick={() => setSelfiePreview(null)}
                        className="text-[9px] font-bold text-red-500 uppercase hover:underline"
                      >
                        Ambil Ulang
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Metode Pembayaran */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 text-slate-800 border-b border-slate-50 pb-4">
              <CreditCard size={18} className="text-emerald-600" />
              <h3 className="text-sm font-black uppercase tracking-wider">
                Metode Pembayaran
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "transfer", name: "Bank", icon: Landmark },
                { id: "e-wallet", name: "QRIS", icon: Wallet },
                { id: "cod", name: "Toko", icon: Box },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMetode(m.id)}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${metode === m.id ? "border-emerald-500 bg-emerald-50 text-emerald-600" : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"}`}
                >
                  <m.icon size={20} />
                  <span className="text-[12px] font-bold uppercase tracking-tighter">
                    {m.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Sanksi Hukum */}
          <div className="bg-orange-50 border border-orange-200 rounded-3xl p-6 space-y-5">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-orange-100 rounded-xl text-orange-600 shrink-0">
                <ShieldAlert size={20} />
              </div>

              <div className="space-y-4 w-full">
                <div>
                  <h4 className="text-[15px] font-black text-orange-700 uppercase tracking-[0.05em]">
                    Ketentuan & Sanksi Hukum
                  </h4>
                  <p className="text-[12px] text-orange-700/70 mt-1">
                    Harap dibaca sebelum melanjutkan penyewaan
                  </p>
                </div>

                <ul className="space-y-2 text-[12px] text-orange-800/80 font-medium leading-relaxed">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      Penggelapan atau tidak mengembalikan alat dikenakan pidana
                      sesuai
                      <b> Pasal 372 KUHP</b>.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      Kerusakan atau kehilangan alat dikenakan
                      <b> ganti rugi 100%</b> dari harga alat.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      Keterlambatan pengembalian dikenakan denda
                      <b> Rp 50.000 / hari</b>.
                    </span>
                  </li>
                </ul>

                <label className="flex items-center gap-3 cursor-pointer pt-4 border-t border-orange-200/60 group">
                  <div
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
            ${
              agreed
                ? "bg-orange-500 border-orange-500 shadow-lg shadow-orange-500/30"
                : "border-orange-300 bg-white"
            }`}
                  >
                    {agreed && (
                      <CheckCircle2
                        size={14}
                        className="text-white"
                        strokeWidth={3}
                      />
                    )}
                  </div>

                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="hidden"
                  />

                  <span className="text-[12px] font-bold text-orange-700 uppercase  group-hover:text-orange-800">
                    Saya telah membaca dan menyetujui seluruh ketentuan di atas
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* 5. Final Bill & Action (Tidak Fixed, Mengalir ke bawah) */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.03)] p-8 space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-widest">
                  Subtotal Sewa
                </span>
                <span className="text-sm font-bold text-slate-700">
                  Rp {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-widest">
                  Biaya Layanan
                </span>
                <span className="text-sm font-bold text-slate-700">
                  Rp 5.000
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                <div className="flex items-center gap-2 text-emerald-600">
                  <Receipt size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">
                    Total Pembayaran
                  </span>
                </div>
                <span className="text-2xl font-black text-slate-900 tracking-tighter italic">
                  Rp {(subtotal + 5000).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!agreed}
              className={`w-full py-5 rounded-[1.5rem] font-bold uppercase text-base  transition-all flex items-center justify-center gap-3 ${
                agreed
                  ? "bg-emerald-600 text-white shadow-xl shadow-emerald-500/30 hover:bg-emerald-500 active:scale-95"
                  : "bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200"
              }`}
            >
              Konfirmasi & Bayar Sekarang <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
