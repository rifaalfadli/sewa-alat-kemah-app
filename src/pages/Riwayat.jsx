import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Upload,
  Clock,
  CheckCircle2,
  Receipt,
  AlertCircle,
} from "lucide-react";

export default function Riwayat() {
  const [riwayat, setRiwayat] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [, setUploadingId] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("riwayat_transaksi")) || [];
    setRiwayat(data);
  }, []);

  const handleUpload = (id) => {
    setUploadingId(id);
    // Simulasi: Update status di local storage menjadi 'Menunggu Persetujuan'
    const updatedRiwayat = riwayat.map((trx) => {
      if (trx.id_transaksi === id) {
        return { ...trx, status: "Menunggu Persetujuan", buktiUploaded: true };
      }
      return trx;
    });

    setRiwayat(updatedRiwayat);
    localStorage.setItem("riwayat_transaksi", JSON.stringify(updatedRiwayat));

    // Tampilkan Modal
    setShowModal(true);
  };

  return (
    <div className="max-w-8xl mx-auto pb-20 px-4 font-['Poppins']">
      {/* Modal Tinjauan */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-2xl border border-emerald-100"
            >
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock size={40} className="animate-pulse" />
              </div>
              <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">
                Dalam Tinjauan
              </h2>
              <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                Bukti pembayaran telah kami terima. Admin kami akan segera
                memverifikasi pesanan Anda. Harap tunggu sebentar.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="mt-8 w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-600/20"
              >
                Mengerti
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
          Riwayat <span className="text-emerald-600">Pesanan</span>
        </h1>
        <p className="text-slate-400 text-sm mt-2 font-medium">
          Lacak status penyewaan alat outdoor Anda secara transparan.
        </p>
      </div>

      <div className="space-y-6">
        {riwayat.length > 0 ? (
          riwayat.map((trx) => (
            <motion.div
              key={trx.id_transaksi}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden"
            >
              {/* Header Card */}
              <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/30">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white rounded-xl shadow-sm text-emerald-600 border border-slate-100">
                    <Receipt size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                      ID Transaksi
                    </p>
                    <p className="text-xs font-black text-slate-700 tracking-wider font-mono">
                      {trx.id_transaksi}
                    </p>
                  </div>
                </div>

                <div
                  className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border ${
                    trx.status === "Berhasil"
                      ? "bg-blue-50 text-blue-600 border-blue-100"
                      : trx.status === "Menunggu Persetujuan"
                        ? "bg-orange-50 text-orange-600 border-orange-100"
                        : "bg-emerald-50 text-emerald-600 border-emerald-100"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${trx.status === "Berhasil" ? "bg-blue-500" : "bg-orange-500"} animate-pulse`}
                  />
                  {trx.status === "Berhasil"
                    ? "Menunggu Pembayaran"
                    : trx.status}
                </div>
              </div>

              {/* Body Card */}
              <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* List Alat */}
                <div className="lg:col-span-7 space-y-3">
                  {trx.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 group">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center p-2 shrink-0 group-hover:scale-105 transition-transform">
                        <img
                          src={item.img}
                          className="max-h-full max-w-full object-contain"
                          alt=""
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight">
                          {item.name}
                        </h4>
                        <p className="text-[10px] font-medium text-slate-400 uppercase">
                          {item.jumlah} Unit × {item.durasi} Hari
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Harga */}
                <div className="lg:col-span-5 flex flex-col md:items-end border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-10">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                    Total Pembayaran
                  </p>
                  <p className="text-3xl font-black text-emerald-600 tracking-tighter">
                    Rp {trx.total.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Footer Section: Upload Area */}
              <div className="px-8 pb-8">
                {trx.buktiUploaded ? (
                  <div className="flex items-center gap-3 p-5 bg-emerald-50/50 rounded-[1.5rem] border border-emerald-100 transition-all">
                    <div className="p-2 bg-emerald-500 text-white rounded-full">
                      <CheckCircle2 size={16} />
                    </div>
                    <p className="text-xs font-bold text-emerald-700 italic">
                      Bukti telah diunggah. Kami sedang meninjau pembayaran Anda
                      secara manual.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-red-500 bg-red-50 p-4 rounded-2xl border border-red-100">
                      <AlertCircle size={20} />
                      <p className="text-xs font-bold">
                        Harap upload bukti transfer Anda agar proses penyewaan
                        segera disetujui oleh admin.
                      </p>
                    </div>
                    <label className="relative flex items-center justify-center w-full p-6 border-2 border-dashed border-slate-200 rounded-[2rem] hover:bg-slate-50 hover:border-emerald-400 transition-all cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <Upload
                          size={20}
                          className="text-slate-400 group-hover:text-emerald-600 transition-colors"
                        />
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                          Klik untuk Upload Bukti Pembayaran
                        </span>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        onChange={() => handleUpload(trx.id_transaksi)}
                      />
                    </label>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <Package
              size={64}
              className="mx-auto text-slate-100 mb-4"
              strokeWidth={1}
            />
            <h3 className="text-slate-400 font-bold uppercase text-xs tracking-[0.3em]">
              Belum Ada Aktivitas Penyewaan
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
