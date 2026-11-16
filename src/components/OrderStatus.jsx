'use client'
import React, { useState, useEffect, useRef } from 'react'
import { X, Clock, Package, Search, Download, Star, Image as ImageIcon, CheckCircle, Key, Copy } from 'lucide-react'

const fmtRp = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`
const fmtDate = (d) => new Date(d).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

const TIERS = {
  '1H':  { name:'Bronze', color:'#cd7f32', glow:'rgba(205,127,50,.7)',  bg:'rgba(205,127,50,.12)',  border:'rgba(205,127,50,.4)' },
  '7D':  { name:'Silver', color:'#60a5fa', glow:'rgba(96,165,250,.7)',  bg:'rgba(96,165,250,.12)',  border:'rgba(96,165,250,.4)' },
  '14D': { name:'Gold',   color:'#fbbf24', glow:'rgba(251,191,36,.7)',  bg:'rgba(251,191,36,.12)',  border:'rgba(251,191,36,.4)' },
  '30D': { name:'Ruby',   color:'#f472b6', glow:'rgba(244,114,182,.7)', bg:'rgba(244,114,182,.12)', border:'rgba(244,114,182,.4)' },
  'LIFETIME': { name:'Lifetime', color:'#a855f7', glow:'rgba(168,85,247,.7)', bg:'rgba(168,85,247,.12)', border:'rgba(168,85,247,.4)' }
}

const DiamondIcon = ({ color = '#60a5fa', glow = 'rgba(96,165,250,.7)', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ filter: `drop-shadow(0 0 4px ${glow})` }}>
    <polygon points="12,2 20,8 20,10 12,22 4,10 4,8" fill={color} opacity="0.9" />
    <polygon points="12,2 20,8 12,10 4,8" fill="white" opacity="0.35" />
    <polygon points="12,10 20,10 12,22" fill={color} opacity="0.6" />
    <polygon points="4,10 12,10 12,22" fill={color} opacity="0.8" />
  </svg>
)

const getTier = (label) => {
    if(!label) return TIERS['7D']
    if(label.toUpperCase().includes('1 JAM')) return TIERS['1H']
    if(label.toUpperCase().includes('14 HARI')) return TIERS['14D']
    if(label.toUpperCase().includes('30 HARI')) return TIERS['30D']
    if(label.toUpperCase().includes('LIFETIME')) return TIERS['LIFETIME']
    return TIERS['7D']
}

export default function OrderStatus({ isOpen, onClose, userEmail, supabase }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('SEMUA')
  const [userProfile, setUserProfile] = useState(null)
  const [userReviews, setUserReviews] = useState([])

  const [reviewOrder, setReviewOrder] = useState(null)
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [reviewFile, setReviewFile] = useState(null)
  const [previewImg, setPreviewImg] = useState(null)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const fileInputRef = useRef(null)

  const fetchOrders = async () => {
    if (!isOpen) return
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if(user) setUserProfile(user)

      const localHist = JSON.parse(localStorage.getItem('vinzsky_history') || '[]')
      const localOrderIds = localHist.map(h => h.id).filter(Boolean);
      
      let dbLicenses = []; let revData = []
      
      if (supabase) {
        const nameToSearch = user?.user_metadata?.full_name || userEmail?.split('@')[0] || '';
        if (nameToSearch) {
            const rRes = await supabase.from('reviews').select('*').eq('name', nameToSearch);
            revData = rRes.data || [];
        }

        if (userEmail) {
            const res1 = await supabase.from('user_licenses').select('*').eq('user_email', userEmail);
            dbLicenses = [...(res1.data || [])];
        }
        if (localOrderIds.length > 0) {
            const res2 = await supabase.from('user_licenses').select('*').in('order_id', localOrderIds);
            const newItems = (res2.data || []).filter(d => !dbLicenses.some(existing => existing.id === d.id));
            dbLicenses = [...dbLicenses, ...newItems];
        }
        setUserReviews(revData)
      }

      let combined = dbLicenses.map(lic => {
          const localMatch = localHist.find(h => h.id === lic.order_id);
          const price = localMatch ? localMatch.total : 0;
          return {
              id: lic.order_id || `LIC-${lic.id.substring(0,8)}`,
              type: lic.order_id?.includes('MANUAL') ? 'MANUAL' : 'AUTO',
              displayStatus: lic.order_status,
              created_at: lic.created_at,
              total_price: price,
              items: [{
                  name: lic.package_name,
                  durationLabel: lic.tier_code === '3D' ? '3 Hari' :
                                 lic.tier_code === '7D' ? '7 Hari' :
                                 lic.tier_code === '14D' ? '14 Hari' :
                                 lic.tier_code === '30D' ? '30 Hari' :
                                 lic.tier_code === 'LIFETIME' ? 'Lifetime' : `${lic.duration_days || 0} Hari`,
                  tierCode: lic.tier_code, 
                  finalPrice: price,
                  keyStatus: lic.license_key,
                  isSuccess: lic.license_status === 'ACTIVE'
              }]
          };
      });
      
      combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      setOrders(combined)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [isOpen, userEmail, supabase])

  const handleDownloadPDF = async (order) => {
    try {
      if (typeof window !== "undefined") {
          const { jsPDF } = await import("jspdf");
          const doc = new jsPDF();
          doc.setFontSize(22); doc.setTextColor(220, 38, 38); doc.text("VINZSKY-SHOPID", 20, 20);
          doc.setFontSize(12); doc.setTextColor(0, 0, 0); doc.text(`INVOICE ID: ${order.id || 'TRX-UNKNOWN'}`, 20, 35);
          doc.text(`Tanggal: ${fmtDate(order.created_at)}`, 20, 45);
          doc.text(`Status: ${order.displayStatus === 'SUCCESS' ? 'LUNAS' : 'PENDING'}`, 20, 55);
          doc.text(`Tipe Order: ${order.type}`, 20, 65);
          doc.line(20, 75, 190, 75);
          doc.text("Daftar Produk:", 20, 85);
          let y = 95;
          order.items?.forEach((item, index) => {
            doc.text(`${index + 1}. ${item.name} (${item.durationLabel})`, 20, y);
            doc.text(fmtRp(item.finalPrice), 150, y);
            y += 10;
          });
          doc.line(20, y+5, 190, y+5);
          doc.setFontSize(16); doc.text(`TOTAL BAYAR:`, 20, y + 20);
          doc.setTextColor(34, 197, 94); doc.text(fmtRp(order.total_price), 140, y + 20);
          doc.save(`Invoice_VinzSky_${order.id || Date.now()}.pdf`);
      }
    } catch (e) { alert("Gagal membuat PDF. Pastikan jspdf sudah terinstall."); }
  }

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if(file) {
      if(file.size > 2 * 1024 * 1024) return alert("Maksimal ukuran foto 2MB bosku!");
      setReviewFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImg(e.target.result);
      reader.readAsDataURL(file);
    }
  }

  const submitReview = async () => {
    if (!reviewText.trim()) return alert('Tulis ulasannya dulu bosku!');
    setIsSubmittingReview(true);
    let imageUrl = null;
    try {
      if (reviewFile) {
        const fileExt = reviewFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('review-images').upload(fileName, reviewFile, { cacheControl: '3600', upsert: false });
        if (uploadError) { alert('Gagal upload foto ke server. Pastikan policy bucket "review-images" sudah public.'); setIsSubmittingReview(false); return; }
        const { data: publicUrlData } = supabase.storage.from('review-images').getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
      }

      const reviewData = {
        name: userProfile?.user_metadata?.full_name || userEmail?.split('@')[0] || 'Member VinzSky',
        buyer_avatar: userProfile?.user_metadata?.avatar_url || null,
        product: reviewOrder.items?.[0]?.name || 'VIP Tools VinzSky',
        rating: rating,
        review_text: reviewText,
        review_image_url: imageUrl, 
        tier_code: reviewOrder.items?.[0]?.tierCode || '7D'
      };

      await supabase.from('reviews').insert([reviewData]);
      
      if(typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('new_review_fomo', { detail: { name: reviewData.name, product: reviewData.product, rating: reviewData.rating, avatar: reviewData.buyer_avatar } }));
      }

      alert('🎉 Ulasan mantap lu berhasil dikirim! Makasih banyak bosku!');
      setReviewOrder(null); setReviewText(''); setReviewFile(null); setPreviewImg(null); setRating(5);
      fetchOrders(); 
    } catch (e) { alert('Waduh, gagal ngirim ulasan. Coba lagi nanti ya.'); } 
    finally { setIsSubmittingReview(false); }
  }

  if (!isOpen) return null

  const filteredOrders = orders.filter(o => {
    if (activeTab === 'SEMUA') return true
    if (activeTab === 'PROSES') return o.displayStatus === 'PROSES' || o.displayStatus === 'PENDING'
    return o.displayStatus === activeTab
  })

  const getProductReview = (productName) => {
      return userReviews.find(r => r.product === productName)
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      
      <div className={`bg-[#0a0a0a] w-full max-w-2xl rounded-3xl border border-red-500/30 shadow-[0_0_50px_rgba(220,38,38,0.3)] flex flex-col max-h-[90vh] overflow-hidden ${reviewOrder ? 'hidden' : 'block'}`}>
        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-black text-white flex items-center gap-2"><Package className="text-red-500"/> Status Pesanan</h2>
          <button onClick={onClose} className="p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500/40 transition-colors"><X size={18}/></button>
        </div>
        <div className="flex border-b border-white/10 overflow-x-auto hide-scrollbar">
          {['SEMUA', 'PENDING', 'PROSES', 'SUCCESS', 'REJECTED'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 px-4 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border-b-2 ${activeTab === tab ? 'text-red-500 border-red-500 bg-red-500/10' : 'text-gray-400 border-transparent hover:text-white'}`}>{tab === 'SUCCESS' ? 'Selesai' : tab === 'REJECTED' ? 'Dibatalkan' : tab}</button>
          ))}
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="text-center py-20"><Clock className="mx-auto animate-spin text-red-500 mb-3" size={40}/><p className="text-red-400 font-black animate-pulse">Memuat Pesanan...</p></div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-20 text-gray-500 font-bold italic"><Search className="mx-auto mb-3 opacity-50" size={48}/>Belum ada pesanan di kategori ini.</div>
          ) : (
            filteredOrders.map((o, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-red-500/50 transition-colors shadow-lg relative">
                
                {o.displayStatus === 'SUCCESS' && (
                   <button onClick={() => handleDownloadPDF(o)} className="absolute top-4 right-4 bg-red-600/20 text-red-400 border border-red-500/50 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-all">
                     <Download size={12}/> Struk PDF
                   </button>
                )}

                <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10 pr-24">
                  <div className="flex items-center gap-2"><span className="px-2 py-1 rounded bg-black border border-white/20 text-[9px] font-black text-gray-300 uppercase tracking-widest">{o.type === 'AUTO' ? 'Otomatis' : 'Manual Transfer'}</span><span className="text-[10px] text-gray-500 font-bold">{fmtDate(o.created_at)}</span></div>
                </div>

                {o.items?.map((item, idx) => {
                    const t = getTier(item.durationLabel);
                    
                    return (
                  <div key={idx} className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center border" style={{ background: t.bg, borderColor: t.border }}>
                            <DiamondIcon color={t.color} glow={t.glow} size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-black text-white">{item.name}</p>
                            <p className="text-[10px] font-bold uppercase" style={{ color: t.color }}>{item.durationLabel}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-black text-gray-300 mb-1">{fmtRp(item.finalPrice)}</p>
                        {o.displayStatus === 'SUCCESS' ? (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-500/10 border border-green-500/40 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                                <Key size={12} className="text-green-400"/>
                                <code className="text-xs font-black text-green-400">{item.keyStatus || 'LIFETIME-ACCESS'}</code>
                                <button onClick={() => {navigator.clipboard.writeText(item.keyStatus || 'LIFETIME-ACCESS'); alert('Disalin!')}} className="ml-1 text-gray-400 hover:text-white"><Copy size={12}/></button>
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/40">
                                <Clock size={12} className="text-yellow-400"/>
                                <span className="text-[10px] font-black text-yellow-400 uppercase">Menunggu Verifikasi</span>
                            </div>
                        )}
                    </div>
                  </div>
                )})}
                
                <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/5">
                    <p className="text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest">Tracking Pesanan</p>
                    <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
                            <div className="w-0.5 h-8 bg-green-500/30 my-1"></div>
                            <div className={`w-3 h-3 rounded-full ${o.displayStatus === 'SUCCESS' || o.displayStatus === 'PROSES' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : o.displayStatus === 'REJECTED' || o.displayStatus === 'CANCELLED' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-yellow-500 shadow-[0_0_8px_#eab308]'}`}></div>
                        </div>
                        <div className="flex flex-col flex-1 pb-1">
                            <div className="mb-4">
                                <p className="text-xs font-bold text-gray-200 leading-none">Pesanan Dibuat</p>
                                <p className="text-[9px] text-gray-500 mt-1">{fmtDate(o.created_at)}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-200 leading-none">
                                    {o.displayStatus === 'SUCCESS' ? 'Pembayaran Diterima / Lisensi Aktif' : o.displayStatus === 'PENDING' ? 'Menunggu Pembayaran / Verifikasi Admin' : o.displayStatus === 'REJECTED' || o.displayStatus === 'CANCELLED' ? 'Pesanan Dibatalkan' : 'Pesanan Diproses'}
                                </p>
                                {o.displayStatus === 'SUCCESS' && <p className="text-[9px] text-gray-500 mt-1">Selesai</p>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-400">Total Pesanan:</p>
                    <p className="text-lg font-black text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">{fmtRp(o.total_price)}</p>
                  </div>
                  
                  {o.displayStatus === 'SUCCESS' && (
                      (() => {
                          const existingReview = getProductReview(o.items?.[0]?.name);
                          const isClaimed = true; 
                          
                          if(existingReview) {
                              return (
                                  <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-1 mb-1">
                                        {[...Array(5)].map((_, j) => <Star key={j} size={10} className={j < existingReview.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'} />)}
                                    </div>
                                    <p className="text-[9px] text-green-400 font-bold flex items-center gap-1"><CheckCircle size={10}/> Ulasan Terkirim</p>
                                    {existingReview.review_image_url && (
                                        <div className="mt-2 w-16 h-12 rounded overflow-hidden border border-white/20 flex items-center justify-center bg-black/40">
                                            <img src={existingReview.review_image_url} alt="Review" className="max-w-full max-h-full object-contain"/>
                                        </div>
                                    )}
                                  </div>
                              )
                          } else if (isClaimed) {
                              return (
                                <button onClick={() => setReviewOrder(o)} className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest border border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)] hover:scale-105 transition-transform flex items-center gap-2">
                                    <Star size={14} className="fill-yellow-400 text-yellow-400"/> Beri Ulasan
                                </button>
                              )
                          }
                      })()
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {reviewOrder && (
        <div className="bg-[#0a0a0a] w-full max-w-md rounded-[2.5rem] border border-red-500/50 shadow-[0_0_80px_rgba(220,38,38,0.4)] flex flex-col p-6 relative">
          <button onClick={() => { setReviewOrder(null); setPreviewImg(null); setReviewFile(null) }} className="absolute top-4 right-4 text-gray-500 hover:text-white bg-white/5 p-2 rounded-full"><X size={18}/></button>
          
          <div className="text-center mb-6">
             <Star className="mx-auto text-yellow-400 fill-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)] mb-2" size={40} />
             <h2 className="text-2xl font-black text-white">Kasih Bukti Hasilnya!</h2>
             <p className="text-xs text-gray-400 mt-1">Biar yang lain tau gacornya <b>{reviewOrder.items?.[0]?.name}</b></p>
          </div>

          <div className="flex justify-center gap-2 mb-6">
            {[1,2,3,4,5].map(star => (
              <button key={star} onClick={() => setRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                <Star size={36} className={star <= rating ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]' : 'text-gray-600'} />
              </button>
            ))}
          </div>

          <textarea 
            value={reviewText} 
            onChange={e=>setReviewText(e.target.value)} 
            placeholder="Review jujur lu di sini... (contoh: Gambar jadi tajem parah bos!)" 
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white mb-4 outline-none focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.3)] h-28 resize-none" 
          />

          <div className="mb-6">
            <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2">Upload Foto Hasil Editan (Opsional)</p>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoSelect} className="hidden" />
            
            {previewImg ? (
              <div className="relative rounded-xl overflow-hidden border-2 border-red-500/50 group h-32 w-full flex items-center justify-center bg-black/40">
                 <img src={previewImg} alt="Preview" className="max-w-full max-h-full object-contain" />
                 <button onClick={() => { setPreviewImg(null); setReviewFile(null); }} className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full shadow-lg hover:bg-red-700"><X size={14}/></button>
              </div>
            ) : (
              <div onClick={() => fileInputRef.current?.click()} className="w-full h-20 rounded-xl border-2 border-dashed border-gray-600 hover:border-red-500 bg-white/5 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                 <ImageIcon size={24} className="text-gray-400 group-hover:text-red-400 mb-1" />
                 <span className="text-[10px] font-bold text-gray-500 group-hover:text-red-300">Klik untuk upload foto JPG/PNG</span>
              </div>
            )}
          </div>

          <button onClick={submitReview} disabled={isSubmittingReview} className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white font-black py-4 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:scale-[1.02] transition-all flex justify-center items-center gap-2">
            {isSubmittingReview ? <Clock className="animate-spin" size={20}/> : <CheckCircle size={20}/>}
            {isSubmittingReview ? 'MENGIRIM ULASAN...' : 'KIRIM ULASAN SEKARANG'}
          </button>
        </div>
      )}

    </div>
  )
}