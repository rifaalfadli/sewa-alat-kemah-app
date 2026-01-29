import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  UserPlus,
  Tent,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion } from "framer-motion";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    telp: "",
    alamat: "",
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      id: `USR-${Date.now()}`,
      ...formData,
      role: "Premium Member",
      join_date: new Date().toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      }),
      total_rent: 0,
      avatar_bg: "10b981",
    };

    const existingUsers =
      JSON.parse(localStorage.getItem("registered_users")) || [];
    const isExist = existingUsers.some((u) => u.username === formData.username);

    if (isExist) {
      alert("Username sudah digunakan!");
      return;
    }

    existingUsers.push(newUser);
    localStorage.setItem("registered_users", JSON.stringify(existingUsers));
    alert("Registrasi Berhasil!");
    navigate("/login");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen flex bg-white font-sans flex-row-reverse overflow-hidden"
    >
      {/* Visual Section - Optimized Height */}
      <motion.div
        layoutId="brand-box"
        className="hidden lg:flex lg:w-1/2 relative bg-emerald-950"
      >
        <img
          src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=1200"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          alt="Camping"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-emerald-950 via-transparent to-transparent"></div>
        <div className="relative z-10 p-12 flex flex-col justify-between w-full text-right items-end text-white">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-bold tracking-tight uppercase">
              Tiga Titik Outdoor
            </span>
            <div className="p-1.5 bg-emerald-500 rounded-lg">
              <Tent size={24} />
            </div>
          </div>
          <h1 className="text-4xl font-bold italic leading-tight mb-4">
            Mulai <br /> Petualanganmu.
          </h1>
          <div className="text-emerald-400 text-xs italic">
            © 2026 Tiga Titik Outdoor System.
          </div>
        </div>
      </motion.div>

      {/* Form Section - Centered & Slimmer */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 bg-slate-50 overflow-y-auto lg:overflow-hidden">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-xl p-8 border border-slate-100"
        >
          <div className="mb-6 text-center lg:text-left">
            <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
              Daftar Akun
            </h2>
            <p className="text-slate-400 text-xs font-medium">
              Lengkapi data untuk akses penuh sistem.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Nama */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3.5 top-3 text-slate-300"
                    size={16}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Nama Anda"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all text-xs"
                    onChange={(e) =>
                      setFormData({ ...formData, nama: e.target.value })
                    }
                  />
                </div>
              </div>
              {/* Email */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3.5 top-3 text-slate-300"
                    size={16}
                  />
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all text-xs"
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* WhatsApp */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  WhatsApp
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3.5 top-3 text-slate-300"
                    size={16}
                  />
                  <input
                    type="tel"
                    required
                    placeholder="0812..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all text-xs"
                    onChange={(e) =>
                      setFormData({ ...formData, telp: e.target.value })
                    }
                  />
                </div>
              </div>
              {/* Username */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Username
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3.5 top-3 text-slate-300"
                    size={16}
                  />
                  <input
                    type="text"
                    required
                    placeholder="user_outdoor"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all text-xs"
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-3.5 top-3 text-slate-300"
                  size={16}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all text-xs"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 text-slate-300 hover:text-emerald-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Alamat - Slimmed Down */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Alamat Lengkap
              </label>
              <div className="relative group">
                <MapPin
                  className="absolute left-3.5 top-3 text-slate-300"
                  size={16}
                />
                <textarea
                  required
                  placeholder="Masukkan alamat KTP..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all text-xs h-20 resize-none"
                  onChange={(e) =>
                    setFormData({ ...formData, alamat: e.target.value })
                  }
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-950 text-white py-3.5 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-800 transition-all flex items-center justify-center space-x-2 active:scale-95 shadow-lg shadow-emerald-900/20 text-xs"
            >
              <UserPlus size={16} />
              <span>Daftar Sekarang</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-slate-400 text-xs font-medium">
              Sudah memiliki akun?{" "}
            </span>
            <Link
              to="/login"
              className="text-emerald-700 font-black hover:underline italic text-xs uppercase tracking-tighter"
            >
              Masuk di sini
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Register;
