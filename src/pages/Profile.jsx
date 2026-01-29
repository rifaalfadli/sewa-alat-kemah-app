import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  LogOut,
  Calendar,
  ShieldCheck,
  Award,
  Edit3,
  Save,
  X,
  CheckCircle2,
  AtSign,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import usersData from "../data/users.json";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    const savedUserId = localStorage.getItem("user_id");
    if (savedUserId) {
      const localUsers =
        JSON.parse(localStorage.getItem("registered_users")) || [];
      const allUsers = [...usersData, ...localUsers];
      const foundUser = allUsers.find((u) => u.id === savedUserId);

      if (foundUser) {
        setUser(foundUser);
        setFormData(foundUser);
      } else {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    const yakin = window.confirm("Apakah Anda yakin ingin keluar?");
    if (yakin) {
      localStorage.removeItem("user_id");
      navigate("/login");
    }
  };

  const handleSave = () => {
    const localUsers =
      JSON.parse(localStorage.getItem("registered_users")) || [];
    const userIndex = localUsers.findIndex((u) => u.id === user.id);

    let updatedLocalUsers;
    if (userIndex > -1) {
      updatedLocalUsers = [...localUsers];
      updatedLocalUsers[userIndex] = formData;
    } else {
      updatedLocalUsers = [...localUsers, formData];
    }

    localStorage.setItem("registered_users", JSON.stringify(updatedLocalUsers));
    setUser(formData);
    setIsEditing(false);
    setShowNotif(true);
    setTimeout(() => setShowNotif(false), 3000);
  };

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-8xl mx-auto space-y-8 pb-20 px-4 relative font-sans"
    >
      <AnimatePresence>
        {showNotif && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold"
          >
            <CheckCircle2 size={20} /> Data Berhasil Disimpan!
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Profile Header Card */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden relative">
        <div className="h-40 bg-emerald-950 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="px-10 pb-10 -mt-16 relative z-10 flex flex-col md:flex-row items-end gap-6 text-center md:text-left">
          <div className="relative mx-auto md:mx-0">
            <div className="w-36 h-36 bg-white rounded-[2.5rem] p-1.5 shadow-xl border-4 border-white flex items-center justify-center">
              <div className="w-full h-full bg-slate-50 rounded-[2.2rem] flex items-center justify-center text-emerald-600 border border-slate-100">
                <User size={64} strokeWidth={1.5} />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-2xl shadow-lg border-4 border-white">
              <ShieldCheck size={20} />
            </div>
          </div>

          <div className="flex-1 pb-2">
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic font-['Poppins']">
              {user.nama || user.nama_pelanggan}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-slate-400 font-bold text-xs uppercase mt-3 tracking-widest font-['Poppins']">
              <div className="flex items-center gap-1.5">
                <Calendar size={14} /> Member Sejak:{" "}
                {user.join_date || "Baru Bergabung"}
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600">
                <Award size={14} /> {user.total_rent || 0}x Sewa Alat
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* 2. Div Informasi Pribadi */}
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200/60 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                Informasi Pribadi
              </h3>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData(user);
                      }}
                      className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all"
                    >
                      <X size={18} />
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase transition-all hover:bg-emerald-700 shadow-lg"
                    >
                      <Save size={16} /> Simpan
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-white text-emerald-600 border border-emerald-100 px-4 py-2.5 rounded-xl font-bold text-xs uppercase hover:bg-emerald-50 transition-all shadow-sm"
                  >
                    <Edit3 size={16} /> Edit Data
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-5">
              {isEditing && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                    Nama Lengkap
                  </label>
                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-emerald-100 bg-emerald-50/30">
                    <User size={18} className="text-emerald-600" />
                    <input
                      className="bg-transparent outline-none w-full font-semibold text-slate-700 text-sm"
                      value={formData.nama}
                      onChange={(e) =>
                        setFormData({ ...formData, nama: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                  Username
                </label>
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200/60 bg-slate-50/50">
                  <AtSign size={18} className="text-slate-400" />
                  <p className="text-sm font-semibold text-slate-400 italic">
                    {user.username}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <div
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${isEditing ? "border-emerald-400 bg-white shadow-md" : "border-slate-200/60 bg-white"}`}
                >
                  <Mail size={18} className="text-emerald-600" />
                  {isEditing ? (
                    <input
                      className="bg-transparent outline-none w-full font-semibold text-slate-700 text-sm"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm font-semibold text-slate-700">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                  Kata Sandi
                </label>
                <div
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${isEditing ? "border-emerald-400 bg-white shadow-md" : "border-slate-200/60 bg-white"}`}
                >
                  <Lock size={18} className="text-emerald-600" />
                  {isEditing ? (
                    <input
                      type="text"
                      className="bg-transparent outline-none w-full font-semibold text-slate-700 text-sm"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm font-semibold text-slate-700 tracking-widest">
                      ••••••••
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                  WhatsApp
                </label>
                <div
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${isEditing ? "border-emerald-400 bg-white shadow-md" : "border-slate-200/60 bg-white"}`}
                >
                  <Phone size={18} className="text-emerald-600" />
                  {isEditing ? (
                    <input
                      className="bg-transparent outline-none w-full font-semibold text-slate-700 text-sm"
                      value={formData.telp || formData.no_hp}
                      onChange={(e) =>
                        setFormData({ ...formData, telp: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm font-semibold text-slate-700">
                      {user.telp || user.no_hp}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2 pb-4">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                  Alamat Lengkap
                </label>
                <div
                  className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${isEditing ? "border-emerald-400 bg-white shadow-md" : "border-slate-200/60 bg-white"}`}
                >
                  <MapPin size={18} className="text-emerald-600 mt-1" />
                  {isEditing ? (
                    <textarea
                      className="bg-transparent outline-none w-full font-semibold text-slate-700 text-sm h-24 resize-none"
                      value={formData.alamat}
                      onChange={(e) =>
                        setFormData({ ...formData, alamat: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                      {user.alamat}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl font-sans font-bold uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-sm"
                >
                  <LogOut size={16} /> Keluar dari Akun
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan (Dekoratif/Status) */}
        <div className="space-y-6">
          <div className="bg-emerald-600 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden">
            <h4 className="font-bold text-xl italic uppercase leading-tight tracking-tighter relative z-10 font-['Poppins']">
              Siap untuk <br />
              Kemah Lagi?
            </h4>
            <ShieldCheck
              size={120}
              className="absolute -right-10 -bottom-10 opacity-10 rotate-12"
            />
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-3">
              <Award size={24} />
            </div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Level Petualang
            </p>
            <h5 className="font-bold text-slate-800 uppercase tracking-tight font-['Poppins']">
              Pendaki Pro
            </h5>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
