import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Lock,
  ArrowRight,
  Tent,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react"; // Tambahkan Eye & EyeOff
import { motion } from "framer-motion";
import usersData from "../data/users.json";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State untuk kontrol mata

  const handleLogin = (e) => {
    e.preventDefault();

    const localUsers =
      JSON.parse(localStorage.getItem("registered_users")) || [];
    const allUsers = [...usersData, ...localUsers];

    const foundUser = allUsers.find(
      (u) =>
        (u.username === credentials.username ||
          u.email === credentials.username) &&
        u.password === credentials.password,
    );

    if (foundUser) {
      localStorage.setItem("user_id", foundUser.id);
      navigate("/dashboard", {
        state: { isFirstLogin: true, userName: foundUser.nama },
      });
    } else {
      setError("Username atau Password salah!");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex bg-white font-sans overflow-hidden"
    >
      {/* BRAND SECTION (LEFT) */}
      <motion.div
        layoutId="brand-box"
        className="hidden lg:flex lg:w-1/2 relative bg-emerald-950 overflow-hidden"
      >
        <img
          src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=1200"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          alt="Outdoor"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-transparent"></div>
        <div className="relative z-10 p-16 flex flex-col justify-between w-full text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500 rounded-lg">
              <Tent size={32} />
            </div>
            <span className="text-2xl font-bold tracking-tight uppercase">
              Tiga Titik Outdoor
            </span>
          </div>
          <h1 className="text-5xl font-bold italic leading-tight">
            Jelajahi Alam <br /> Tanpa Batas.
          </h1>
          <div className="text-emerald-400 text-sm">
            © 2026 Tiga Titik Outdoor System.
          </div>
        </div>
      </motion.div>

      {/* LOGIN FORM SECTION (RIGHT) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 border border-slate-100"
        >
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">
              Selamat Datang
            </h2>
            <p className="text-slate-500">
              Masuk untuk mulai petualangan Anda.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold"
            >
              <AlertCircle size={18} /> {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              {/* INPUT USERNAME */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Email / Username
                </label>
                <div className="relative group">
                  <User
                    className="absolute left-4 top-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Username Anda"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none transition-all"
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        username: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* INPUT PASSWORD DENGAN FITUR MATA */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Password
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors"
                    size={20}
                  />
                  <input
                    type={showPassword ? "text" : "password"} // Tipe dinamis
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none transition-all"
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        password: e.target.value,
                      })
                    }
                  />
                  {/* TOMBOL MATA */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-slate-400 hover:text-emerald-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-950 text-white py-4 rounded-2xl font-bold hover:bg-emerald-800 transition-all flex items-center justify-center space-x-2 active:scale-95 shadow-xl"
            >
              <span>Masuk Sekarang</span> <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-10 text-center">
            <span className="text-slate-500 text-sm">
              Belum memiliki akun?{" "}
            </span>
            <Link
              to="/register"
              className="text-emerald-700 font-black hover:underline italic"
            >
              Daftar Sekarang
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;
