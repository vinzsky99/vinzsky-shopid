// @ts-nocheck
/* eslint-disable */
'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'; import 'swiper/css/effect-fade'
import { Star, Search, ShoppingCart, Bell, MoreVertical, History, Key, X, Plus, ShieldCheck, CreditCard, QrCode, Upload, Send, CheckCircle, Download, FileText, Clock, Printer, HardDrive, Trash2, Phone, UserCircle, MessageCircle, Quote, Flame, Users, Timer, Copy, Lock, Crown, PlayCircle, Percent, Droplets, Check } from 'lucide-react'

const DURATIONS = [
  { label: 'Trial 1 Jam', code: '1H', multiplier: 0, priceText: 'GRATIS' },
  { label: '7 Hari', code: '7D', multiplier: 0.3, priceText: '30% Harga' },
  { label: '14 Hari', code: '14D', multiplier: 0.6, priceText: '60% Harga' },
  { label: '30 Hari', code: '30D', multiplier: 1, priceText: 'Harga Normal' }
]

const playPop = () => { try { const ctx = new (window.AudioContext || window.webkitAudioContext)(); const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.connect(gain); gain.connect(ctx.destination); osc.type = 'sine'; osc.frequency.setValueAtTime(400, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1); gain.gain.setValueAtTime(1, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1); osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.1); } catch(e) {} }
const playKaChing = () => { try { const ctx = new (window.AudioContext || window.webkitAudioContext)(); const playBeep = (freq, time, dur) => { const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.connect(gain); gain.connect(ctx.destination); osc.type = 'square'; osc.frequency.setValueAtTime(freq, ctx.currentTime + time); gain.gain.setValueAtTime(0.3, ctx.currentTime + time); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + time + dur); osc.start(ctx.currentTime + time); osc.stop(ctx.currentTime + time + dur); }; playBeep(1200, 0, 0.1); playBeep(1600, 0.15, 0.3); } catch(e) {} }

