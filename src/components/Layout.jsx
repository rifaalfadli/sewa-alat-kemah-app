import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  LayoutGrid,
  ShoppingCart,
  User,
  LogOut,
  Menu,
  Bell,
  Tent,
  Clock,
  Mic,
  MicOff,
} from "lucide-react";
import { motion } from "framer-motion";
import usersData from "../data/users.json";

export default function Layout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // --- STATE AI ASSISTANT ---
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // --- LOGIKA PERINTAH SUARA ---
  const handleVoiceCommand = useCallback(
    (command) => {
      console.log("AI Mendengar:", command);
      const text = command.toLowerCase(); // Paksa ke huruf kecil agar pencocokan akurat

      // 1. Logika Pemetaan Sinonim & Kategori Spesifik
      // Menghubungkan ucapan user dengan kategori yang ada di tools.json
      let searchTarget = "";

      if (
        text.includes("tas") ||
        text.includes("carrier") ||
        text.includes("ransel") ||
        text.includes("keril")
      ) {
        searchTarget = "Tas";
      } else if (
        text.includes("sepatu") ||
        text.includes("alas kaki") ||
        text.includes("boots")
      ) {
        searchTarget = "Sepatu";
      } else if (
        text.includes("tenda") ||
        text.includes("dome") ||
        text.includes("flysheet")
      ) {
        searchTarget = "Tenda";
      } else if (
        text.includes("masak") ||
        text.includes("kompor") ||
        text.includes("nesting") ||
        text.includes("kettle")
      ) {
        searchTarget = "Masak";
      } else if (
        text.includes("aksesoris") ||
        text.includes("matras") ||
        text.includes("senter") ||
        text.includes("lampu") ||
        text.includes("kursi")
      ) {
        searchTarget = "Aksesoris";
      }

      // 2. Eksekusi Perintah Navigasi
      if (text.includes("dashboard") || text.includes("beranda")) {
        speak("Baik, membuka halaman beranda untuk Anda.");
        navigate("/dashboard");
      } else if (searchTarget !== "") {
        // Jika terdeteksi kategori dari pemetaan di atas
        speak(`Baik, menampilkan koleksi ${searchTarget} untuk Anda.`);
        navigate("/category", { state: { voiceSearch: searchTarget } });
      } else if (
        text.includes("kategori") ||
        text.includes("alat") ||
        text.includes("katalog")
      ) {
        speak("Menampilkan katalog peralatan outdoor.");
        navigate("/category");
      } else if (text.includes("keranjang")) {
        speak("Membuka keranjang belanja Anda.");
        navigate("/cart");
      } else if (text.includes("riwayat") || text.includes("pesanan")) {
        speak("Membuka halaman riwayat penyewaan.");
        navigate("/riwayat");
      } else if (
        text.includes("profil") ||
        text.includes("saya") ||
        text.includes("akun")
      ) {
        speak("Membuka profil akun Anda.");
        navigate("/profile");
      } else if (text.includes("cari")) {
        // Fitur pencarian bebas (misal: "Cari Matras")
        const searchItem = text.replace("cari", "").trim();
        speak(`Mencari ${searchItem}, mohon tunggu sebentar.`);
        navigate("/category", { state: { voiceSearch: searchItem } });
      } else {
        // Jika suara terdengar tapi tidak ada keyword yang cocok
        speak("Maaf, saya tidak mengenali perintah tersebut. Bisa diulangi?");
      }
    },
    [navigate],
  );

  useEffect(() => {
    // Auth Logic
    const savedUserId = localStorage.getItem("user_id");
    if (savedUserId) {
      const localUsers =
        JSON.parse(localStorage.getItem("registered_users")) || [];
      const allUsers = [...usersData, ...localUsers];
      const foundUser = allUsers.find((u) => u.id === savedUserId);
      if (foundUser) setUser(foundUser);
      else {
        localStorage.removeItem("user_id");
        navigate("/login");
      }
    } else {
      if (location.pathname !== "/login" && location.pathname !== "/register") {
        navigate("/login");
      }
    }

    // --- INISIALISASI SPEECH RECOGNITION ---
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "id-ID";
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(transcript);
      };

      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
    }

    // Trigger loading voices (penting untuk Chrome/Edge)
    window.speechSynthesis.getVoices();
  }, [location.pathname, navigate, handleVoiceCommand]);

  // --- FUNGSI AI BERBICARA (LOGAT GOOGLE PEREMPUAN) ---
  const speak = (text) => {
    window.speechSynthesis.cancel(); // Bersihkan antrean suara

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    // Mencari suara Perempuan Indonesia (Google Translate Style)
    // Urutan prioritas: Google Indonesia -> Indonesian Female -> id-ID
    const targetVoice =
      voices.find((v) => v.name === "Google Bahasa Indonesia") ||
      voices.find((v) => v.lang === "id-ID" && v.name.includes("Female")) ||
      voices.find((v) => v.lang === "id-ID") ||
      voices.find((v) => v.lang.includes("id"));

    if (targetVoice) {
      utterance.voice = targetVoice;
    }

    utterance.lang = "id-ID";
    utterance.rate = 1.0; // Kecepatan standar Google
    utterance.pitch = 1.1; // Sedikit dinaikkan agar terdengar lebih ramah/perempuan

    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleLogout = () => {
    if (window.confirm("Keluar dari sistem?")) {
      localStorage.removeItem("user_id");
      setUser(null);
      navigate("/login");
    }
  };

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Kategori Alat", path: "/category", icon: LayoutGrid },
    { name: "Keranjang", path: "/cart", icon: ShoppingCart },
    { name: "Riwayat Sewa", path: "/riwayat", icon: Clock },
    { name: "Profil Saya", path: "/profile", icon: User },
  ];

  const NavItem = ({ item, isMobile = false }) => {
    const isActive = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        onClick={() => isMobile && setSidebarOpen(false)}
        className={`flex items-center justify-between group p-3.5 rounded-2xl transition-all duration-300 ${
          isActive
            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-900/20"
            : "text-emerald-100/70 hover:bg-white/10 hover:text-white"
        }`}
      >
        <div className="flex items-center space-x-3">
          <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
          <span
            className={`font-medium tracking-wide ${isActive ? "text-white" : ""}`}
          >
            {item.name}
          </span>
        </div>
        {isActive && (
          <motion.div
            layoutId="activeDot"
            className="w-1.5 h-1.5 bg-white rounded-full"
          />
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex flex-col w-72 bg-emerald-950 text-white p-6 sticky top-0 h-screen border-r border-emerald-900/50">
        <div className="flex items-center space-x-3 mb-12 px-2">
          <div className="p-2 bg-emerald-500 rounded-lg shadow-lg">
            <Tent className="text-white" size={24} />
          </div>
          <span className="text-l font-bold tracking-tighter uppercase">
            TIGA TITIK OUTDOOR
          </span>
        </div>
        <nav className="flex-1 space-y-2">
          <p className="px-4 text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] mb-4">
            Menu Utama
          </p>
          {menu.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>
        <div className="pt-6 border-t border-emerald-900">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full p-4 text-emerald-300 hover:text-red-400 rounded-2xl transition-all"
          >
            <LogOut size={20} />
            <span className="font-semibold text-sm">Logout</span>
          </button>
        </div>
      </aside>
      {/* SIDEBAR MOBILE */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />

          {/* PANEL */}
          <aside className="absolute left-0 top-0 h-full w-72 bg-emerald-950 text-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500 rounded-lg">
                  <Tent size={22} />
                </div>
                <span className="font-bold uppercase text-sm">
                  TIGA TITIK OUTDOOR
                </span>
              </div>

              <button
                onClick={() => setSidebarOpen(false)}
                className="text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>

            <nav className="space-y-2">
              {menu.map((item) => (
                <NavItem key={item.path} item={item} isMobile />
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-emerald-900">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full p-4 text-emerald-300 hover:text-red-400 rounded-2xl"
              >
                <LogOut size={20} />
                <span className="font-semibold text-sm">Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white/70 backdrop-blur-md sticky top-0 z-50 px-6 lg:px-10 py-3 border-b border-slate-200/60 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <button
              className="lg:hidden p-2.5 text-slate-600"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>

            {/* Navigasi Voice AI */}
            <button
              onClick={startListening}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all duration-300 border ${
                isListening
                  ? "bg-red-500 border-red-400 text-white shadow-lg animate-pulse"
                  : "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100"
              }`}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">
                {isListening ? "Mendengarkan..." : "Bicara dengan AI"}
              </span>
            </button>

            <div className="hidden md:flex items-center relative max-w-xs w-full group ml-2">
              <LayoutGrid
                size={16}
                className="absolute left-3.5 text-slate-400"
              />
              <input
                type="text"
                placeholder="Cari perlengkapan..."
                className="w-full bg-slate-100/50 border border-transparent focus:bg-white py-2 pl-10 pr-4 rounded-xl text-xs outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-5">
            <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div
              onClick={() => navigate("/profile")}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="flex flex-col text-right hidden sm:flex">
                <span className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                  {user?.nama || "Petualang"}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">
                  {user?.role || "Member"}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-md">
                <div className="w-full h-full bg-white rounded-[9px] flex items-center justify-center text-emerald-600">
                  <User size={20} strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 lg:p-10 flex-1 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>

        <footer className="px-10 py-6 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] border-t border-slate-100 flex justify-between">
          <span>&copy; 2026 Tiga Titik Outdoor</span>
          <div className="flex gap-6">
            <span className="hover:text-emerald-600 cursor-pointer">
              Bantuan
            </span>
            <span className="hover:text-emerald-600 cursor-pointer">
              Ketentuan
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
