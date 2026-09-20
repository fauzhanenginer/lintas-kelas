import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  User, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Lock, 
  ArrowLeftRight, 
  LogOut, 
  Clock, 
  Sparkles, 
  Upload, 
  Image as ImageIcon, 
  Download, 
  Trash2, 
  Moon, 
  Sun, 
  Megaphone, 
  Edit3, 
  AlertCircle, 
  Search, 
  X, 
  CalendarCheck2,
  Sliders,
  Users,
  FileText,
  Activity
} from 'lucide-react';
import { SCHEDULE_DATA, LIST_PJMK, TARGET_CLASSES_LIST, ALL_CLASSES_SCHEDULES } from './data/schedules';

import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('lintas_theme') === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('lintas_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const [searchScheduleQuery, setSearchScheduleQuery] = useState('');
  const [selectedDayFilter, setSelectedDayFilter] = useState('Semua');

  // --- 1. FIREBASE: BROADCAST NOTICE ---
  const [broadcastNotice, setBroadcastNotice] = useState('📢 Info: Pastikan izin lintas kelas diajukan sebelum batas pukul 20:00 WIB!');
  const [isEditingNotice, setIsEditingNotice] = useState(false);
  const [newNoticeText, setNewNoticeText] = useState(broadcastNotice);

  useEffect(() => {
    const unsubNotice = onSnapshot(doc(db, 'settings', 'broadcast'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().text) {
        setBroadcastNotice(docSnap.data().text);
        setNewNoticeText(docSnap.data().text);
      }
    }, (err) => console.log('Notice listener:', err));

    return () => unsubNotice();
  }, []);

  const handleSaveNotice = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'settings', 'broadcast'), { text: newNoticeText });
      setIsEditingNotice(false);
    } catch (err) {
      alert("Gagal memperbarui pengumuman: " + err.message);
    }
  };

  // --- 2. FIREBASE: USER DATABASE ---
  const [registeredUsers, setRegisteredUsers] = useState([]);

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersList = snapshot.docs.map(doc => doc.data());
      setRegisteredUsers(usersList);
    }, (err) => console.log('Users listener:', err));

    return () => unsubUsers();
  }, []);

  const [currentUser, setCurrentUser] = useState(() => {
    const session = localStorage.getItem('lintas_active_session');
    if (session) {
      try { return JSON.parse(session); } catch (e) {}
    }
    return null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('lintas_active_session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('lintas_active_session');
    }
  }, [currentUser]);

  const [authMode, setAuthMode] = useState('register');
  const [inputName, setInputName] = useState('');
  const [inputNim, setInputNim] = useState('');
  const [authError, setAuthError] = useState('');

  const [savedPjmkInfo, setSavedPjmkInfo] = useState(() => {
    const saved = localStorage.getItem('lintas_saved_pjmk');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  const [activeRole, setActiveRole] = useState(() => {
    return localStorage.getItem('lintas_active_role') || 'mahasiswa';
  });

  useEffect(() => {
    localStorage.setItem('lintas_active_role', activeRole);
  }, [activeRole]);

  useEffect(() => {
    if (savedPjmkInfo) {
      localStorage.setItem('lintas_saved_pjmk', JSON.stringify(savedPjmkInfo));
    } else {
      localStorage.removeItem('lintas_saved_pjmk');
    }
  }, [savedPjmkInfo]);

  // Countdown Batas Pukul 20:00 WIB
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, isPassed: false });

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const cutoff = new Date();
      cutoff.setHours(20, 0, 0, 0);

      const diff = cutoff - now;
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isPassed: true });
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds, isPassed: false });
      }
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- 3. FIREBASE: DATA SUBMISSIONS ---
  const [submissions, setSubmissions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'submissions'), orderBy('createdAt', 'desc'));
    const unsubSubmissions = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      setSubmissions(docs);
      setLoadingData(false);
    }, (err) => {
      console.error("Gagal sinkron Firestore:", err);
      setLoadingData(false);
    });

    return () => unsubSubmissions();
  }, []);

  const [statusFilter, setStatusFilter] = useState('Semua');

  // Form Izin
  const [formData, setFormData] = useState({
    matkulNama: SCHEDULE_DATA[0].matkul,
    matkulTipe: SCHEDULE_DATA[0].tipe,
    matkulFull: `${SCHEDULE_DATA[0].matkul} (${SCHEDULE_DATA[0].tipe})`,
    dosenAsal: SCHEDULE_DATA[0].dosen,
    kelasAsal: 'TI26G',
    kelasTujuan: TARGET_CLASSES_LIST[0],
    pjmk: SCHEDULE_DATA[0].pjmk,
    alasan: '',
    lampiran: null
  });

  const matchedTargetSchedule = ALL_CLASSES_SCHEDULES.find((s) => 
    s.kelas.toUpperCase() === formData.kelasTujuan.toUpperCase() &&
    s.matkul.toLowerCase() === formData.matkulNama.toLowerCase() &&
    s.tipe.toLowerCase() === formData.matkulTipe.toLowerCase()
  );

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImageModal, setPreviewImageModal] = useState(null);

  const [rejectModalData, setRejectModalData] = useState(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  const [showPjmkLoginModal, setShowPjmkLoginModal] = useState(false);
  const [selectedPjmkId, setSelectedPjmkId] = useState(LIST_PJMK[0]?.id || 1);
  const [pjmkPasswordInput, setPjmkPasswordInput] = useState('');
  const [pjmkPasswordError, setPjmkPasswordError] = useState('');

  // --- STATE SUPER ADMIN / MONITORING PANEL ---
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPinError, setAdminPinError] = useState('');

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPinInput === '2609') { // PIN Admin Pengembang
      setIsAdminAuthenticated(true);
      setShowAdminModal(false);
      setActiveTab('admin');
      setAdminPinInput('');
      setAdminPinError('');
    } else {
      setAdminPinError('PIN Pengembang salah!');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) {
        alert("Ukuran gambar maksimal 1.5 MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, lampiran: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    const cleanNim = inputNim.trim();
    const cleanName = inputName.trim();

    if (!/^\d{6,14}$/.test(cleanNim)) {
      setAuthError('Format NIM tidak valid. Gunakan 6-14 digit angka.');
      return;
    }

    if (registeredUsers.some(u => u.nim === cleanNim)) {
      setAuthError('NIM ini sudah terdaftar di database. Silakan pilih Masuk.');
      return;
    }

    const newUser = { 
      name: cleanName, 
      nim: cleanNim, 
      kelasAsal: 'TI26G',
      registeredAt: Date.now()
    };

    try {
      await setDoc(doc(db, 'users', cleanNim), newUser);
      setCurrentUser(newUser);
      setInputName('');
      setInputNim('');
    } catch (err) {
      setAuthError('Gagal mendaftar: ' + err.message);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    const cleanNim = inputNim.trim();
    const cleanName = inputName.trim().toLowerCase();

    const foundUser = registeredUsers.find(
      u => u.nim === cleanNim && u.name.toLowerCase() === cleanName
    );

    if (!foundUser) {
      setAuthError('Nama atau NIM tidak cocok dengan database.');
      return;
    }

    setCurrentUser(foundUser);
    setInputName('');
    setInputNim('');
  };

  const handleLogout = () => {
    if (window.confirm('Keluar dari sesi akun ini?')) {
      setCurrentUser(null);
      setActiveRole('mahasiswa');
      setIsAdminAuthenticated(false);
      localStorage.removeItem('lintas_active_session');
    }
  };

  const handleSelectSchedule = (item) => {
    setFormData({
      ...formData,
      matkulNama: item.matkul,
      matkulTipe: item.tipe,
      matkulFull: `${item.matkul} (${item.tipe})`,
      dosenAsal: item.dosen,
      pjmk: item.pjmk
    });
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();
    if (timeLeft.isPassed) {
      alert('Batas waktu pengajuan hari ini telah ditutup (Maksimal pukul 20:00 WIB).');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const timeFormatted = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    const targetDetailsStr = matchedTargetSchedule 
      ? `${matchedTargetSchedule.hari} • ${matchedTargetSchedule.jam} • R. ${matchedTargetSchedule.ruangan}`
      : 'Jadwal Menyesuaikan';

    const newEntry = {
      nama: currentUser.name,
      nim: currentUser.nim,
      matkul: formData.matkulFull,
      dosen: matchedTargetSchedule ? matchedTargetSchedule.dosen : formData.dosenAsal,
      kelasAsal: 'TI26G',
      kelasTujuan: formData.kelasTujuan,
      detailTujuan: targetDetailsStr,
      pjmk: formData.pjmk,
      alasan: formData.alasan,
      lampiran: formData.lampiran || null,
      status: 'Menunggu',
      catatanPenolakan: '',
      timestamp: timeFormatted,
      fullDateTime: `${dateFormatted} • ${timeFormatted}`,
      createdAt: Date.now()
    };

    try {
      await addDoc(collection(db, 'submissions'), newEntry);
      setShowConfirmModal(false);
      setFormData({ ...formData, alasan: '', lampiran: null });
      alert("✅ Izin berhasil diajukan dan tersimpan di database online!");
    } catch (err) {
      alert("Gagal mengirim data izin: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await updateDoc(doc(db, 'submissions', id), {
        status: 'Disetujui',
        catatanPenolakan: ''
      });
    } catch (err) {
      alert("Gagal menyetujui: " + err.message);
    }
  };

  const handleOpenRejectModal = (submission) => {
    setRejectModalData(submission);
    setRejectionReasonInput('Kuota kelas tujuan sudah penuh');
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!rejectModalData) return;
    try {
      await updateDoc(doc(db, 'submissions', rejectModalData.id), {
        status: 'Ditolak',
        catatanPenolakan: rejectionReasonInput.trim() || 'Tidak memenuhi kriteria'
      });
      setRejectModalData(null);
      setRejectionReasonInput('');
    } catch (err) {
      alert("Gagal memperbarui status: " + err.message);
    }
  };

  const handleDeleteSubmission = async (id) => {
    if (window.confirm('Batalkan pengajuan izin ini? Data akan dihapus dari server.')) {
      try {
        await deleteDoc(doc(db, 'submissions', id));
      } catch (err) {
        alert("Gagal membatalkan: " + err.message);
      }
    }
  };

  const handleClearStudentHistory = async () => {
    if (window.confirm('Bersihkan seluruh riwayat izin Anda di server?')) {
      const myDocs = submissions.filter(s => s.nim === currentUser.nim);
      for (const d of myDocs) {
        await deleteDoc(doc(db, 'submissions', d.id));
      }
      alert('Riwayat izin Anda telah dibersihkan.');
    }
  };

  const handleClearPjmkHistory = async () => {
    if (window.confirm(`Hapus semua arsip izin untuk mata kuliah ${savedPjmkInfo?.matkul}?`)) {
      const pjmkDocs = submissions.filter(s => s.pjmk === savedPjmkInfo?.nama);
      for (const d of pjmkDocs) {
        await deleteDoc(doc(db, 'submissions', d.id));
      }
      alert('Semua arsip permohonan mata kuliah ini telah dikosongkan.');
    }
  };

  const handlePjmkLoginSubmit = (e) => {
    e.preventDefault();
    if (pjmkPasswordInput === 'ubpk2026') {
      const pjmkTarget = LIST_PJMK.find(p => p.id === Number(selectedPjmkId));
      setSavedPjmkInfo(pjmkTarget);
      setActiveRole('pjmk');
      setShowPjmkLoginModal(false);
      setPjmkPasswordInput('');
      setPjmkPasswordError('');
      setActiveTab('home');
      alert(`Akses PJMK (${pjmkTarget.nama}) berhasil diaktifkan.`);
    } else {
      setPjmkPasswordError('Kata sandi salah. Akses ditolak.');
    }
  };

  const theme = {
    bg: isDarkMode ? '#090d16' : '#f8fafc',
    cardBg: isDarkMode ? '#131c2e' : '#ffffff',
    cardBorder: isDarkMode ? '#1e293b' : '#f1f5f9',
    textMain: isDarkMode ? '#f1f5f9' : '#0f172a',
    textMuted: isDarkMode ? '#94a3b8' : '#64748b',
    subCard: isDarkMode ? '#0d1524' : '#f8fafc',
    inputBg: isDarkMode ? '#0d1524' : '#f8fafc',
    inputBorder: isDarkMode ? '#334155' : '#e2e8f0'
  };

  // Filter Jadwal
  const filteredScheduleData = SCHEDULE_DATA.filter((item) => {
    const matchDay = selectedDayFilter === 'Semua' || item.hari.toLowerCase() === selectedDayFilter.toLowerCase();
    const queryStr = searchScheduleQuery.trim().toLowerCase();
    const matchQuery = 
      queryStr === '' ||
      item.matkul.toLowerCase().includes(queryStr) ||
      item.ruangan.toLowerCase().includes(queryStr) ||
      item.dosen.toLowerCase().includes(queryStr) ||
      item.pjmk.toLowerCase().includes(queryStr) ||
      item.hari.toLowerCase().includes(queryStr) ||
      item.tipe.toLowerCase().includes(queryStr);
    return matchDay && matchQuery;
  });

  const rawSubmissionsForPjmk = savedPjmkInfo 
    ? submissions.filter(s => s.pjmk === savedPjmkInfo.nama)
    : [];

  const filteredSubmissionsForPjmk = rawSubmissionsForPjmk.filter(item => {
    if (statusFilter === 'Semua') return true;
    return item.status === statusFilter;
  });

  // --- LOGIKA PERHITUNGAN DATA HARIAN (KONTROL ADMIN) ---
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayStartTime = todayStart.getTime();

  const todaySubmissions = submissions.filter(s => (s.createdAt || 0) >= todayStartTime);
  const todayApproved = todaySubmissions.filter(s => s.status === 'Disetujui').length;
  const todayPending = todaySubmissions.filter(s => s.status === 'Menunggu').length;

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '440px', 
      minHeight: '100vh', 
      minHeight: '100dvh',
      backgroundColor: theme.bg, 
      color: theme.textMain, 
      position: 'relative', 
      display: 'flex', 
      flexDirection: 'column', 
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)', 
      transition: 'background-color 0.3s ease', 
      margin: '0 auto',
      paddingBottom: '100px',
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      
      {/* HEADER */}
      <header style={{ 
        background: activeTab === 'admin'
          ? 'linear-gradient(135deg, #451a03 0%, #78350f 100%)'
          : activeRole === 'pjmk' 
            ? 'linear-gradient(135deg, #090d16 0%, #1e293b 100%)' 
            : isDarkMode 
              ? 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)' 
              : 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', 
        color: '#fff', 
        padding: '22px 20px 18px', 
        borderBottomLeftRadius: '24px', 
        borderBottomRightRadius: '24px', 
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)', 
        transition: 'all 0.3s ease' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase', opacity: 0.85, fontWeight: 600 }}>
              <Sparkles size={13} />
              {activeTab === 'admin' 
                ? 'Super Developer Hub'
                : activeRole === 'pjmk' 
                  ? 'Dashboard Pengurus' 
                  : 'Sistem Izin Kampus (Cloud)'}
            </div>
            <h1 style={{ margin: '4px 0 0', fontSize: '1.35rem', fontWeight: 800 }}>
              {activeTab === 'admin' 
                ? 'KONTROL UTAMA' 
                : activeRole === 'pjmk' 
                  ? savedPjmkInfo?.roleName?.toUpperCase() 
                  : 'LINTAS KELAS'}
            </h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              title={isDarkMode ? "Ganti ke Light Mode" : "Ganti ke Dark Mode"}
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: 'none', color: '#fff', padding: '7px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {isDarkMode ? <Sun size={15} color="#facc15" /> : <Moon size={15} />}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '6px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600 }}>
              <span className="pulse-dot" style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#4ade80' }}></span>
              TI26G
            </div>
          </div>
        </div>

        {/* SWITCH PERAN CEPAT */}
        {currentUser && savedPjmkInfo && activeTab !== 'admin' && (
          <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.3)', padding: '6px 8px 6px 14px', borderRadius: '999px' }}>
            <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>
              Peran: <strong>{activeRole === 'pjmk' ? savedPjmkInfo.nama : 'Mahasiswa'}</strong>
            </span>
            <button 
              onClick={() => { setActiveRole(activeRole === 'pjmk' ? 'mahasiswa' : 'pjmk'); setActiveTab('home'); }}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#fff', color: '#0f172a', border: 'none', padding: '5px 12px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
            >
              <ArrowLeftRight size={12} /> Beralih ke {activeRole === 'pjmk' ? 'Mahasiswa' : 'PJMK'}
            </button>
          </div>
        )}
      </header>

      {/* VIEW: BELUM LOGIN */}
      {!currentUser ? (
        <main className="animate-fade" style={{ padding: '24px 20px', flex: 1 }}>
          <div style={{ backgroundColor: theme.cardBg, borderRadius: '20px', padding: '24px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', border: `1px solid ${theme.cardBorder}` }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', margin: '0 auto 12px', borderRadius: '14px', background: isDarkMode ? '#1e293b' : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                <User size={24} />
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: theme.textMain, margin: 0 }}>
                {authMode === 'register' ? 'Buat Akun Mahasiswa' : 'Masuk ke Akun'}
              </h2>
              <p style={{ fontSize: '0.8rem', color: theme.textMuted, margin: '6px 0 0' }}>
                {authMode === 'register' ? 'Daftarkan nama & NIM Anda ke server' : 'Gunakan nama & NIM yang sudah terdaftar'}
              </p>
            </div>

            <form onSubmit={authMode === 'register' ? handleRegister : handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: theme.textMuted, display: 'block', marginBottom: '6px' }}>Nama Lengkap</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Muhammad Fauzhan" 
                  value={inputName} 
                  onChange={(e) => setInputName(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: `1.5px solid ${theme.inputBorder}`, fontSize: '0.88rem', outline: 'none', backgroundColor: theme.inputBg, color: theme.textMain, boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: theme.textMuted, display: 'block', marginBottom: '6px' }}>Nomor Induk Mahasiswa (NIM)</label>
                <input 
                  type="text" 
                  placeholder="Contoh: 16012007" 
                  value={inputNim} 
                  onChange={(e) => setInputNim(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: `1.5px solid ${theme.inputBorder}`, fontSize: '0.88rem', outline: 'none', backgroundColor: theme.inputBg, color: theme.textMain, boxSizing: 'border-box' }}
                />
              </div>

              {authError && (
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c', padding: '10px 14px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 500 }}>
                  {authError}
                </div>
              )}

              <button 
                type="submit" 
                style={{ marginTop: '6px', background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 8px 18px -4px rgba(37,99,235,0.4)' }}
              >
                {authMode === 'register' ? 'Daftar Sekarang' : 'Masuk Aplikasi'}
              </button>
            </form>

            <div style={{ marginTop: '18px', textAlign: 'center', fontSize: '0.82rem', color: theme.textMuted }}>
              {authMode === 'register' ? (
                <span>Sudah punya akun? <strong style={{ color: '#38bdf8', cursor: 'pointer' }} onClick={() => { setAuthMode('login'); setAuthError(''); }}>Masuk di sini</strong></span>
              ) : (
                <span>Belum punya akun? <strong style={{ color: '#38bdf8', cursor: 'pointer' }} onClick={() => { setAuthMode('register'); setAuthError(''); }}>Daftar baru</strong></span>
              )}
            </div>
          </div>
        </main>
      ) : (
        /* VIEW: SETELAH LOGIN */
        <main className="animate-fade" style={{ padding: '16px 16px 20px', flex: 1 }}>

          {/* VIEW TAB KHUSUS SUPER ADMIN */}
          {activeTab === 'admin' ? (
            <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* STATUS KONTROL */}
              <div style={{ backgroundColor: theme.cardBg, borderRadius: '18px', padding: '18px', border: `1.5px solid ${theme.cardBorder}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={20} color="#f59e0b" />
                    <h2 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: theme.textMain }}>Aktivitas Hari Ini</h2>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#f59e0b', backgroundColor: isDarkMode ? '#451a03' : '#fef3c7', padding: '3px 8px', borderRadius: '999px', fontWeight: 700 }}>
                    Real-time Cloud
                  </span>
                </div>

                {/* KARTU STATISTIK */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  <div style={{ backgroundColor: theme.subCard, padding: '12px', borderRadius: '12px', border: `1px solid ${theme.cardBorder}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: theme.textMuted, fontSize: '0.72rem', fontWeight: 600 }}>
                      <Users size={14} /> Total Akun
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
                      {registeredUsers.length}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: theme.textMuted }}>Mahasiswa terdaftar</div>
                  </div>

                  <div style={{ backgroundColor: theme.subCard, padding: '12px', borderRadius: '12px', border: `1px solid ${theme.cardBorder}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: theme.textMuted, fontSize: '0.72rem', fontWeight: 600 }}>
                      <FileText size={14} /> Izin Hari Ini
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#4ade80', marginTop: '4px' }}>
                      {todaySubmissions.length}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: theme.textMuted }}>{todayApproved} disetujui, {todayPending} proses</div>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveTab('home')}
                  style={{ marginTop: '14px', width: '100%', background: 'transparent', border: `1px solid ${theme.inputBorder}`, color: theme.textMuted, padding: '8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Kembali ke Menu Utama
                </button>
              </div>

              {/* LIST PENGGUNA TERDAFTAR */}
              <div style={{ backgroundColor: theme.cardBg, borderRadius: '18px', padding: '16px', border: `1px solid ${theme.cardBorder}` }}>
                <h3 style={{ fontSize: '0.88rem', fontWeight: 700, margin: '0 0 10px 0', color: theme.textMain }}>
                  Daftar Mahasiswa Terdaftar ({registeredUsers.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
                  {registeredUsers.map((u, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', backgroundColor: theme.subCard, borderRadius: '8px', border: `1px solid ${theme.cardBorder}` }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{u.name}</div>
                        <div style={{ fontSize: '0.7rem', color: theme.textMuted }}>NIM: {u.nim}</div>
                      </div>
                      <span style={{ fontSize: '0.68rem', color: '#4ade80', fontWeight: 600 }}>Aktif</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* LIST IZIN MASUK HARI INI */}
              <div style={{ backgroundColor: theme.cardBg, borderRadius: '18px', padding: '16px', border: `1px solid ${theme.cardBorder}` }}>
                <h3 style={{ fontSize: '0.88rem', fontWeight: 700, margin: '0 0 10px 0', color: theme.textMain }}>
                  Semua Izin Masuk Hari Ini ({todaySubmissions.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
                  {todaySubmissions.length === 0 ? (
                    <div style={{ textAlign: 'center', color: theme.textMuted, fontSize: '0.75rem', padding: '16px 0' }}>
                      Belum ada permohonan izin yang diajukan hari ini.
                    </div>
                  ) : (
                    todaySubmissions.map((sub) => (
                      <div key={sub.id} style={{ padding: '8px 10px', backgroundColor: theme.subCard, borderRadius: '8px', border: `1px solid ${theme.cardBorder}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{sub.nama}</span>
                          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: sub.status === 'Disetujui' ? '#4ade80' : sub.status === 'Ditolak' ? '#f87171' : '#facc15' }}>{sub.status}</span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: theme.textMuted }}>{sub.matkul} ➔ Kelas {sub.kelasTujuan}</div>
                        <div style={{ fontSize: '0.68rem', color: theme.textMuted, marginTop: '2px' }}>Waktu: {sub.timestamp}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          ) : (
            /* VIEW TAB UTAMA (MAHASISWA & PJMK) */
            <>
              {/* RUNNING NOTICE */}
              <div style={{ 
                backgroundColor: isDarkMode ? '#1e293b' : '#eff6ff', 
                border: `1px solid ${isDarkMode ? '#334155' : '#bfdbfe'}`, 
                borderRadius: '16px', 
                padding: '10px 14px', 
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                  <Megaphone size={16} color="#3b82f6" style={{ flexShrink: 0 }} />
                  <div style={{ fontSize: '0.78rem', color: isDarkMode ? '#93c5fd' : '#1e40af', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {broadcastNotice}
                  </div>
                </div>
                {activeRole === 'pjmk' && (
                  <button 
                    onClick={() => { setNewNoticeText(broadcastNotice); setIsEditingNotice(!isEditingNotice); }}
                    style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                    title="Edit Pengumuman"
                  >
                    <Edit3 size={14} />
                  </button>
                )}
              </div>

              {isEditingNotice && (
                <form onSubmit={handleSaveNotice} style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: '12px', padding: '10px', marginBottom: '14px' }}>
                  <label style={{ fontSize: '0.72rem', color: theme.textMuted, display: 'block', marginBottom: '4px' }}>Ubah Pengumuman (Real-time):</label>
                  <input 
                    type="text" 
                    value={newNoticeText} 
                    onChange={(e) => setNewNoticeText(e.target.value)} 
                    required
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: `1px solid ${theme.inputBorder}`, backgroundColor: theme.inputBg, color: theme.textMain, fontSize: '0.8rem', boxSizing: 'border-box', marginBottom: '8px' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                    <button type="button" onClick={() => setIsEditingNotice(false)} style={{ padding: '4px 8px', border: `1px solid ${theme.inputBorder}`, background: 'transparent', color: theme.textMuted, borderRadius: '6px', fontSize: '0.72rem', cursor: 'pointer' }}>Batal</button>
                    <button type="submit" style={{ padding: '4px 10px', border: 'none', background: '#2563eb', color: '#fff', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>Simpan Cloud</button>
                  </div>
                </form>
              )}

              {/* BANNER COUNTDOWN */}
              <div style={{ 
                backgroundColor: timeLeft.isPassed ? (isDarkMode ? '#3b1219' : '#fef2f2') : (isDarkMode ? '#062e1e' : '#f0fdf4'), 
                border: `1px solid ${timeLeft.isPassed ? (isDarkMode ? '#881337' : '#fecaca') : (isDarkMode ? '#065f46' : '#bbf7d0')}`, 
                borderRadius: '16px', 
                padding: '12px 16px', 
                marginBottom: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} color={timeLeft.isPassed ? '#f87171' : '#4ade80'} />
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: timeLeft.isPassed ? '#fca5a5' : '#86efac' }}>
                      {timeLeft.isPassed ? 'Batas Pengajuan Berakhir' : 'Batas Izin Jam 20:00 WIB'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: theme.textMuted }}>
                      {timeLeft.isPassed ? 'Sistem dikunci sampai besok' : 'Sisa waktu pengajuan hari ini'}
                    </div>
                  </div>
                </div>
                <div style={{ 
                  fontWeight: 800, 
                  fontSize: '0.95rem', 
                  color: timeLeft.isPassed ? '#f87171' : '#4ade80',
                  fontVariantNumeric: 'tabular-nums' 
                }}>
                  {timeLeft.isPassed 
                    ? '00:00:00' 
                    : `${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`}
                </div>
              </div>

              {/* TAB 1: MODE MAHASISWA */}
              {activeTab === 'home' && activeRole === 'mahasiswa' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* JADWAL DENGAN FILTER & SEARCH */}
                  <div style={{ backgroundColor: theme.cardBg, borderRadius: '18px', padding: '16px', border: `1px solid ${theme.cardBorder}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h2 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: theme.textMain }}>Jadwal Resmi Kelas TI26G</h2>
                      <span style={{ fontSize: '0.7rem', color: theme.textMuted, backgroundColor: theme.subCard, padding: '3px 8px', borderRadius: '999px' }}>Semester 1</span>
                    </div>

                    {/* SEARCH BAR */}
                    <div style={{ position: 'relative', marginBottom: '10px' }}>
                      <Search size={15} color={theme.textMuted} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input 
                        type="text"
                        placeholder="Cari matkul, dosen, ruangan, atau hari..."
                        value={searchScheduleQuery}
                        onChange={(e) => setSearchScheduleQuery(e.target.value)}
                        style={{ 
                          width: '100%', 
                          padding: '8px 32px 8px 32px', 
                          borderRadius: '10px', 
                          border: `1.5px solid ${theme.inputBorder}`, 
                          backgroundColor: theme.inputBg, 
                          color: theme.textMain, 
                          fontSize: '0.8rem', 
                          outline: 'none',
                          boxSizing: 'border-box' 
                        }}
                      />
                      {searchScheduleQuery && (
                        <button 
                          onClick={() => setSearchScheduleQuery('')}
                          style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: theme.textMuted, cursor: 'pointer', padding: 0 }}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {/* PILLS FILTER HARI */}
                    <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '4px' }}>
                      {['Semua', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map((day) => {
                        const isSelected = selectedDayFilter.toLowerCase() === day.toLowerCase();
                        return (
                          <button
                            key={day}
                            onClick={() => setSelectedDayFilter(day)}
                            style={{
                              flexShrink: 0,
                              padding: '5px 12px',
                              borderRadius: '999px',
                              fontSize: '0.72rem',
                              fontWeight: isSelected ? 700 : 500,
                              border: isSelected ? 'none' : `1px solid ${theme.inputBorder}`,
                              backgroundColor: isSelected ? (isDarkMode ? '#38bdf8' : '#1e3a8a') : theme.subCard,
                              color: isSelected ? (isDarkMode ? '#0f172a' : '#ffffff') : theme.textMuted,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>

                    {/* DAFTAR JADWAL */}
                    <div style={{ maxHeight: '185px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
                      {filteredScheduleData.length === 0 ? (
                        <div style={{ padding: '20px 10px', textAlign: 'center', color: theme.textMuted, fontSize: '0.8rem' }}>
                          Tidak ditemukan jadwal untuk "<strong>{searchScheduleQuery || selectedDayFilter}</strong>".
                          <div style={{ marginTop: '6px' }}>
                            <button 
                              onClick={() => { setSearchScheduleQuery(''); setSelectedDayFilter('Semua'); }}
                              style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                            >
                              Reset Filter
                            </button>
                          </div>
                        </div>
                      ) : (
                        filteredScheduleData.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.subCard, padding: '10px 12px', borderRadius: '12px', border: `1px solid ${theme.cardBorder}` }}>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: theme.textMain }}>{item.matkul} <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 600 }}>({item.tipe})</span></div>
                              <div style={{ fontSize: '0.74rem', color: theme.textMuted, marginTop: '2px' }}>
                                <strong style={{ color: isDarkMode ? '#93c5fd' : '#2563eb' }}>{item.hari}</strong> • {item.jam} • R. {item.ruangan}
                              </div>
                              <div style={{ fontSize: '0.7rem', color: theme.textMuted, marginTop: '1px' }}>
                                Dosen: {item.dosen}
                              </div>
                            </div>
                            <button 
                              onClick={() => handleSelectSchedule(item)} 
                              style={{ backgroundColor: isDarkMode ? '#1e3a8a' : '#eff6ff', color: isDarkMode ? '#93c5fd' : '#2563eb', border: `1px solid ${isDarkMode ? '#2563eb' : '#dbeafe'}`, padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                            >
                              Pilih
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* FORM PENGAJUAN */}
                  <form onSubmit={handlePreSubmit} style={{ backgroundColor: theme.cardBg, borderRadius: '18px', padding: '18px', border: `1px solid ${theme.cardBorder}` }}>
                    <h2 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 14px 0', color: theme.textMain }}>Formulir Izin Lintas Kelas</h2>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 600, color: theme.textMuted }}>Mata Kuliah Pilihan</label>
                        <input 
                          type="text" 
                          value={formData.matkulFull} 
                          readOnly
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: `1.5px solid ${theme.inputBorder}`, fontSize: '0.85rem', marginTop: '3px', outline: 'none', backgroundColor: theme.subCard, color: theme.textMain, fontWeight: 700, boxSizing: 'border-box' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 600, color: theme.textMuted }}>Pilih Kelas Tujuan Lintas Kuliah</label>
                        <select 
                          value={formData.kelasTujuan} 
                          onChange={(e) => setFormData({ ...formData, kelasTujuan: e.target.value })} 
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: `1.5px solid ${theme.inputBorder}`, fontSize: '0.85rem', marginTop: '3px', backgroundColor: theme.inputBg, color: theme.textMain, outline: 'none', boxSizing: 'border-box' }}
                        >
                          {TARGET_CLASSES_LIST.map((cls, idx) => (
                            <option key={idx} value={cls}>Kelas {cls}</option>
                          ))}
                        </select>
                      </div>

                      {/* KOTAK JADWAL OTOMATIS */}
                      <div style={{ 
                        backgroundColor: isDarkMode ? '#062e1e' : '#f0fdf4', 
                        border: `1.5px solid ${isDarkMode ? '#065f46' : '#bbf7d0'}`, 
                        borderRadius: '12px', 
                        padding: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isDarkMode ? '#86efac' : '#15803d', fontWeight: 700, fontSize: '0.78rem' }}>
                          <CalendarCheck2 size={15} /> Detail Jadwal di {formData.kelasTujuan}:
                        </div>
                        {matchedTargetSchedule ? (
                          <div style={{ fontSize: '0.76rem', color: isDarkMode ? '#d1fae5' : '#166534', lineHeight: 1.5, marginTop: '2px' }}>
                            <div>📅 <strong>Hari & Jam:</strong> {matchedTargetSchedule.hari}, {matchedTargetSchedule.jam}</div>
                            <div>📍 <strong>Ruangan:</strong> Ruang {matchedTargetSchedule.ruangan}</div>
                            <div>👨‍🏫 <strong>Dosen Pengampu:</strong> {matchedTargetSchedule.dosen}</div>
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.74rem', color: theme.textMuted, fontStyle: 'italic' }}>
                            Mata kuliah ini tidak tersedia di {formData.kelasTujuan}. Silakan pilih kelas tujuan lainnya.
                          </div>
                        )}
                      </div>

                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 600, color: theme.textMuted }}>PJMK Penerima Laporan</label>
                        <select 
                          value={formData.pjmk} 
                          onChange={(e) => setFormData({ ...formData, pjmk: e.target.value })} 
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: `1.5px solid ${theme.inputBorder}`, fontSize: '0.85rem', marginTop: '3px', backgroundColor: theme.inputBg, color: theme.textMain, outline: 'none', boxSizing: 'border-box' }}
                        >
                          {LIST_PJMK.map((p) => (
                            <option key={p.id} value={p.nama}>{p.roleName} - {p.nama}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 600, color: theme.textMuted }}>Alasan Lintas Kelas</label>
                        <textarea 
                          placeholder="Alasan izin (contoh: shift kerja lembur malam)" 
                          rows="2" 
                          value={formData.alasan} 
                          onChange={(e) => setFormData({ ...formData, alasan: e.target.value })} 
                          required 
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: `1.5px solid ${theme.inputBorder}`, fontSize: '0.85rem', marginTop: '3px', outline: 'none', resize: 'none', backgroundColor: theme.inputBg, color: theme.textMain, boxSizing: 'border-box' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 600, color: theme.textMuted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Upload size={13} /> Lampiran Bukti Surat / Jadwal Shift (Opsional)
                        </label>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileChange} 
                          style={{ width: '100%', fontSize: '0.78rem', marginTop: '4px', border: `1px dashed ${theme.inputBorder}`, padding: '8px', borderRadius: '8px', backgroundColor: theme.inputBg, color: theme.textMuted, boxSizing: 'border-box' }}
                        />
                        {formData.lampiran && (
                          <div style={{ marginTop: '6px', fontSize: '0.72rem', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={13} /> Foto bukti siap dikirim ke cloud.
                          </div>
                        )}
                      </div>

                      <button 
                        type="submit" 
                        disabled={timeLeft.isPassed}
                        style={{ 
                          marginTop: '4px', 
                          background: timeLeft.isPassed ? '#64748b' : 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)', 
                          color: '#fff', 
                          border: 'none', 
                          padding: '13px', 
                          borderRadius: '12px', 
                          fontWeight: 700, 
                          fontSize: '0.88rem', 
                          cursor: timeLeft.isPassed ? 'not-allowed' : 'pointer' 
                        }}
                      >
                        {timeLeft.isPassed ? 'Izin Ditutup (Lewat Jam 20:00)' : 'Kirim Permohonan Izin'}
                      </button>
                    </div>
                  </form>

                  {/* RIWAYAT PENGGUNA */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '6px 4px 10px' }}>
                      <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: theme.textMain, margin: 0 }}>Riwayat Izin Anda (Cloud)</h3>
                      {submissions.filter(s => s.nim === currentUser.nim).length > 0 && (
                        <button 
                          onClick={handleClearStudentHistory}
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: '#ef4444', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer' }}
                        >
                          <Trash2 size={13} /> Bersihkan Riwayat
                        </button>
                      )}
                    </div>

                    {loadingData ? (
                      <p style={{ textAlign: 'center', fontSize: '0.8rem', color: theme.textMuted }}>Menyinkronkan dengan database...</p>
                    ) : submissions.filter(s => s.nim === currentUser.nim).length === 0 ? (
                      <div style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '16px', textAlign: 'center', color: theme.textMuted, fontSize: '0.82rem', border: `1px solid ${theme.cardBorder}` }}>
                        Belum ada pengajuan izin yang Anda buat.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {submissions.filter(s => s.nim === currentUser.nim).map((s) => (
                          <div key={s.id} className="animate-fade" style={{ backgroundColor: theme.cardBg, borderRadius: '14px', padding: '14px', border: `1px solid ${theme.cardBorder}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <strong style={{ fontSize: '0.88rem', color: theme.textMain }}>{s.matkul}</strong>
                              <span style={{ 
                                fontSize: '0.72rem', 
                                padding: '3px 8px', 
                                borderRadius: '999px', 
                                fontWeight: 700, 
                                backgroundColor: s.status === 'Disetujui' ? (isDarkMode ? '#064e3b' : '#dcfce7') : s.status === 'Ditolak' ? (isDarkMode ? '#7f1d1d' : '#fee2e2') : (isDarkMode ? '#78350f' : '#fef3c7'),
                                color: s.status === 'Disetujui' ? '#4ade80' : s.status === 'Ditolak' ? '#f87171' : '#facc15'
                              }}>
                                {s.status}
                              </span>
                            </div>
                            
                            <div style={{ fontSize: '0.78rem', color: theme.textMuted, margin: '4px 0 2px' }}>
                              Tujuan: <strong style={{ color: isDarkMode ? '#93c5fd' : '#2563eb' }}>Kelas {s.kelasTujuan}</strong> ({s.detailTujuan})
                            </div>
                            <div style={{ fontSize: '0.78rem', color: theme.textMuted }}>
                              PJMK: <strong>{s.pjmk}</strong> • Dosen: <em>{s.dosen}</em>
                            </div>
                            <div style={{ fontSize: '0.78rem', color: theme.textMain, marginTop: '2px' }}>
                              Alasan: <em>"{s.alasan}"</em>
                            </div>

                            {s.status === 'Ditolak' && s.catatanPenolakan && (
                              <div style={{ marginTop: '8px', padding: '8px 10px', backgroundColor: isDarkMode ? '#450a0a' : '#fef2f2', borderLeft: '3px solid #ef4444', borderRadius: '6px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                                <AlertCircle size={14} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                                <div style={{ fontSize: '0.74rem', color: isDarkMode ? '#fca5a5' : '#b91c1c' }}>
                                  <strong>Catatan PJMK:</strong> {s.catatanPenolakan}
                                </div>
                              </div>
                            )}

                            {/* STEPPER STATUS */}
                            <div style={{ margin: '12px 0 8px', padding: '10px', backgroundColor: theme.subCard, borderRadius: '10px', border: `1px solid ${theme.cardBorder}` }}>
                              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: theme.textMuted, marginBottom: '8px' }}>Pelacak Status:</div>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', zIndex: 1 }}>
                                  <span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#22c55e', color: '#fff', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>✓</span>
                                  <span style={{ fontSize: '0.65rem', color: theme.textMuted }}>Diajukan</span>
                                </div>
                                <div style={{ flex: 1, height: '2px', backgroundColor: s.status !== 'Menunggu' ? '#22c55e' : '#64748b', margin: '0 4px -12px' }}></div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', zIndex: 1 }}>
                                  <span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: s.status !== 'Menunggu' ? '#22c55e' : '#eab308', color: '#fff', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                    {s.status !== 'Menunggu' ? '✓' : '•'}
                                  </span>
                                  <span style={{ fontSize: '0.65rem', color: theme.textMuted }}>Verifikasi</span>
                                </div>
                                <div style={{ flex: 1, height: '2px', backgroundColor: s.status === 'Disetujui' ? '#22c55e' : s.status === 'Ditolak' ? '#ef4444' : '#64748b', margin: '0 4px -12px' }}></div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', zIndex: 1 }}>
                                  <span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: s.status === 'Disetujui' ? '#22c55e' : s.status === 'Ditolak' ? '#ef4444' : '#64748b', color: '#fff', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                    {s.status === 'Disetujui' ? '✓' : s.status === 'Ditolak' ? '✕' : '•'}
                                  </span>
                                  <span style={{ fontSize: '0.65rem', color: theme.textMuted }}>{s.status}</span>
                                </div>
                              </div>
                            </div>

                            {s.lampiran && (
                              <button 
                                type="button" 
                                onClick={() => setPreviewImageModal(s.lampiran)}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', border: 'none', background: isDarkMode ? '#1e293b' : '#eff6ff', color: '#38bdf8', padding: '4px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600, marginTop: '6px', cursor: 'pointer' }}
                              >
                                <ImageIcon size={12} /> Lihat Lampiran
                              </button>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '8px', borderTop: `1px dashed ${theme.cardBorder}` }}>
                              <span style={{ fontSize: '0.72rem', color: theme.textMuted }}>
                                {sub => sub.fullDateTime || sub.timestamp}
                              </span>
                              <button 
                                onClick={() => handleDeleteSubmission(s.id)} 
                                style={{ border: 'none', background: '#fee2e2', color: '#b91c1c', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600 }}
                              >
                                Batalkan
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 1: MODE PJMK */}
              {activeTab === 'home' && activeRole === 'pjmk' && (
                <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  
                  {/* PANEL PJMK */}
                  <div style={{ backgroundColor: theme.cardBg, borderRadius: '18px', padding: '16px', border: `1px solid ${theme.cardBorder}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ShieldCheck size={22} color="#4ade80" />
                        <div>
                          <h2 style={{ fontSize: '0.98rem', fontWeight: 800, margin: 0, color: theme.textMain }}>Portal Koordinator</h2>
                          <small style={{ color: theme.textMuted, fontSize: '0.75rem' }}>Mata Kuliah: {savedPjmkInfo?.matkul}</small>
                        </div>
                      </div>
                      <button 
                        onClick={handleClearPjmkHistory}
                        title="Reset Arsip"
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid #fee2e2', background: '#fef2f2', color: '#dc2626', padding: '5px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        <Trash2 size={12} /> Reset Arsip
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => {
                          const mySubmissions = submissions.filter(s => s.pjmk === savedPjmkInfo?.nama);
                          if (mySubmissions.length === 0) return alert("Tidak ada data.");
                          const headers = ["Nama,NIM,Mata Kuliah,Kelas Tujuan,Detail Jadwal,Alasan,Status,Waktu"];
                          const rows = mySubmissions.map(s => `"${s.nama}","'${s.nim}","${s.matkul}","${s.kelasTujuan}","${s.detailTujuan}","${s.alasan}","${s.status}","${s.fullDateTime || s.timestamp}"`);
                          const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
                          const link = document.createElement("a");
                          link.setAttribute("href", encodeURI(csvContent));
                          link.setAttribute("download", `Rekap_Lintas_${savedPjmkInfo?.matkul}_${Date.now()}.csv`);
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: isDarkMode ? '#1e293b' : '#eff6ff', color: '#38bdf8', border: `1px solid ${isDarkMode ? '#334155' : '#bfdbfe'}`, padding: '9px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        <Download size={14} /> Unduh CSV
                      </button>
                    </div>
                  </div>

                  {/* FILTER STATUS */}
                  <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
                    {['Semua', 'Menunggu', 'Disetujui', 'Ditolak'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        style={{ 
                          flex: 1, 
                          padding: '7px 10px', 
                          borderRadius: '999px', 
                          border: 'none', 
                          fontSize: '0.75rem', 
                          fontWeight: 700, 
                          cursor: 'pointer',
                          backgroundColor: statusFilter === status ? (isDarkMode ? '#38bdf8' : '#0f172a') : theme.cardBg,
                          color: statusFilter === status ? (isDarkMode ? '#0f172a' : '#fff') : theme.textMuted,
                          border: `1px solid ${theme.cardBorder}`
                        }}
                      >
                        {status}
                      </button>
                    ))}
                  </div>

                  {/* LIST PENGAJUAN */}
                  {loadingData ? (
                    <p style={{ textAlign: 'center', fontSize: '0.85rem', color: theme.textMuted }}>Memuat pengajuan mahasiswa...</p>
                  ) : filteredSubmissionsForPjmk.length === 0 ? (
                    <div style={{ backgroundColor: theme.cardBg, padding: '36px 20px', borderRadius: '18px', textAlign: 'center', color: theme.textMuted, fontSize: '0.85rem', border: `1px solid ${theme.cardBorder}` }}>
                      Tidak ada pengajuan dengan status "{statusFilter}".
                    </div>
                  ) : (
                    filteredSubmissionsForPjmk.map((s) => (
                      <div key={s.id} className="animate-fade" style={{ backgroundColor: theme.cardBg, borderRadius: '16px', padding: '16px', border: `1px solid ${theme.cardBorder}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div>
                            <div style={{ fontSize: '1rem', fontWeight: 700, color: theme.textMain }}>{s.nama}</div>
                            <div style={{ fontSize: '0.78rem', color: theme.textMuted }}>NIM: {s.nim}</div>
                          </div>
                          <span style={{ 
                            fontSize: '0.72rem', 
                            padding: '4px 10px', 
                            borderRadius: '999px', 
                            fontWeight: 700, 
                            backgroundColor: s.status === 'Disetujui' ? (isDarkMode ? '#064e3b' : '#dcfce7') : s.status === 'Ditolak' ? (isDarkMode ? '#7f1d1d' : '#fee2e2') : (isDarkMode ? '#78350f' : '#fef3c7'),
                            color: s.status === 'Disetujui' ? '#4ade80' : s.status === 'Ditolak' ? '#f87171' : '#facc15'
                          }}>
                            {s.status}
                          </span>
                        </div>

                        <div style={{ backgroundColor: theme.subCard, padding: '10px 12px', borderRadius: '10px', fontSize: '0.8rem', color: theme.textMain, lineHeight: 1.4, margin: '8px 0 10px' }}>
                          <div><strong>Pindah ke:</strong> Kelas {s.kelasTujuan}</div>
                          <div style={{ fontSize: '0.75rem', color: isDarkMode ? '#93c5fd' : '#2563eb' }}>
                            Jadwal: {s.detailTujuan}
                          </div>
                          <div style={{ marginTop: '3px' }}><strong>Alasan:</strong> "{s.alasan}"</div>
                          
                          {s.status === 'Ditolak' && s.catatanPenolakan && (
                            <div style={{ marginTop: '6px', color: '#f87171', fontSize: '0.74rem' }}>
                              <strong>Alasan Ditolak:</strong> {s.catatanPenolakan}
                            </div>
                          )}

                          {s.lampiran && (
                            <div style={{ marginTop: '8px' }}>
                              <button 
                                type="button" 
                                onClick={() => setPreviewImageModal(s.lampiran)}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', backgroundColor: isDarkMode ? '#1e293b' : '#e0e7ff', color: isDarkMode ? '#a5b4fc' : '#3730a3', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                              >
                                <ImageIcon size={13} /> Buka Foto Bukti Shift
                              </button>
                            </div>
                          )}

                          <div style={{ fontSize: '0.72rem', color: theme.textMuted, marginTop: '6px' }}>
                            Waktu: <strong>{s.fullDateTime || s.timestamp}</strong>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => handleApprove(s.id)}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)', color: '#fff', border: 'none', padding: '9px', borderRadius: '10px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                          >
                            <CheckCircle2 size={15} /> Setujui
                          </button>
                          <button 
                            onClick={() => handleOpenRejectModal(s)}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)', color: '#fff', border: 'none', padding: '9px', borderRadius: '10px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                          >
                            <XCircle size={15} /> Tolak & Catat
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 2: AKUN */}
              {activeTab === 'account' && (
                <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ backgroundColor: theme.cardBg, borderRadius: '18px', padding: '20px', border: `1px solid ${theme.cardBorder}` }}>
                    <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 14px 0' }}>Informasi Akun</h2>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: `1px solid ${theme.cardBorder}` }}>
                        <span style={{ color: theme.textMuted }}>Nama Mahasiswa</span>
                        <strong>{currentUser.name}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: `1px solid ${theme.cardBorder}` }}>
                        <span style={{ color: theme.textMuted }}>NIM</span>
                        <strong>{currentUser.nim}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: `1px solid ${theme.cardBorder}` }}>
                        <span style={{ color: theme.textMuted }}>Kelas Asal</span>
                        <strong>{currentUser.kelasAsal}</strong>
                      </div>
                    </div>

                    <button 
                      onClick={handleLogout}
                      style={{ marginTop: '16px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', backgroundColor: '#fee2e2', color: '#b91c1c', border: 'none', padding: '11px', borderRadius: '10px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
                    >
                      <LogOut size={15} /> Keluar Akun
                    </button>
                  </div>

                  {/* TOMBOL RAHASIA AKSES DEVELOPER / OWNER */}
                  <div style={{ backgroundColor: theme.cardBg, borderRadius: '18px', padding: '16px', border: `1px dashed #f59e0b` }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Sliders size={18} color="#f59e0b" />
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: theme.textMain }}>Panel Kontrol Pengembang</div>
                          <div style={{ fontSize: '0.7rem', color: theme.textMuted }}>Pantau user aktif & kontrol aplikasi</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          if (isAdminAuthenticated) {
                            setActiveTab('admin');
                          } else {
                            setShowAdminModal(true);
                          }
                        }}
                        style={{ backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Buka Hub
                      </button>
                    </div>
                  </div>

                  {/* HAK AKSES PJMK */}
                  {savedPjmkInfo ? (
                    <div style={{ backgroundColor: theme.cardBg, borderRadius: '18px', padding: '18px', border: `1.5px solid ${isDarkMode ? '#1e3a8a' : '#dbeafe'}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <ShieldCheck size={20} color="#38bdf8" />
                        <strong style={{ fontSize: '0.9rem', color: isDarkMode ? '#93c5fd' : '#1e3a8a' }}>Akses PJMK Terpasang</strong>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: theme.textMuted, margin: '0 0 12px 0' }}>
                        {savedPjmkInfo.roleName} ({savedPjmkInfo.nama})
                      </p>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => { setActiveRole(activeRole === 'pjmk' ? 'mahasiswa' : 'pjmk'); setActiveTab('home'); }}
                          style={{ flex: 1, backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '9px', borderRadius: '8px', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Beralih ke {activeRole === 'pjmk' ? 'Mahasiswa' : 'PJMK'}
                        </button>
                        <button 
                          onClick={() => { if (window.confirm('Lepas akses PJMK dari HP ini?')) { setSavedPjmkInfo(null); setActiveRole('mahasiswa'); } }}
                          style={{ border: `1px solid ${theme.inputBorder}`, background: 'transparent', color: theme.textMuted, padding: '9px 12px', borderRadius: '8px', fontSize: '0.76rem', cursor: 'pointer' }}
                        >
                          Lepas
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '0 4px' }}>
                      <button 
                        onClick={() => { setShowPjmkLoginModal(true); setPjmkPasswordError(''); setPjmkPasswordInput(''); }}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'transparent', border: `1px dashed ${theme.inputBorder}`, padding: '12px', borderRadius: '12px', cursor: 'pointer', fontSize: '0.78rem', color: theme.textMuted, fontWeight: 600 }}
                      >
                        <Lock size={14} /> Masuk Akses PJMK di HP Ini
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: BANTUAN */}
              {activeTab === 'help' && (
                <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ backgroundColor: theme.cardBg, borderRadius: '18px', padding: '20px', border: `1px solid ${theme.cardBorder}` }}>
                    <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 10px 0' }}>Aturan Lintas Kelas</h2>
                    <div style={{ backgroundColor: isDarkMode ? '#1e293b' : '#fefce8', borderLeft: '4px solid #eab308', padding: '10px 12px', borderRadius: '8px', fontSize: '0.8rem', color: isDarkMode ? '#fef08a' : '#854d0e', lineHeight: 1.4 }}>
                      Batas waktu submit izin harian maksimal pukul <strong>20:00 WIB</strong>. Lewat dari jam tersebut formulir otomatis terkunci.
                    </div>
                  </div>

                  {/* KARTU LAPOR KENDALA */}
                  <div style={{ backgroundColor: theme.cardBg, borderRadius: '18px', padding: '18px', border: '1.5px solid #fbcfe8' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 6px 0', color: '#be185d' }}>
                      🛠️ Lapor Kendala Web
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: theme.textMuted, margin: '0 0 12px 0', lineHeight: 1.4 }}>
                      Menemukan error atau kendala sistem? Hubungi langsung pengembang melalui Instagram:
                    </p>
                    <a 
                      href="https://www.instagram.com/az__znn?stkn=eHY3ejNseG1jbWth" 
                      target="_blank" 
                      rel="noreferrer" 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '8px', 
                        background: 'linear-gradient(135deg, #e1306c 0%, #fd1d1d 50%, #f56040 100%)', 
                        color: '#fff', 
                        textDecoration: 'none', 
                        padding: '11px 16px', 
                        borderRadius: '10px', 
                        fontSize: '0.82rem', 
                        fontWeight: 700, 
                        boxShadow: '0 4px 14px rgba(225,48,108,0.3)' 
                      }}
                    >
                      Kirim Laporan via Instagram (@az__znn)
                    </a>
                  </div>

                  {/* KONTAK PJMK */}
                  <div style={{ backgroundColor: theme.cardBg, borderRadius: '18px', padding: '18px', border: `1px solid ${theme.cardBorder}` }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 10px 0' }}>Kontak PJMK Mata Kuliah</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
                      {LIST_PJMK.map((p) => (
                        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 12px', borderRadius: '10px', backgroundColor: theme.subCard, border: `1px solid ${theme.cardBorder}` }}>
                          <div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{p.roleName}</div>
                            <div style={{ fontSize: '0.72rem', color: theme.textMuted }}>{p.nama}</div>
                          </div>
                          <a 
                            href={`https://wa.me/${p.noHp}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            style={{ color: '#16a34a', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 700, backgroundColor: isDarkMode ? '#064e3b' : '#dcfce7', padding: '5px 10px', borderRadius: '6px' }}
                          >
                            WhatsApp
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </main>
      )}

      {/* MODAL PENOLAKAN PJMK */}
      {rejectModalData && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 120 }}>
          <div className="animate-modal" style={{ backgroundColor: theme.cardBg, padding: '20px', borderRadius: '18px', maxWidth: '340px', width: '100%', border: `1px solid ${theme.cardBorder}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', marginBottom: '8px' }}>
              <XCircle size={20} />
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: theme.textMain }}>Alasan Penolakan Izin</h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: theme.textMuted, margin: '4px 0 12px' }}>
              Tulis catatan alasan untuk <strong>{rejectModalData.nama}</strong>:
            </p>

            <form onSubmit={handleConfirmReject}>
              <select 
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: `1px solid ${theme.inputBorder}`, backgroundColor: theme.inputBg, color: theme.textMain, fontSize: '0.8rem', marginBottom: '8px' }}
              >
                <option value="Kuota kelas tujuan sudah penuh">Kuota kelas tujuan sudah penuh</option>
                <option value="Lampiran bukti surat shift tidak valid/buram">Lampiran bukti surat shift tidak valid/buram</option>
                <option value="Jadwal mata kuliah bentrok">Jadwal mata kuliah bentrok</option>
                <option value="Lainnya">Lainnya (Ketik di bawah)</option>
              </select>

              <textarea 
                rows="2" 
                placeholder="Catatan penolakan..." 
                value={rejectionReasonInput} 
                onChange={(e) => setRejectionReasonInput(e.target.value)} 
                required 
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: `1px solid ${theme.inputBorder}`, backgroundColor: theme.inputBg, color: theme.textMain, fontSize: '0.8rem', resize: 'none', boxSizing: 'border-box' }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button 
                  type="button" 
                  onClick={() => setRejectModalData(null)} 
                  style={{ padding: '8px 12px', border: `1px solid ${theme.inputBorder}`, background: 'transparent', color: theme.textMuted, borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  style={{ padding: '8px 14px', border: 'none', background: '#dc2626', color: '#fff', borderRadius: '6px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}
                >
                  Tolak Pengajuan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PREVIEW FOTO */}
      {previewImageModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 110 }}>
          <div className="animate-modal" style={{ backgroundColor: theme.cardBg, borderRadius: '16px', overflow: 'hidden', maxWidth: '360px', width: '100%' }}>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.cardBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: theme.textMain }}>Foto Bukti Shift / Surat</span>
              <button onClick={() => setPreviewImageModal(null)} style={{ border: 'none', background: 'none', fontSize: '1rem', color: theme.textMain, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: '12px', textAlign: 'center', maxHeight: '420px', overflowY: 'auto' }}>
              <img src={previewImageModal} alt="Bukti Shift" style={{ maxWidth: '100%', borderRadius: '8px' }} />
            </div>
          </div>
        </div>
      )}

      {/* MODAL PIN PENGEMBANG / SUPER ADMIN */}
      {showAdminModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 110 }}>
          <div className="animate-modal" style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '20px', maxWidth: '320px', width: '100%', border: `1px solid ${theme.cardBorder}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
                <Sliders size={18} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: theme.textMain }}>Akses Pengembang</h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: theme.textMuted, margin: '4px 0 16px' }}>
              Masukkan PIN Pengembang untuk memantau data harian:
            </p>

            <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input 
                type="password" 
                placeholder="PIN Rahasia (default: 2609)" 
                value={adminPinInput} 
                onChange={(e) => setAdminPinInput(e.target.value)} 
                autoFocus 
                required 
                style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${theme.inputBorder}`, borderRadius: '10px', fontSize: '0.85rem', outline: 'none', backgroundColor: theme.inputBg, color: theme.textMain }}
              />

              {adminPinError && (
                <div style={{ color: '#dc2626', fontSize: '0.75rem', fontWeight: 600 }}>
                  {adminPinError}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowAdminModal(false)} 
                  style={{ padding: '9px 14px', border: `1px solid ${theme.inputBorder}`, background: 'transparent', color: theme.textMuted, borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  style={{ padding: '9px 16px', border: 'none', background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)', color: '#fff', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  Masuk Hub
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL LOGIN PJMK */}
      {showPjmkLoginModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 100 }}>
          <div className="animate-modal" style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '20px', maxWidth: '340px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)', border: `1px solid ${theme.cardBorder}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                <Lock size={18} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: theme.textMain }}>Verifikasi PJMK</h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: theme.textMuted, margin: '4px 0 16px' }}>
              Pilih nama Anda dan masukkan kata sandi pengurus:
            </p>

            <form onSubmit={handlePjmkLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <select 
                value={selectedPjmkId} 
                onChange={(e) => setSelectedPjmkId(e.target.value)} 
                style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${theme.inputBorder}`, borderRadius: '10px', fontSize: '0.85rem', backgroundColor: theme.inputBg, color: theme.textMain, outline: 'none' }}
              >
                {LIST_PJMK.map(p => (
                  <option key={p.id} value={p.id}>{p.roleName} - {p.nama}</option>
                ))}
              </select>

              <input 
                type="password" 
                placeholder="Kata sandi PJMK" 
                value={pjmkPasswordInput} 
                onChange={(e) => setPjmkPasswordInput(e.target.value)} 
                autoFocus 
                required 
                style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${theme.inputBorder}`, borderRadius: '10px', fontSize: '0.85rem', outline: 'none', backgroundColor: theme.inputBg, color: theme.textMain }}
              />

              {pjmkPasswordError && (
                <div style={{ color: '#dc2626', fontSize: '0.75rem', fontWeight: 600 }}>
                  {pjmkPasswordError}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowPjmkLoginModal(false)} 
                  style={{ padding: '9px 14px', border: `1px solid ${theme.inputBorder}`, background: 'transparent', color: theme.textMuted, borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  style={{ padding: '9px 16px', border: 'none', background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', color: '#fff', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  Buka Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP KONFIRMASI */}
      {showConfirmModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 100 }}>
          <div className="animate-modal" style={{ backgroundColor: theme.cardBg, padding: '22px', borderRadius: '20px', maxWidth: '330px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)', border: `1px solid ${theme.cardBorder}` }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', fontWeight: 700, color: theme.textMain }}>Konfirmasi Pengajuan</h3>
            <div style={{ fontSize: '0.82rem', color: theme.textMuted, lineHeight: 1.5, backgroundColor: theme.subCard, padding: '12px', borderRadius: '12px', border: `1px solid ${theme.cardBorder}` }}>
              <div><strong>Matkul:</strong> {formData.matkulFull}</div>
              <div><strong>Kelas Tujuan:</strong> Kelas {formData.kelasTujuan}</div>
              <div><strong>Jadwal Tujuan:</strong> {matchedTargetSchedule ? `${matchedTargetSchedule.hari}, ${matchedTargetSchedule.jam} (${matchedTargetSchedule.ruangan})` : '-'}</div>
              <div><strong>Dosen:</strong> {matchedTargetSchedule ? matchedTargetSchedule.dosen : formData.dosenAsal}</div>
              <div><strong>PJMK:</strong> {formData.pjmk}</div>
              <div><strong>Lampiran:</strong> {formData.lampiran ? 'Ada Bukti Foto' : 'Tidak Ada'}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              <button 
                onClick={() => setShowConfirmModal(false)} 
                disabled={isSubmitting} 
                style={{ padding: '8px 14px', border: `1px solid ${theme.inputBorder}`, background: 'transparent', color: theme.textMuted, borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
              >
                Cek Lagi
              </button>
              <button 
                onClick={handleConfirmSubmit} 
                disabled={isSubmitting} 
                style={{ padding: '8px 16px', border: 'none', background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)', color: '#fff', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION */}
      {currentUser && (
        <nav style={{ 
          position: 'fixed', 
          bottom: 0, 
          left: '50%', 
          transform: 'translateX(-50%)', 
          width: '100%', 
          maxWidth: '440px', 
          height: '64px',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          backgroundColor: theme.cardBg, 
          borderTop: `1px solid ${theme.cardBorder}`, 
          display: 'flex', 
          justifyContent: 'space-around', 
          alignItems: 'center', 
          boxShadow: '0 -4px 20px rgba(0,0,0,0.06)', 
          zIndex: 40, 
          transition: 'background-color 0.3s ease',
          boxSizing: 'border-box'
        }}>
          <button 
            onClick={() => setActiveTab('home')} 
            style={{ background: 'none', border: 'none', color: activeTab === 'home' ? '#38bdf8' : theme.textMuted, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', fontSize: '0.72rem', fontWeight: activeTab === 'home' ? 700 : 500 }}
          >
            <Calendar size={20} />
            {activeRole === 'pjmk' ? 'Dashboard' : 'Izin'}
          </button>
          <button 
            onClick={() => setActiveTab('account')} 
            style={{ background: 'none', border: 'none', color: activeTab === 'account' || activeTab === 'admin' ? '#38bdf8' : theme.textMuted, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', fontSize: '0.72rem', fontWeight: activeTab === 'account' ? 700 : 500 }}
          >
            <User size={20} />
            Akun
          </button>
          <button 
            onClick={() => setActiveTab('help')} 
            style={{ background: 'none', border: 'none', color: activeTab === 'help' ? '#38bdf8' : theme.textMuted, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', fontSize: '0.72rem', fontWeight: activeTab === 'help' ? 700 : 500 }}
          >
            <HelpCircle size={20} />
            Bantuan
          </button>
        </nav>
      )}

    </div>
  );
}