export default function Home() {
  const [cart, setCart] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedDuration, setSelectedDuration] = useState(DURATIONS[3])
  const [showCheckout, setShowCheckout] = useState(false)
  const [payMethod, setPayMethod] = useState('qris')
  const [buktiBayar, setBuktiBayar] = useState(null)
  const [customerName, setCustomerName] = useState('')
  const [customerWA, setCustomerWA] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [showReceipt, setShowReceipt] = useState(null)
  const [activeMenu, setActiveMenu] = useState(null) 
  const [historyData, setHistoryData] = useState([])
  const [notifications, setNotifications] = useState([])
  const [showNotif, setShowNotif] = useState(false)
  const [searchQuery, setSearchQuery] = useState('') 
  const canvasRef = useRef(null)
  const receiptCanvasRef = useRef(null)

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState([{ sender: 'cs', text: 'Halo Bosku! Ada yang bisa CS VinzSky-shopID bantu hari ini?' }])
  const [lastUpdateId, setLastUpdateId] = useState(0) 
  const chatEndRef = useRef(null)

  const [reviewData, setReviewData] = useState(null) 
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [publicReviews, setPublicReviews] = useState([
    { name: "Andi Wijaya", product: "Upscale Video Best Quality 4K", rating: 5, text: "Gila render 4K nya cepet parah! Adminnya juga fast respon banget langsung kasih key di WA. Mantap VinzSky-shopID!" },
    { name: "Budi Santoso", product: "Tools Adobe Stock V6.2", rating: 5, text: "Fitur auto metadata & market research ngebantu banget jualan di Adobe Stock. Lifetime pula, the best lah!" }
  ])

  const [timeLeft, setTimeLeft] = useState(7200) 
  const [fomoNotif, setFomoNotif] = useState(null)
  const [realPurchases, setRealPurchases] = useState([])

  const [stocks, setStocks] = useState({ p1: 100, p2: 99, p3: 98 })
  const [isVipMember, setIsVipMember] = useState(false)
  const [showExitPopup, setShowExitPopup] = useState(false)
  const [hasShownExit, setHasShownExit] = useState(false)
  const [hasExitPromo, setHasExitPromo] = useState(false)
  const [demoVideo, setDemoVideo] = useState(null)
  
  // FIX OPACITY: Sekarang nilai ini benar-benar mengatur transparansi seluruh App Content
  const [appOpacity, setAppOpacity] = useState(100)

  // DETEKSI MODAL TERBUKA BIAR FAB CHAT NGUMPET
  const isAnyModalOpen = showCheckout || selectedProduct !== null || activeMenu !== null || showReceipt !== null || reviewData !== null || demoVideo !== null || showExitPopup;

  const firstNames = ["Budi", "Agus", "Siska", "Reza", "Dina", "Hendra", "Faisal", "Rina", "Tono", "Dewi", "Gilang", "Rafi", "Siti", "Ayu", "Putri", "Rizky", "Fajar"]
  const cities = ["Jakarta", "Surabaya", "Bandung", "Medan", "Bali", "Makassar", "Semarang", "Palembang", "Yogyakarta", "Malang", "Pekanbaru", "Batam"]
  const fakeProducts = ["Upscale Video 4K", "Upscale Photos High Quality", "Tools Adobe Stock V6.2", "Bundle VinzSky-shopID AI"]
  const fakeTimes = [ "2 menit yang lalu", "5 menit yang lalu", "14 menit yang lalu", "32 menit yang lalu", "1 jam yang lalu" ]

  useEffect(() => {
    const stockInterval = setInterval(() => {
      setStocks(prev => {
        const drop1 = Math.random() > 0.4 ? Math.floor(Math.random() * 2) + 1 : 0;
        const drop2 = Math.random() > 0.6 ? Math.floor(Math.random() * 2) + 1 : 0;
        const drop3 = Math.random() > 0.3 ? Math.floor(Math.random() * 2) + 1 : 0;
        return { p1: Math.max(75, prev.p1 - drop1), p2: Math.max(60, prev.p2 - drop2), p3: Math.max(50, prev.p3 - drop3) }
      });
    }, 12000); 
    return () => clearInterval(stockInterval);
  }, []);

  useEffect(() => {
    const handleMouseLeave = (e) => { if (e.clientY <= 0 && !hasShownExit && !isAnyModalOpen) { setShowExitPopup(true); setHasShownExit(true); } };
    document.addEventListener("mouseleave", handleMouseLeave); return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [hasShownExit, isAnyModalOpen]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('opacity-100', 'translate-y-0'); entry.target.classList.remove('opacity-0', 'translate-y-20'); } }); }, { threshold: 0.1 });
    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el)); return () => observer.disconnect();
  }, [searchQuery, publicReviews, stocks]); 

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedHistory = JSON.parse(localStorage.getItem('vinzsky_history')) || []
        setHistoryData(savedHistory); if (savedHistory.length > 0) setIsVipMember(true);
        const extractedReals = savedHistory.map(trx => ({ name: trx.customerName, product: trx.hwidItems[0]?.productName || "AI Tools", time: "Baru saja", isReal: true }));
        setRealPurchases(extractedReals);
        const savedReviews = JSON.parse(localStorage.getItem('vinzsky_reviews')) || []
        if(savedReviews.length > 0) setPublicReviews([...savedReviews, ...publicReviews])
      } catch (e) { setHistoryData([]) }
    }
  }, [])

  useEffect(() => { fetch(`/api/telegram?offset=-1`).then(res => res.json()).then(data => { if (data.ok && data.result.length > 0) setLastUpdateId(data.result[0].update_id + 1) }).catch(() => {}) }, [])

  useEffect(() => {
    let interval;
    if (isChatOpen && !isAnyModalOpen) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/telegram?offset=${lastUpdateId}`); const data = await res.json()
          if (data.ok && data.result.length > 0) {
            let latestId = lastUpdateId; const newMessages = [];
            data.result.forEach(update => { latestId = update.update_id + 1; if (update.message && update.message.text && !update.message.from.is_bot) newMessages.push({ sender: 'cs', text: update.message.text }); });
            if (newMessages.length > 0) setChatMessages(prev => [...prev, ...newMessages]); setLastUpdateId(latestId);
          }
        } catch (error) {}
      }, 3000); 
    } return () => clearInterval(interval);
  }, [isChatOpen, lastUpdateId, isAnyModalOpen]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }) }, [chatMessages, isChatOpen])
  useEffect(() => { if (notifications.length > 0) { const timer = setTimeout(() => { setShowNotif(false) }, 5000); return () => clearTimeout(timer) } }, [notifications])
  useEffect(() => { const timer = setInterval(() => { setTimeLeft(prev => (prev <= 0 ? 7200 : prev - 1)) }, 1000); return () => clearInterval(timer) }, [])

  const formatTime = (seconds) => { const h = Math.floor(seconds / 3600); const m = Math.floor((seconds % 3600) / 60); const s = seconds % 60; return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` }

  // 🔥 FOMO GENERATOR 🔥
  useEffect(() => {
    const fomoInterval = setInterval(() => {
      if (isAnyModalOpen) return; 
      const showReal = realPurchases.length > 0 && Math.random() > 0.7;
      if (showReal) {
         const randomReal = realPurchases[Math.floor(Math.random() * realPurchases.length)];
         setFomoNotif({ name: randomReal.name, product: randomReal.product, time: "Beberapa saat yang lalu", isReal: true });
      } else {
         const rName = firstNames[Math.floor(Math.random() * firstNames.length)]
         const rCity = cities[Math.floor(Math.random() * cities.length)]
         const rProduct = fakeProducts[Math.floor(Math.random() * fakeProducts.length)]
         const rTime = fakeTimes[Math.floor(Math.random() * fakeTimes.length)]
         setFomoNotif({ name: `${rName} - ${rCity}`, product: rProduct, time: rTime, isReal: false })
      }
      setTimeout(() => { setFomoNotif(null) }, 6000) 
    }, 12000)
    return () => clearInterval(fomoInterval)
  }, [isAnyModalOpen, realPurchases])

  // 🌌 ANIMASI GALAXY 🌌
  useEffect(() => {
    if (typeof window === 'undefined' || !canvasRef.current) return;
    const canvas = canvasRef.current; const ctx = canvas.getContext('2d')
    let w = canvas.width = window.innerWidth; let h = canvas.height = window.innerHeight
    let particles = []
    class StarParticle {
      constructor() { 
        this.x = Math.random() * w; this.y = Math.random() * h; 
        this.z = Math.random() * 2 + 0.5; 
        this.vx = ((Math.random() - 0.5) * 0.2) / this.z; 
        this.vy = -(Math.random() * 0.4) / this.z; 
        this.size = (Math.random() * 2) / this.z; 
        this.alpha = Math.random(); this.alphaChange = (Math.random() * 0.02) - 0.01;
      }
      update() {
        this.x += this.vx; this.y += this.vy; this.alpha += this.alphaChange;
        if(this.alpha <= 0.1 || this.alpha >= 0.8) this.alphaChange *= -1; 
        if (this.x > w || this.x < 0) this.x = Math.random() * w;
        if (this.y < 0) { this.y = h; this.x = Math.random() * w; }
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); 
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`; ctx.fill();
      }
    }
    for (let i = 0; i < 60; i++) particles.push(new StarParticle()) 
    const animate = () => { ctx.clearRect(0, 0, w, h); particles.forEach(p => p.update()); requestAnimationFrame(animate) }
    animate()
  }, [])

  useEffect(() => {
    if (showReceipt && receiptCanvasRef.current) {
      const canvas = receiptCanvasRef.current; const ctx = canvas.getContext('2d'); let w = canvas.width = window.innerWidth; let h = canvas.height = window.innerHeight; let confettis = []; const colors = ['#22c55e', '#3b82f6', '#eab308', '#ec4899', '#ffffff']; 
      for (let i = 0; i < 150; i++) { confettis.push({ x: Math.random() * w, y: Math.random() * h - h, r: Math.random() * 6 + 2, dx: Math.random() * 4 - 2, dy: Math.random() * 5 + 2, color: colors[Math.floor(Math.random() * colors.length)], tilt: Math.floor(Math.random() * 10) - 10, tiltAngleInc: (Math.random() * 0.07) + 0.05, tiltAngle: 0 }); }
      const animateConfetti = () => { ctx.clearRect(0, 0, w, h); confettis.forEach(c => { c.tiltAngle += c.tiltAngleInc; c.y += (Math.cos(c.tiltAngle) + 1 + c.r / 2) / 2; c.x += Math.sin(c.tiltAngle) * 2; ctx.beginPath(); ctx.lineWidth = c.r; ctx.strokeStyle = c.color; ctx.moveTo(c.x + c.tilt + c.r, c.y); ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r); ctx.stroke(); if (c.y > h) { c.y = -10; c.x = Math.random() * w; } }); requestAnimationFrame(animateConfetti); }
      animateConfetti();
    }
  }, [showReceipt])

  const handleCloseProductModal = () => { if (!hasExitPromo && !hasShownExit) { setShowExitPopup(true); setHasShownExit(true); } else { setSelectedProduct(null); } }
  const calculateFinalPrice = (basePrice) => { let final = basePrice; if (hasExitPromo) return final * 0.90; if (isVipMember) return final * 0.95; return final; }

  const executeAddToCart = (product, duration) => { playPop(); const finalPrice = calculateFinalPrice(product.price) * duration.multiplier; const cartItem = { ...product, finalPrice, durationLabel: duration.label, durationCode: duration.code, cartId: Date.now() }; setCart([...cart, cartItem]); setNotifications([{ time: new Date().toLocaleTimeString(), text: `${product.name} masuk keranjang!` }, ...notifications]); setShowNotif(true); setSelectedProduct(null) }
  const executeBeliSekarang = (product, duration) => { playPop(); const finalPrice = calculateFinalPrice(product.price) * duration.multiplier; const cartItem = { ...product, finalPrice, durationLabel: duration.label, durationCode: duration.code, cartId: Date.now() }; setCart([...cart, cartItem]); setSelectedProduct(null); setShowCheckout(true) }
  
  const removeFromCart = (index) => { const newCart = [...cart]; const removed = newCart.splice(index, 1)[0]; setCart(newCart); if(newCart.length === 0) setShowCheckout(false); setNotifications([{ time: new Date().toLocaleTimeString(), text: `Yahh, ${removed.name} dibatalin 🥺` }, ...notifications]); setShowNotif(true); }
  const kosongkanKeranjang = () => { setCart([]); setShowCheckout(false); setBuktiBayar(null); setNotifications([{ time: new Date().toLocaleTimeString(), text: "Keranjang dikosongkan." }, ...notifications]); setShowNotif(true) }

  const kirimKeTelegram = async () => {
    if (!customerName || !customerWA || !buktiBayar) return alert("Lengkapin data Nama, WA & Bukti Transfer Bosku!")
    setIsSending(true); const masterHwid = "744BC690E35B"; const total = cart.reduce((sum, item) => sum + item.finalPrice, 0)
    
    let statusPromo = "";
    if (hasExitPromo) statusPromo = "[PROMO EXIT 10%]"; else if (isVipMember) statusPromo = "[VIP MEMBER 5%]"; else statusPromo = "(Guest Mode)";

    const daftarItemText = cart.map(item => `- ${item.name} (${item.durationLabel})`).join('\n')
    const pesan = `💸 *ORDER BARU VINZSKY-SHOPID ${statusPromo}*\n\n👤 Nama: ${customerName}\n📱 WA: ${customerWA}\n💻 HWID: \`${masterHwid}\`\n💰 Total: Rp ${total.toLocaleString()}\n\n🛍️ Produk:\n${daftarItemText}`
    const formData = new FormData(); formData.append('caption', pesan); formData.append('photo', buktiBayar); formData.append('parse_mode', 'Markdown')

    try {
      const res = await fetch(`/api/telegram`, { method: 'POST', body: formData }); const data = await res.json()
      if (data.ok) {
        const hwidItems = cart.map(c => ({ productName: c.name, duration: c.durationLabel, keyStatus: c.isLifetime ? "LIFETIME (TANPA KEY)" : "Menunggu Key WA", isSuccess: c.isLifetime ? true : false, zipLink: c.zipLink, pdfLink: c.pdfLink, isLifetime: c.isLifetime }))
        const newTrx = { id: 'TRX-' + Date.now(), date: new Date().toLocaleString(), total, masterHwid, customerName, customerWA, hwidItems: hwidItems }
        const updated = [newTrx, ...historyData]; setHistoryData(updated); localStorage.setItem('vinzsky_history', JSON.stringify(updated))
        
        const newReal = { name: customerName, product: cart[0].name, time: "Baru saja", isReal: true };
        setRealPurchases([newReal, ...realPurchases]); setFomoNotif(newReal);

        setIsVipMember(true); setCart([]); setShowCheckout(false); setBuktiBayar(null); setCustomerName(''); setCustomerWA(''); setShowReceipt(newTrx); playKaChing(); 
      }
    } catch (e) { alert("Gagal kirim ke Telegram! Pastikan koneksi aman.") }
    setIsSending(false)
  }

  const handleSendChat = async (e) => { e.preventDefault(); if (!chatInput.trim()) return; const newMsg = { sender: 'user', text: chatInput }; setChatMessages(prev => [...prev, newMsg]); setChatInput(''); try { await fetch(`/api/telegram`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: `💬 *PESAN LIVE CHAT*\n\n*Pesan Guest:*\n"${newMsg.text}"`, parse_mode: 'Markdown' }) }) } catch (error) {} }

  const handleKlaimKey = (trxId, itemIndex) => {
    const inputKey = window.prompt("Masukkan License Key dari Admin:"); if (inputKey && inputKey.trim() !== '') {
      const newData = [...historyData]; const trxIndex = newData.findIndex(t => t.id === trxId)
      if (trxIndex !== -1) { newData[trxIndex].hwidItems[itemIndex].keyStatus = inputKey; newData[trxIndex].hwidItems[itemIndex].isSuccess = true; setHistoryData(newData); localStorage.setItem('vinzsky_history', JSON.stringify(newData)); alert("SISTEM AKTIF! License Key Berhasil Diterapkan."); setActiveMenu(null); setReviewData({ trxId: trxId, productName: newData[trxIndex].hwidItems[itemIndex].productName, customerName: newData[trxIndex].customerName }) }
    }
  }

  const submitReview = async () => {
    if (!reviewText.trim()) return alert("Tulis dulu ulasan lu Bosku!"); setIsSending(true)
    const newReview = { name: reviewData.customerName, product: reviewData.productName, rating: rating, text: reviewText }
    try {
      await fetch(`/api/telegram`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: `🌟 *REVIEW MASUK!*\n\n👤 ${newReview.name}\n🛍️ ${newReview.product}\n⭐ ${newReview.rating}/5\n💬 "${newReview.text}"`, parse_mode: 'Markdown' }) })
      const updatedReviews = [newReview, ...publicReviews]; setPublicReviews(updatedReviews); localStorage.setItem('vinzsky_reviews', JSON.stringify([newReview])) 
      setShowNotif(true); setReviewData(null); setReviewText(''); setRating(5)
    } catch (e) { alert("Gagal mengirim review.") }
    setIsSending(false)
  }

  const bersihkanRiwayat = () => { if(window.confirm("Yakin mau hapus semua riwayat?")) { setHistoryData([]); setIsVipMember(false); localStorage.removeItem('vinzsky_history'); alert("Riwayat berhasil dibersihkan!") } }
  const cetakStruk = () => { window.print() }

  const allProducts = [
    { id: 1, name: "Upscale Video Best Quality 4K", category: "AI Video", price: 350000, stock: stocks.p1, isFlashSale: true, image: "/produk1.jpg", desc: "Software Ultimate AI untuk upscaling video ke resolusi 4K tingkat studio.", zipLink: "https://drive.google.com/file/d/1CG0GVrcRvboTyCE6cav1aJJswK455nWg/view", pdfLink: "https://drive.google.com/drive/folders/1TrWpAgnO2PiUbqm32wB683n2r8FhmV_J", isLifetime: false, videoUrl: "/demo1.mp4" },
    { id: 2, name: "Upscale Photos High Quality", category: "AI Photo", price: 250000, stock: stocks.p2, isFlashSale: true, image: "/produk2.jpg", desc: "AI Photo enhancer ultra jernih khusus standar fotografer profesional.", zipLink: "https://drive.google.com/file/d/1aEmKx_aIBWG4aRL8qbSq5Lp2tMcK-co1/view", pdfLink: "https://drive.google.com/drive/folders/1RhOTGsfD-elLv01hcLIELXqqUUEdZrV4", isLifetime: false, videoUrl: "/demo2.mp4" },
    { id: 3, name: "Tools Adobe Stock V6.2", category: "AI Tools", price: 200000, originalPrice: 250000, stock: stocks.p3, isFlashSale: true, image: "/produk3.jpg", desc: "Tools bersifat Lifetime (Tanpa HWID). Fitur: Auto metadata, Market Research, Text to Image.", zipLink: "https://gemini.google.com/share/ad08a1ae2387", pdfLink: "#", isLifetime: true, videoUrl: "/demo3.mp4" }
  ]
  const filtered = allProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className={`relative min-h-screen overflow-x-hidden font-sans selection:bg-blue-600 transition-all duration-700 bg-[#050505] text-white`}
         style={{ opacity: appOpacity / 100 }}>
      
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-80" />

      {/* 🦇 EXIT-INTENT POPUP 🦇 */}
      {showExitPopup && (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in zoom-in duration-500">
          <div className="bg-gradient-to-br from-[#0a0f1a] to-[#1e1b4b] w-full max-w-lg rounded-[3rem] p-10 border border-purple-500/50 text-center relative overflow-hidden shadow-[0_0_100px_rgba(168,85,247,0.4)]">
            <button onClick={() => {setShowExitPopup(false); if(selectedProduct) setSelectedProduct(null);}} className="absolute top-6 right-6 text-gray-500 hover:text-white hover:bg-white/10 bg-white/5 rounded-full p-2 transition-all"><X size={18}/></button>
            <Percent size={64} className="mx-auto text-purple-500 mb-6 animate-bounce drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
            <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">TUNGGU BOSKU!</h2>
            <p className="text-sm text-gray-300 mb-8 font-bold">Ambil <span className="text-purple-400 font-black text-lg">EKSTRA DISKON 10%</span> khusus hari ini!</p>
            <button onClick={() => { setHasExitPromo(true); setShowExitPopup(false); playPop(); }} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 py-5 rounded-[1.5rem] font-black text-xl text-white shadow-[0_10px_30px_rgba(168,85,247,0.5)] transition-all hover:scale-105">KLAIM DISKON SEKARANG</button>
            <button onClick={() => {setShowExitPopup(false); if(selectedProduct) setSelectedProduct(null);}} className="mt-4 text-[10px] text-gray-500 font-bold uppercase hover:text-gray-300">Tidak, tutup saja</button>
          </div>
        </div>
      )}

      {/* 🎬 MODAL DEMO VIDEO FIX BUG KLIK KELUAR 🎬 */}
      {demoVideo && (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 animate-in fade-in duration-500" onClick={() => setDemoVideo(null)}>
          <button onClick={() => setDemoVideo(null)} className="absolute top-6 right-6 text-white bg-red-600 hover:bg-red-500 rounded-full p-3 z-50 transition-all shadow-[0_0_20px_rgba(220,38,38,0.8)] hover:scale-110"><X size={24}/></button>
          <div className="w-full max-w-5xl flex justify-center items-center rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.4)] animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <video src={demoVideo} controls autoPlay playsInline onError={(e) => alert("Video demo tidak ditemukan/gagal dimuat.")} className="max-h-[85vh] w-auto max-w-full rounded-3xl border border-blue-500/30 shadow-2xl bg-black"/>
          </div>
          <p className="text-white/50 mt-4 text-xs font-bold uppercase tracking-widest animate-pulse">Klik area luar untuk menutup</p>
        </div>
      )}

      {/* 🔥 FOMO NOTIF (KIRI ATAS, BAWAH NAVBAR) 🔥 */}
      {!isAnyModalOpen && fomoNotif && (
        <div className="fixed top-[88px] left-4 md:left-6 z-[90] bg-[#0a0f1a]/95 backdrop-blur-xl border border-blue-500/30 p-4 rounded-2xl shadow-[0_0_40px_rgba(37,99,235,0.4)] flex items-center gap-4 animate-in slide-in-from-left-10 fade-in duration-500 no-invert max-w-xs hover:border-blue-400 transition-all">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border shadow-inner ${fomoNotif.isReal ? 'bg-yellow-500/20 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'bg-green-500/20 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]'}`}>
            {fomoNotif.isReal ? <Crown size={18} className="text-yellow-500 animate-pulse"/> : <CheckCircle size={18} className="text-green-500 animate-pulse"/>}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white mb-0.5 truncate">{fomoNotif.name}</p>
            <p className={`text-[9px] font-black uppercase tracking-widest truncate ${fomoNotif.isReal ? 'text-yellow-400' : 'text-blue-400'}`}>{fomoNotif.product}</p>
            <div className="flex justify-between items-center mt-1">
              <span className="text-[8px] text-gray-500">{fomoNotif.time}</span>
              {fomoNotif.isReal && <span className="text-[8px] bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded font-bold border border-yellow-500/30">Verified Buyer</span>}
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-[80] bg-[#0a0f1a]/80 backdrop-blur-2xl border-b border-white/10 no-invert shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="bg-gradient-to-r from-red-600 via-orange-600 to-red-600 py-1.5 px-4 text-center border-b border-red-400/30 flex justify-center items-center gap-2">
          <Flame size={14} className="animate-bounce text-yellow-300" />
          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white shadow-md">FLASH SALE BERAKHIR DALAM:</span>
          <span className="bg-black/40 px-2 py-0.5 rounded text-[10px] md:text-xs font-mono font-black text-yellow-300 border border-white/20">{formatTime(timeLeft)}</span>
        </div>

        <div className="px-6 py-4 flex justify-between items-center text-white">
          <div className="text-2xl font-black cursor-pointer tracking-tighter hover:scale-105 transition-transform hover:drop-shadow-[0_0_15px_rgba(37,99,235,0.8)]" onClick={() => window.location.reload()}>
            VinzSky<span className="text-blue-500">-shopID</span>
          </div>
          
          <div className="hidden md:flex flex-1 max-w-md mx-8 bg-black/40 rounded-full px-4 py-2 border border-white/10 focus-within:border-blue-500 transition-all focus-within:shadow-[0_0_20px_rgba(37,99,235,0.3)]">
            <Search size={18} className="text-blue-500 mr-2" />
            <input type="text" placeholder="Cari software..." className="bg-transparent outline-none text-sm w-full text-white" onChange={e => setSearchQuery(e.target.value)} />
          </div>

          <div className="flex gap-4 md:gap-6 items-center group/nav">
              {isVipMember && (
                <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:scale-105 transition-transform">
                  <Crown size={16} className="text-yellow-500 animate-pulse"/><span className="text-[10px] font-black text-yellow-400 tracking-widest uppercase">VIP</span>
                </div>
              )}

              <div className="relative group/opacity py-2 cursor-pointer text-gray-300 hover:text-blue-400 transition-colors hover:drop-shadow-[0_0_10px_rgba(37,99,235,0.8)]">
                  <Droplets size={20} />
                  <div className="absolute right-0 top-full mt-2 w-40 bg-[#0a0f1a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-[500] opacity-0 invisible group-hover/opacity:opacity-100 group-hover/opacity:visible transition-all">
                     <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest text-center mb-3">Transparansi Web</p>
                     <input type="range" min="10" max="100" value={appOpacity} onChange={(e) => setAppOpacity(e.target.value)} className="w-full accent-blue-500" />
                     <p className="text-center text-xs font-black text-white mt-2">{appOpacity}%</p>
                  </div>
              </div>

              <div className="relative cursor-pointer transition-all hover:scale-110 hover:text-blue-400 hover:drop-shadow-[0_0_10px_rgba(37,99,235,0.8)] text-gray-300" onClick={() => setShowNotif(!showNotif)}>
                  <Bell size={22} className={`${notifications.length > 0 ? 'animate-bounce text-blue-400 drop-shadow-[0_0_10px_rgba(37,99,235,0.8)]' : ''}`} />
                  {notifications.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-[9px] font-bold text-white w-4 h-4 rounded-full flex items-center justify-center border border-[#0a0f1a] shadow-[0_0_10px_rgba(220,38,38,0.8)]">{notifications.length}</span>}
              </div>

              <div className="relative cursor-pointer transition-all hover:scale-110 hover:text-blue-400 hover:drop-shadow-[0_0_10px_rgba(37,99,235,0.8)] text-gray-300" onClick={() => cart.length > 0 ? setShowCheckout(true) : alert('Keranjang kosong! Pilih produk dulu Bosku.')}>
                <ShoppingCart size={22} className={cart.length > 0 ? "text-blue-400 drop-shadow-[0_0_10px_rgba(37,99,235,0.8)]" : ""} />
                <span className={`absolute -top-1.5 -right-1.5 text-[10px] font-bold text-white w-4 h-4 rounded-full flex items-center justify-center transition-all border border-[#0a0f1a] ${cart.length > 0 ? 'bg-blue-600 scale-110 shadow-[0_0_10px_rgba(37,99,235,0.8)]' : 'bg-gray-600'}`}>{cart.length}</span>
              </div>

              <div className="relative py-2">
                  <MoreVertical size={24} className={`cursor-pointer transition-colors hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] ${isMobileMenuOpen ? 'text-white' : 'text-gray-300 hover:text-white'}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
                  {isMobileMenuOpen && <div className="fixed inset-0 z-[400]" onClick={() => setIsMobileMenuOpen(false)}></div>}
                  <div className={`absolute right-0 top-full mt-2 w-56 bg-[#0a0f1a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 z-[500] transition-all shadow-[0_10px_50px_rgba(0,0,0,0.8)] ${isMobileMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                      <div className="px-3 py-3 border-b border-white/5 mb-1 bg-gradient-to-r from-blue-900/20 to-transparent rounded-t-xl">
                          <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest flex items-center gap-2"><UserCircle size={12}/> {isVipMember ? "Sultan Mode" : "Guest Mode"}</p>
                      </div>
                      <button onClick={() => {setActiveMenu('hwid'); setIsMobileMenuOpen(false)}} className="w-full text-left p-3 hover:bg-white/10 rounded-xl text-sm flex gap-3 font-bold text-gray-300 hover:text-white transition-all hover:shadow-inner"><Key size={16} className="text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]"/> Data Lisensi</button>
                      <button onClick={() => {setActiveMenu('history'); setIsMobileMenuOpen(false)}} className="w-full text-left p-3 hover:bg-white/10 rounded-xl text-sm flex gap-3 font-bold text-gray-300 hover:text-white transition-all hover:shadow-inner"><History size={16} className="text-emerald-500 drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]"/> G-Drive & Riwayat</button>
                  </div>
              </div>
          </div>
        </div>
      </nav>

      {/* NOTIF LOGS PULLDOWN */}
      {showNotif && (
          <div className="fixed top-32 right-6 z-[9999] w-80 bg-[#0f172a]/95 backdrop-blur-xl border border-blue-500/30 rounded-[2rem] shadow-[0_0_40px_rgba(37,99,235,0.3)] overflow-hidden animate-in slide-in-from-right-4 fade-in duration-300 no-invert text-white">
              <div className="p-4 border-b border-white/10 font-black text-[10px] uppercase flex justify-between items-center bg-blue-900/30">
                <span className="flex items-center gap-2 text-blue-400"><Bell size={12}/> System Logs</span>
                <X size={14} className="cursor-pointer text-gray-400 hover:text-white transition-colors" onClick={()=>setShowNotif(false)}/>
              </div>
              <div className="p-4 max-h-60 overflow-y-auto custom-scrollbar">
                  {notifications.length === 0 ? <p className="text-xs text-gray-600 text-center py-6 italic font-bold">No recent logs.</p> : 
                    notifications.map((n, i) => (
                        <div key={i} className="mb-3 bg-white/5 hover:bg-white/10 transition-colors p-3 rounded-xl border border-white/5">
                          <p className="text-[9px] text-blue-400 font-bold mb-1 flex items-center gap-1"><Clock size={10}/> {n.time}</p>
                          <p className="text-[11px] text-gray-200">{n.text}</p>
                        </div>
                    ))
                  }
              </div>
          </div>
      )}

      {/* 🔥 MAIN CONTENT 🔥 */}
      <main className="relative z-10 max-w-6xl mx-auto p-6 pt-36 min-h-screen">
        <div className="reveal-on-scroll opacity-0 translate-y-20 transition-all duration-1000 mb-12 rounded-[2.5rem] overflow-hidden h-64 border border-white/10 relative shadow-[0_0_40px_rgba(0,0,0,0.8)] group">
            <Swiper modules={[Autoplay, EffectFade]} effect="fade" autoplay={{ delay: 3500, disableOnInteraction: false }} speed={1000} className="h-full w-full">
                <SwiperSlide>
                    <div className="relative w-full h-full bg-[#0a0f1a]">
                      <img src="/slide1.jpg" onError={(e)=>{e.target.onerror = null; e.target.src="/slide1.png"}} className="w-full h-full object-cover opacity-50" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                      <div className="absolute bottom-10 left-10 z-20">
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full mb-3 inline-block shadow-[0_0_15px_rgba(37,99,235,0.8)]">UPDATE V2.0</span>
                        <h2 className="text-3xl md:text-4xl font-black italic text-white tracking-wide drop-shadow-lg">UPSCALE <span className="text-blue-500 drop-shadow-[0_0_15px_rgba(37,99,235,0.8)]">VIDEO 4K</span></h2>
                      </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="relative w-full h-full bg-[#0a0f1a]">
                      <img src="/slide2.jpg" onError={(e)=>{e.target.onerror = null; e.target.src="/slide2.png"}} className="w-full h-full object-cover opacity-50" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                      <div className="absolute bottom-10 left-10 z-20">
                        <span className="bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full mb-3 inline-block shadow-[0_0_15px_rgba(147,51,234,0.8)]">AI POWERED</span>
                        <h2 className="text-3xl md:text-4xl font-black italic text-white tracking-wide drop-shadow-lg">ULTRA HIGH <span className="text-purple-400 drop-shadow-[0_0_15px_rgba(192,132,252,0.8)]">PHOTO</span></h2>
                      </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>

        <h2 className="text-2xl font-black mb-8 flex items-center gap-3 italic"><Star className="text-blue-500 fill-blue-500 drop-shadow-[0_0_15px_rgba(37,99,235,0.8)]" /> Exclusive Tools</h2>
        
        {/* CARDS DENGAN GLOW HOVER KEMBALI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
          {filtered.map(p => {
             const finalPriceCard = calculateFinalPrice(p.price);
             return (
              <div key={p.id} className="reveal-on-scroll opacity-0 translate-y-20 transition-all duration-1000">
                <div onClick={() => { setSelectedProduct(p); if(p.isLifetime) setSelectedDuration({ label: 'LIFETIME ACCESS', code: 'LIFE', multiplier: 1 }); else setSelectedDuration(DURATIONS[3]); }} 
                     className="relative bg-gradient-to-br from-[#0a0a0a] to-[#111111] rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-blue-500/50 cursor-pointer shadow-xl transition-all duration-500 transform hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(37,99,235,0.3)] group/item flex flex-col h-full text-white">
                  
                  <div className="h-48 overflow-hidden relative bg-black group/vidbtn">
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10 opacity-80 transition-opacity"></div>
                    <img src={p.image} onError={(e)=>{e.target.onerror = null; e.target.src=p.image.replace('.jpg','.png')}} className="w-full h-full object-cover opacity-70 group-hover/item:scale-105 transition-transform duration-700" />
                    <span className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/10 uppercase tracking-widest shadow-lg">AI Power</span>
                    {p.isFlashSale && <span className="absolute top-4 left-4 z-20 bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase shadow-[0_0_15px_rgba(220,38,38,0.8)] animate-pulse">⚡ Flash Sale</span>}
                    
                    {/* TOMBOL PLAY GLOW MUNCUL PAS HOVER */}
                    <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                      <div className="bg-blue-600/80 backdrop-blur-sm p-3 rounded-full shadow-[0_0_30px_rgba(37,99,235,0.8)] border border-blue-400/50 hover:scale-110 transition-transform">
                         <PlayCircle size={32} className="text-white"/>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 relative z-20 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-black mb-2 text-white transition-colors group-hover/item:text-blue-400">{p.name}</h3>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-blue-400 font-black text-xl transition-transform drop-shadow-md">Rp {finalPriceCard.toLocaleString()}</p>
                        {(isVipMember || hasExitPromo || p.isFlashSale) && <p className="text-xs text-gray-500 line-through">Rp {(p.originalPrice || p.price).toLocaleString()}</p>}
                      </div>
                      <div className="flex gap-2 mb-3">
                        {isVipMember && !hasExitPromo && <span className="text-[8px] bg-yellow-600/20 text-yellow-500 px-2 py-0.5 rounded font-black border border-yellow-500/20 flex items-center gap-1 shadow-inner"><Crown size={8}/> VIP -5%</span>}
                        {hasExitPromo && <span className="text-[8px] bg-purple-600/20 text-purple-400 px-2 py-0.5 rounded font-black border border-purple-500/20 shadow-inner">PROMO -10%</span>}
                      </div>
                    </div>
                    
                    {/* PROGRESS BAR SISA STOK GLOW */}
                    <div className="mt-4">
                       <div className="flex justify-between text-[9px] text-red-400 font-bold mb-1.5 uppercase tracking-widest">
                         <span className="flex items-center gap-1"><Flame size={10} className="animate-pulse drop-shadow-[0_0_5px_rgba(248,113,113,0.8)]"/> Sangat Diminati</span>
                         <span>Sisa {p.stock} LISENSI</span>
                       </div>
                       <div className="w-full bg-gray-800 rounded-full h-1.5 shadow-inner overflow-hidden border border-white/5">
                         <div className="bg-gradient-to-r from-red-600 to-orange-500 h-full rounded-full animate-pulse relative shadow-[0_0_10px_rgba(248,113,113,0.5)]" style={{ width: p.stock + '%' }}>
                            <div className="absolute top-0 right-0 w-10 h-full bg-white/30 blur-[2px]"></div>
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
          )})}
        </div>

        {/* REVIEW TESTIMONIALS */}
        <div className="pt-10 border-t border-white/10">
          <h2 className="text-2xl font-black mb-8 flex items-center gap-3 italic text-center justify-center"><Quote className="text-yellow-500 fill-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]" /> VinzSky-shopID Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {publicReviews.map((rev, index) => (
              <div key={index} className="reveal-on-scroll opacity-0 translate-y-20 transition-all duration-1000 text-white">
                <div className="bg-[#0a0a0a] backdrop-blur-md p-6 rounded-[2rem] border border-white/5 shadow-lg hover:shadow-[0_0_30px_rgba(37,99,235,0.2)] hover:border-blue-500/30 transition-all h-full flex flex-col group">
                  <div className="flex items-center gap-2 mb-3">
                    {[...Array(5)].map((_, i) => (<Star key={i} size={16} className={i < rev.rating ? "text-yellow-500 fill-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]" : "text-gray-600"} />))}
                  </div>
                  <p className="text-sm text-gray-300 italic mb-4 leading-relaxed group-hover:text-white transition-colors">"{rev.text}"</p>
                  <div className="flex justify-between items-end mt-auto">
                    <div>
                      <p className="font-black text-sm text-white">{rev.name}</p>
                      <p className="text-[10px] text-blue-400 uppercase font-bold tracking-wider">{rev.product}</p>
                    </div>
                    <CheckCircle size={18} className="text-green-500 drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 bg-[#050505]/90 backdrop-blur-lg py-16 text-center mt-10">
          <p className="text-[11px] text-gray-500 tracking-[5px] uppercase font-black hover:text-blue-500 transition-colors cursor-default hover:drop-shadow-[0_0_10px_rgba(37,99,235,0.8)]">
            Tools By | VinzSky-shopID | software engineer | since 2026
          </p>
      </footer>

      {/* MODAL PAKSA REVIEW TESTIMONI */}
      {reviewData && (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in zoom-in duration-500 no-invert text-white">
          <div className="bg-[#050505] w-full max-w-lg rounded-[3rem] p-8 border border-yellow-500/50 shadow-[0_0_100px_rgba(234,179,8,0.3)] text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
            <Star size={48} className="mx-auto text-yellow-500 fill-yellow-500 mb-4 animate-pulse drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]" />
            <h2 className="text-2xl font-black text-white mb-2 uppercase">Beri Ulasan VinzSky-shopID!</h2>
            <p className="text-xs text-gray-400 mb-6 font-bold">Bagikan pengalaman Anda menggunakan <span className="text-blue-400">{reviewData.productName}</span></p>

            <div className="bg-black p-4 rounded-2xl border border-white/5 mb-6 text-left shadow-inner">
              <p className="text-[10px] text-gray-500 font-black uppercase mb-1 tracking-widest">Nama Pembeli:</p>
              <p className="text-sm font-bold text-white uppercase">{reviewData.customerName}</p>
            </div>

            <div className="mb-6">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-3">Rating Anda</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={32} onClick={() => setRating(star)} className={`cursor-pointer transition-all hover:scale-110 ${star <= rating ? 'text-yellow-500 fill-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]' : 'text-gray-600'}`} />
                ))}
              </div>
            </div>

            <textarea placeholder="Tulis ulasan jujur Anda di sini..." value={reviewText} onChange={(e) => setReviewText(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-yellow-500 focus:shadow-[0_0_15px_rgba(234,179,8,0.3)] text-white h-32 resize-none mb-6 transition-all"></textarea>

            <button onClick={submitReview} disabled={isSending} className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 py-4 rounded-[1.5rem] font-black text-lg text-white shadow-[0_10px_30px_rgba(234,179,8,0.4)] hover:scale-105 transition-all flex justify-center items-center gap-2">
              {isSending ? <Clock className="animate-spin" size={20}/> : <Send size={20}/>} {isSending ? "MENGIRIM..." : "KIRIM REVIEW"}
            </button>
          </div>
        </div>
      )}

      {/* 🔥 MODAL DETAIL PRODUK GLOW (Z-[9999]) 🔥 */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300 no-invert text-white">
          <div className="bg-[#050505] w-full max-w-4xl rounded-[3rem] overflow-hidden flex flex-col md:flex-row border border-blue-500/30 shadow-[0_0_100px_rgba(37,99,235,0.3)] relative">
            
            <div className="md:w-1/2 h-64 md:h-auto bg-black relative group/video">
              <img src={selectedProduct.image} onError={(e)=>{e.target.onerror = null; e.target.src=selectedProduct.image.replace('.jpg','.png')}} className="w-full h-full object-cover opacity-60 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black hidden md:block"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent md:hidden"></div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                 <button onClick={() => setDemoVideo(selectedProduct.videoUrl)} className="bg-black/50 hover:bg-blue-600/80 backdrop-blur-md border border-white/20 p-4 rounded-full text-white transition-all hover:scale-110 shadow-[0_0_30px_rgba(37,99,235,0.5)]">
                    <PlayCircle size={40} className="fill-white/80 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"/>
                 </button>
              </div>
              <p className="absolute bottom-4 left-0 w-full text-center text-[10px] font-bold uppercase tracking-widest text-white/70">Klik untuk tonton demo</p>
            </div>

            <div className="p-8 md:p-10 md:w-1/2 flex flex-col justify-center text-left relative">
              <button onClick={handleCloseProductModal} className="absolute top-6 right-6 text-gray-500 hover:text-white bg-white/5 hover:bg-red-500/50 rounded-full p-2 transition-colors z-50"><X size={18}/></button>

              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-600/20 text-blue-400 text-[10px] font-black px-3 py-1 rounded-full uppercase border border-blue-500/20 tracking-widest shadow-inner">AI Exclusive</span>
                <span className="flex items-center gap-1 text-[10px] text-red-400 font-bold animate-pulse"><Users size={12}/> {Math.floor(Math.random() * 15) + 12} Orang melihat ini</span>
              </div>
              
              <h2 className="text-3xl font-black mb-4 leading-tight text-white drop-shadow-md">{selectedProduct.name}</h2>
              
              {/* STOK BAR DI DALAM MODAL GLOW */}
              <div className="mb-6 bg-black p-4 rounded-2xl border border-white/5 shadow-inner">
                 <div className="flex justify-between text-xs text-red-400 font-bold mb-2 uppercase tracking-widest">
                   <span className="flex items-center gap-1"><Flame size={14} className="drop-shadow-[0_0_5px_rgba(248,113,113,0.8)]"/> Sangat Diminati</span>
                   <span>SISA {selectedProduct.stock} LISENSI</span>
                 </div>
                 <div className="w-full bg-gray-800 rounded-full h-2 shadow-inner overflow-hidden border border-white/5">
                   <div className="bg-gradient-to-r from-red-600 to-orange-500 h-full rounded-full animate-pulse relative shadow-[0_0_10px_rgba(248,113,113,0.8)]" style={{ width: selectedProduct.stock + '%' }}>
                      <div className="absolute top-0 right-0 w-10 h-full bg-white/30 blur-[2px]"></div>
                   </div>
                 </div>
              </div>

              <p className="text-sm text-gray-400 mb-8 leading-relaxed">{selectedProduct.desc}</p>
              
              {selectedProduct.isLifetime ? (
                <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-2xl text-center mb-8 shadow-inner hover:border-green-500/50 transition-colors">
                   <p className="text-green-400 font-black text-sm uppercase flex justify-center items-center gap-2 drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]"><CheckCircle size={16}/> LISENSI LIFETIME</p>
                   <p className="text-[10px] text-green-200 mt-2 opacity-80">Akses langsung ke G-Drive tanpa HWID Limit.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {DURATIONS.map(d => (
                    <button key={d.code} onClick={()=>setSelectedDuration(d)} className={`p-3 rounded-xl text-[10px] font-black border transition-all duration-300 ${selectedDuration.code === d.code ? 'border-blue-500 bg-blue-600/20 text-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-105' : 'border-white/5 text-gray-500 hover:bg-white/10 hover:text-white'}`}>{d.label}</button>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between items-center mb-8 border-t border-white/5 pt-6">
                  <span className="text-xs font-bold text-gray-500 italic">Harga Final:</span>
                  <div className="text-right">
                     {(isVipMember || hasExitPromo || selectedProduct.isFlashSale) && <p className="text-xs text-gray-500 line-through mb-1">Rp {(selectedProduct.originalPrice || selectedProduct.price).toLocaleString()}</p>}
                     <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 drop-shadow-[0_0_10px_rgba(37,99,235,0.5)]">Rp {(calculateFinalPrice(selectedProduct.price) * selectedDuration.multiplier).toLocaleString()}</span>
                  </div>
              </div>
              
              <div className="flex gap-3">
                <button onClick={() => executeAddToCart(selectedProduct, selectedDuration)} className="flex-1 bg-[#1e293b] hover:bg-blue-900/40 text-gray-300 hover:text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all border border-white/10 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]"><Plus size={18}/> Keranjang</button>
                <button onClick={() => executeBeliSekarang(selectedProduct, selectedDuration)} className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center transition-all shadow-[0_10px_30px_rgba(37,99,235,0.5)] hover:scale-105">Beli Sekarang</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 MODAL CHECKOUT GLOW (Z-[9999]) 🔥 */}
      {showCheckout && (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300 no-invert text-white">
          <div className="bg-[#050505] w-full max-w-md rounded-[2.5rem] p-6 md:p-8 border border-blue-500/30 shadow-[0_0_80px_rgba(37,99,235,0.3)] overflow-y-auto max-h-[90vh] custom-scrollbar relative">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-[#050505] py-2 z-20 border-b border-white/5">
              <h2 className="text-2xl font-black flex gap-3 items-center text-white drop-shadow-md"><ShieldCheck className="text-blue-500 drop-shadow-[0_0_10px_rgba(37,99,235,0.8)]"/> Checkout</h2>
              <button onClick={() => setShowCheckout(false)} className="text-gray-500 hover:text-white hover:bg-red-500/50 bg-white/5 rounded-full p-2 transition-colors"><X size={18}/></button>
            </div>

            <div className="bg-black p-4 rounded-2xl border border-white/5 mb-6 max-h-[20vh] overflow-y-auto custom-scrollbar shadow-inner">
              {cart.map((c, i) => (
                <div key={i} className="flex justify-between items-center mb-3 border-b border-white/5 pb-3 last:border-0 last:pb-0 hover:bg-white/5 p-2 rounded-lg transition-colors">
                  <div className="flex-1 pr-2">
                    <p className="text-xs text-white font-bold truncate">{c.name}</p>
                    <p className="text-[10px] text-blue-400 bg-blue-900/30 inline-block px-1.5 py-0.5 rounded mt-1 border border-blue-500/20">{c.durationLabel}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-black text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">Rp {c.finalPrice.toLocaleString()}</p>
                    <button onClick={() => removeFromCart(i)} className="text-red-500/50 hover:text-red-400 transition-colors" title="Batal Beli Produk Ini"><X size={16}/></button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-blue-900/30 to-transparent p-5 rounded-2xl border border-blue-500/20 shadow-lg">
                <span className="text-sm text-gray-300 font-bold uppercase tracking-widest">Total Tagihan</span>
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 drop-shadow-[0_0_10px_rgba(37,99,235,0.5)]">Rp {cart.reduce((total, item) => total + item.finalPrice, 0).toLocaleString('id-ID')}</span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="relative group">
                <UserCircle size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                <input placeholder="Nama Lengkap Anda" className="w-full bg-black border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-blue-500 focus:shadow-[0_0_15px_rgba(37,99,235,0.2)] font-bold text-sm text-white transition-all shadow-inner" onChange={e=>setCustomerName(e.target.value)} />
              </div>
              <div className="relative group">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                <input placeholder="WhatsApp Aktif" type="number" className="w-full bg-black border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-blue-500 focus:shadow-[0_0_15px_rgba(37,99,235,0.2)] font-bold text-sm text-white transition-all shadow-inner" onChange={e=>setCustomerWA(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <button onClick={() => setPayMethod('bank')} className={`font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 border ${payMethod === 'bank' ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.5)] scale-105' : 'bg-[#1e293b] text-gray-400 border-white/5 hover:bg-white/10 hover:text-white'}`}><CreditCard size={18}/> Transfer BCA</button>
                <button onClick={() => setPayMethod('qris')} className={`font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 border ${payMethod === 'qris' ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.5)] scale-105' : 'bg-[#1e293b] text-gray-400 border-white/5 hover:bg-white/10 hover:text-white'}`}><QrCode size={18}/> QRIS</button>
            </div>

            <div className="bg-black rounded-2xl p-6 mb-6 border border-white/5 text-center shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-[50px]"></div>
                {payMethod === 'bank' ? (
                  <div className="relative z-10 animate-in fade-in zoom-in duration-300">
                    <p className="text-xs text-gray-400 mb-2 font-bold uppercase tracking-widest">Transfer ke BCA</p>
                    <p className="text-3xl font-black text-white tracking-widest mb-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">865-073-8960</p>
                    <p className="text-sm text-blue-400 font-black uppercase bg-blue-900/30 py-1 px-3 rounded-full inline-block mt-2 border border-blue-500/20">A/N MOH BASHORY</p>
                  </div>
                ) : (
                  <div className="relative z-10 animate-in fade-in zoom-in duration-300">
                    <p className="text-[10px] text-gray-400 mb-4 font-black uppercase tracking-widest">Scan QRIS VinzSky-shopID</p>
                    <img src="/qris.png" className="w-40 h-40 object-contain mx-auto bg-white p-2 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform" alt="QRIS" />
                  </div>
                )}
            </div>

            <div className="mb-6 bg-black border border-white/5 p-4 rounded-2xl group hover:border-blue-500/50 transition-colors shadow-inner">
              <label className="flex items-center justify-center w-full cursor-pointer">
                  <div className="flex items-center gap-3 text-sm text-gray-400 group-hover:text-blue-400 transition-colors font-bold">
                    <Upload size={20} className="group-hover:-translate-y-1 transition-transform drop-shadow-[0_0_5px_rgba(37,99,235,0.5)]" />
                    {buktiBayar ? <span className="text-emerald-400 truncate max-w-[200px]">{buktiBayar.name}</span> : 'Upload Bukti Bayar'}
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={e=>setBuktiBayar(e.target.files[0])} />
              </label>
            </div>
            
            <button onClick={kirimKeTelegram} disabled={isSending || cart.length === 0} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-4 rounded-2xl font-black text-lg text-white shadow-[0_10px_30px_rgba(37,99,235,0.5)] hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2 relative z-10">
              {isSending ? <Clock className="animate-spin" size={20}/> : <Send size={20}/>} {isSending ? "Processing..." : "KONFIRMASI BAYAR"}
            </button>

            <button onClick={kosongkanKeranjang} className="w-full mt-6 bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
               <Trash2 size={16}/> Kosongkan Semua Keranjang
            </button>
          </div>
        </div>
      )}

      {/* 🔥 MODAL DATA LISENSI HWID GLOW (Z-[9999]) 🔥 */}
      {activeMenu === 'hwid' && (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300 no-invert text-white">
          <div className="bg-[#050505] w-full max-w-2xl rounded-[3rem] p-8 border border-white/10 shadow-[0_0_100px_rgba(234,179,8,0.2)] animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black flex gap-3 items-center text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]"><Key /> Data Lisensi HWID</h2>
              <X className="cursor-pointer text-gray-500 hover:text-white bg-white/5 hover:bg-red-500/50 p-2 rounded-full transition-colors" onClick={()=>setActiveMenu(null)} />
            </div>
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {historyData.length === 0 ? <div className="text-center py-20"><Key size={48} className="mx-auto text-gray-800 mb-4"/><p className="text-gray-600 font-black italic">BELUM ADA DATA LISENSI</p></div> : 
                historyData.map(trx => (
                  <div key={trx.id} className="bg-white/5 p-6 rounded-[2rem] border border-white/5 hover:border-yellow-500/50 transition-colors group shadow-lg">
                    <div className="bg-black p-5 rounded-2xl border border-yellow-500/20 mb-5 text-center shadow-inner">
                      <p className="text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-widest">Master HWID Device Anda:</p>
                      <code className="text-3xl font-black text-white drop-shadow-md tracking-wider">{trx.masterHwid}</code>
                    </div>
                    {trx.hwidItems.map((hw, idx) => (
                      <div key={idx} className={`flex justify-between items-center p-4 rounded-2xl bg-black border border-white/5 mb-2 hover:bg-black/60 transition-colors ${hw.isSuccess ? 'border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.2)]' : ''}`}>
                        <div className="flex flex-col"><span className="text-sm font-black text-gray-200">{hw.productName}</span><span className="text-[10px] text-gray-500 bg-white/5 w-fit px-2 py-0.5 rounded mt-1 border border-white/10">{hw.duration}</span></div>
                        {hw.isLifetime ? (
                           <div className="text-right"><p className="text-[8px] text-green-500 font-black uppercase mb-1 tracking-widest drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]">STATUS: AKTIF</p><code className="text-xs font-black text-green-400 bg-green-500/10 px-3 py-1 rounded-lg border border-green-500/50 shadow-inner">LIFETIME (TANPA KEY)</code></div>
                        ) : hw.isSuccess ? (
                           <div className="text-right"><p className="text-[8px] text-green-500 font-black uppercase mb-1 tracking-widest drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]">STATUS: AKTIF</p><code className="text-sm font-black text-green-400 bg-green-500/10 px-3 py-1 rounded-lg border border-green-500/50 shadow-inner">{hw.keyStatus}</code></div> 
                        ) : (
                           <button onClick={()=>handleKlaimKey(trx.id, idx)} className="text-[10px] bg-yellow-600 hover:bg-yellow-500 text-black px-4 py-2 rounded-xl font-black uppercase shadow-[0_5px_20px_rgba(202,138,4,0.5)] hover:scale-105 transition-all">Klaim Key</button>
                        )}
                      </div>
                    ))}
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )}

      {/* 🔥 MODAL G-DRIVE & HISTORY GLOW (Z-[9999]) 🔥 */}
      {activeMenu === 'history' && (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300 no-invert text-white">
            <div className="bg-[#050505] w-full max-w-2xl rounded-[3rem] p-8 border border-white/10 shadow-[0_0_100px_rgba(16,185,129,0.2)] animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black flex gap-3 text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]"><History /> G-Drive & Riwayat</h2>
                    <X className="cursor-pointer text-gray-500 hover:text-white bg-white/5 hover:bg-red-500/50 p-2 rounded-full transition-colors" onClick={()=>setActiveMenu(null)} />
                </div>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {historyData.length === 0 ? <div className="text-center py-20"><Download size={48} className="mx-auto text-gray-800 mb-4"/><p className="text-gray-600 font-black italic">BELUM ADA RIWAYAT TRANSAKSI</p></div> : 
                      historyData.map(trx => (
                        <div key={trx.id} className="bg-white/5 p-6 rounded-[2rem] border border-white/5 hover:border-emerald-500/50 transition-colors shadow-lg">
                            <div className="flex justify-between text-[10px] text-gray-500 mb-4 font-bold uppercase tracking-widest bg-black p-2 rounded-lg border border-white/5"><span>ID: {trx.id}</span><span>{trx.date}</span></div>
                            {trx.hwidItems.map((h, i) => (
                                <div key={i} className="mb-4 last:mb-0 border-t border-white/5 pt-4">
                                  <p className="font-black text-sm mb-3 text-gray-200">{h.productName}</p>
                                  <div className="flex flex-col gap-2 mb-3">
                                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Link Akses G-Drive:</label>
                                      <div className="flex gap-2">
                                        <input type="text" readOnly value={h.zipLink} className="flex-1 bg-black border border-white/10 rounded-xl p-3 text-xs text-blue-400 outline-none font-mono text-white shadow-inner focus:border-blue-500 focus:shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all" />
                                        <button onClick={() => { if(typeof window !== 'undefined'){navigator.clipboard.writeText(h.zipLink); alert('Link G-Drive Berhasil Disalin!')} }} className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-xl text-[10px] font-black transition-all flex items-center gap-1 shadow-[0_0_15px_rgba(37,99,235,0.5)] hover:scale-105"><Copy size={12}/> COPY</button>
                                      </div>
                                  </div>
                                  <div className="flex gap-3">
                                    <a href={h.zipLink} target="_blank" className="flex-1 bg-blue-600/10 text-blue-400 p-3 rounded-xl text-center text-[10px] font-black border border-blue-500/50 uppercase hover:bg-blue-600 hover:text-white hover:scale-105 transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)] flex items-center justify-center gap-2"><HardDrive size={14}/> BUKA LINK G-DRIVE</a>
                                    <a href={h.pdfLink} target="_blank" className="flex-1 bg-purple-600/10 text-purple-400 p-3 rounded-xl text-center text-[10px] font-black border border-purple-500/50 uppercase hover:bg-purple-600 hover:text-white hover:scale-105 transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)] flex items-center justify-center gap-2"><FileText size={14}/> Panduan PDF</a>
                                  </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                {historyData.length > 0 && <button onClick={bersihkanRiwayat} className="w-full mt-8 text-gray-600 bg-white/5 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 p-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-transparent"><Trash2 size={12}/> Bersihkan Data Perangkat</button>}
            </div>
        </div>
      )}

      {/* SPLIT BILL / RECEIPT GLOW (Z-[9999]) */}
      {showReceipt && (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300 no-invert">
            <canvas ref={receiptCanvasRef} className="absolute inset-0 z-0 pointer-events-none" />
            <div className="bg-white text-black w-full max-w-sm rounded-[2rem] p-8 font-mono shadow-[0_0_100px_rgba(255,255,255,0.3)] relative z-10 animate-in zoom-in-95 duration-500">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-green-500 text-white p-3 rounded-full border-4 border-[#0a0f1a] shadow-[0_0_20px_rgba(34,197,94,0.6)]">
                  <Check size={32} strokeWidth={3} />
                </div>
                <div className="text-center mb-6 border-b-2 border-dashed border-gray-300 pb-6 pt-6">
                    <h3 className="text-2xl font-black uppercase tracking-tighter text-black">VINZSKY-SHOPID</h3>
                    <p className="text-[10px] text-gray-500 mt-1">{showReceipt.date}</p>
                    <p className="text-[10px] text-gray-400 mt-1 font-bold bg-gray-100 inline-block px-2 py-0.5 rounded">ID: {showReceipt.id}</p>
                </div>
                <div className="space-y-3 mb-6 text-xs font-bold border-b border-gray-200 pb-6">
                    {showReceipt.hwidItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-end bg-gray-50 p-2 rounded-lg">
                        <div className="flex flex-col"><span className="truncate max-w-[150px] text-black">{item.productName}</span><span className="text-[9px] text-gray-500">{item.duration}</span></div>
                      </div>
                    ))}
                    <div className="pt-4 flex justify-between items-center font-black text-sm mt-2 text-blue-600 bg-blue-50 p-3 rounded-xl border border-blue-100">
                      <span>TOTAL BAYAR</span><span>Rp {showReceipt.total.toLocaleString()}</span>
                    </div>
                </div>
                <div className="bg-gray-900 p-5 rounded-2xl text-center shadow-inner mb-6 relative overflow-hidden">
                    <p className="text-[9px] font-black text-gray-400 mb-2 uppercase tracking-widest">Master HWID PC Anda:</p>
                    <code className="text-lg font-black text-white uppercase tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{showReceipt.masterHwid}</code>
                </div>
                <div className="flex gap-2">
                  <button onClick={cetakStruk} className="flex-1 bg-black hover:bg-gray-800 text-white py-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-colors shadow-lg"><Printer size={14}/> PDF</button>
                  <button onClick={() => setShowReceipt(null)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-black py-4 rounded-xl font-black text-xs transition-colors shadow-inner">SELESAI</button>
                </div>
            </div>
        </div>
      )}

      {/* 🔥 FAB CHAT (HILANG OTOMATIS SAAT ADA MODAL APAPUN YANG TERBUKA BIAR GAK NGALANGIN) 🔥 */}
      {!isAnyModalOpen && (
        <div className="fixed bottom-6 right-6 z-[500] flex flex-col items-end no-invert">
          {isChatOpen && (
            <div className="mb-4 w-80 sm:w-96 bg-[#0a0f1a] border border-blue-500/50 rounded-2xl shadow-[0_0_50px_rgba(37,99,235,0.4)] flex flex-col overflow-hidden text-white animate-in slide-in-from-bottom-10 fade-in duration-300">
              <div className="bg-gradient-to-r from-blue-900 to-[#0a0f1a] p-4 flex justify-between items-center border-b border-white/10 shadow-lg">
                <div className="flex items-center gap-3"><h3 className="font-black text-sm text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">CS VinzSky-shopID</h3></div>
                <button onClick={() => setIsChatOpen(false)} className="text-white/50 bg-white/10 p-1.5 rounded-full hover:bg-red-500/50 hover:text-white transition-colors"><X size={18}/></button>
              </div>
              <div className="h-72 p-4 overflow-y-auto flex flex-col gap-3 bg-black/80 custom-scrollbar">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-md ${msg.sender === 'user' ? 'bg-blue-600 text-white self-end rounded-br-sm' : 'bg-[#1e293b] text-gray-200 self-start rounded-bl-sm border border-white/5'}`}>{msg.text}</div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={handleSendChat} className="p-3 bg-[#0a0f1a] flex gap-2 border-t border-white/10 shadow-inner">
                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ketik pesan Bosku..." className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:shadow-[0_0_15px_rgba(37,99,235,0.3)] text-sm text-white transition-all shadow-inner" />
                <button type="submit" disabled={!chatInput.trim()} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.5)] hover:scale-105"><Send size={18}/></button>
              </form>
            </div>
          )}
          <button onClick={() => setIsChatOpen(!isChatOpen)} className={`w-16 h-16 bg-gradient-to-tr from-green-500 to-emerald-400 rounded-full flex items-center justify-center text-white shadow-[0_0_40px_rgba(34,197,94,0.6)] hover:scale-110 transition-all z-50 ${!isChatOpen ? 'animate-bounce' : ''}`}>
            {isChatOpen ? <X size={28} /> : 
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="animate-pulse">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            }
          </button>
        </div>
      )}

    </div>
  )
}