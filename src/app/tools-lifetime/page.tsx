'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { CheckCircle, X, Download, HardDrive, Clock, FileText } from 'lucide-react'

// Tambahin "KTP" (Interface) biar TypeScript nggak ngomel
interface OrderData {
  id: string;
  order_id: string;
  email: string | null;
  product_name: string;
  price: number;
  status: string;
  drive_link: string;
  created_at: string;
  customerName?: string;
  localDate?: string;
}

// Tambahin declare global buat akalin jsPDF
declare global {
  interface Window {
    jspdf: any;
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ToolsLifetime() {
  const router = useRouter()
  const [orders, setOrders] = useState<OrderData[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showReceipt, setShowReceipt] = useState<OrderData | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        let localHistory: any[] = []
        try {
          localHistory = JSON.parse(localStorage.getItem('vinzsky_history') || '[]')
        } catch(e) {}
        const orderIds = localHistory.map(h => h.id)

        const { data: { session } } = await supabase.auth.getSession()
        const userEmail = session?.user?.email

        let dbData: OrderData[] = []

        if (userEmail) {
          const { data } = await supabase.from('lifetime_orders').select('*').eq('email', userEmail)
          if (data) dbData = [...dbData, ...data]
        }
        
        if (orderIds.length > 0) {
          const { data } = await supabase.from('lifetime_orders').select('*').in('order_id', orderIds)
          if (data) {
            const existingIds = dbData.map(d => d.id)
            data.forEach((d: OrderData) => { if (!existingIds.includes(d.id)) dbData.push(d) })
          }
        }

        const finalOrders = dbData.map((dbO: OrderData) => {
          const localItem = localHistory.find((x: any) => x.id === dbO.order_id) || {}
          return {
            ...dbO,
            customerName: localItem.customerName || userEmail?.split('@')[0] || 'Member VinzSky',
            localDate: localItem.date || new Date(dbO.created_at).toLocaleString('id-ID')
          }
        }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

        setOrders(finalOrders)
      } catch (error) {
        console.error("Gagal narik data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const generatePDFDocument = (order: OrderData, jsPDF: any) => {
    const doc = new jsPDF()
    doc.setFontSize(22); doc.setTextColor(220, 38, 38); doc.text("VINZSKY-SHOPID", 20, 20)
    doc.setFontSize(12); doc.setTextColor(0, 0, 0)
    doc.text(`Order ID: ${order.order_id}`, 20, 35)
    doc.text(`Nama: ${order.customerName}`, 20, 45)
    doc.text(`Produk: ${order.product_name}`, 20, 55)
    doc.text(`Status: ${order.status}`, 20, 65)
    doc.setFontSize(16); doc.setTextColor(34, 197, 94)
    doc.text(`TOTAL: Rp ${Number(order.price).toLocaleString('id-ID')}`, 20, 85)
    doc.save(`Struk-${order.order_id}.pdf`)
  }

  const downloadPDF = (order: OrderData) => {
    try {
      if (typeof window !== 'undefined' && window.jspdf && window.jspdf.jsPDF) {
        generatePDFDocument(order, window.jspdf.jsPDF);
        return;
      }
      
      const script = document.createElement('script');
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      script.onload = () => {
        if (window.jspdf && window.jspdf.jsPDF) {
            generatePDFDocument(order, window.jspdf.jsPDF);
        }
      };
      document.body.appendChild(script);
    } catch (e) {
      alert("Gagal memuat sistem PDF");
    }
  }

  return (
    <div className="min-h-screen bg-[#020408] text-white p-6 md:p-12 font-sans overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(220,38,38,0.1) 0%, transparent 50%)' }} />

      <div className="max-w-4xl mx-auto relative z-10 pt-20">
        
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-red-500/20">
          <div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tighter flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-red-400">
              <HardDrive className="text-red-500" size={32} /> Tool-Lifetime
            </h1>
            <p className="text-xs md:text-sm text-gray-400 mt-1 font-bold">Akses link Google Drive & Struk Pembelian Anda</p>
          </div>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 text-xs font-bold bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg transition-all hover:scale-105 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
          >
            ← Kembali
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Clock className="animate-spin text-red-500 mb-4" size={40} />
            <p className="text-red-400 font-black animate-pulse tracking-widest">MENARIK DATA DARI BRANKAS...</p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div key={order.id} className="p-5 md:p-6 rounded-2xl bg-gradient-to-br from-[#0a0a12] to-[#050508] border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.05)] transition-transform hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] relative overflow-hidden">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest border rounded ${order.status === 'SUCCESS' || order.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.2)]'}`}>
                        {order.status}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">{order.localDate}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-white/90 drop-shadow-md">{order.product_name}</h3>
                    <p className="text-xs text-red-400/80 mt-1 font-mono">ID: {order.order_id}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-2 md:mt-0">
                    <button 
                      onClick={() => copyToClipboard(order.drive_link, order.id)}
                      className={`flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl border transition-all ${
                        copiedId === order.id 
                        ? 'bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
                        : 'bg-amber-500/10 border-amber-500/50 text-amber-500 hover:bg-amber-500/20 hover:scale-105 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      }`}
                    >
                      {copiedId === order.id ? (
                        <>Tersalin! <CheckCircle size={14} /></>
                      ) : (
                        <>
                          <HardDrive size={14} /> Salin Link G-Drive
                        </>
                      )}
                    </button>

                    <button 
                      onClick={() => setShowReceipt(order)}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl border border-white/10 transition-all hover:scale-105"
                    >
                      <FileText size={14} /> Lihat Struk
                    </button>

                  </div>
                </div>
              </div>
            ))}

            {orders.length === 0 && (
              <div className="text-center py-20 border border-dashed border-red-500/30 rounded-3xl bg-red-900/5">
                <HardDrive className="mx-auto text-red-500/50 mb-3" size={48} />
                <p className="text-gray-400 text-sm font-bold">Belum ada riwayat pembelian Tool-Lifetime untuk akun ini.</p>
              </div>
            )}
          </div>
        )}

      </div>

      {showReceipt && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowReceipt(null)}>
          <div className="bg-white text-black p-8 rounded-xl relative shadow-[0_0_40px_rgba(255,255,255,0.2)] w-full max-w-sm font-mono flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <div className="absolute -bottom-2 left-0 right-0 h-4 bg-repeat-x" style={{ backgroundImage: 'radial-gradient(circle, transparent 4px, white 4px)', backgroundSize: '16px 16px', backgroundPosition: '-8px 0' }}></div>
            
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 border-4 shadow-lg ${showReceipt.status === 'SUCCESS' || showReceipt.status === 'ACTIVE' ? 'bg-green-100 border-green-500 shadow-green-500/50 text-green-600' : 'bg-yellow-100 border-yellow-500 shadow-yellow-500/50 text-yellow-600'}`}>
              {showReceipt.status === 'SUCCESS' || showReceipt.status === 'ACTIVE' ? <CheckCircle size={32} /> : <Clock size={32} />}
            </div>
            
            <h2 className="text-2xl font-black mb-1 text-center text-gray-900">VINZSKY-SHOPID</h2>
            <p className="text-[10px] text-gray-500 text-center mb-4 border-b border-dashed border-gray-400 pb-4 w-full uppercase tracking-widest">
              Status: <span className={showReceipt.status === 'SUCCESS' || showReceipt.status === 'ACTIVE' ? 'text-green-600 font-bold' : 'text-yellow-600 font-bold'}>{showReceipt.status}</span>
            </p>
            
            <div className="w-full text-xs space-y-2 mb-4 border-b border-dashed border-gray-400 pb-4 text-gray-800">
              <div className="flex justify-between"><span className="font-bold">Order ID:</span><span>{showReceipt.order_id}</span></div>
              <div className="flex justify-between"><span className="font-bold">Tanggal:</span><span>{showReceipt.localDate}</span></div>
              <div className="flex justify-between"><span className="font-bold">Nama:</span><span>{showReceipt.customerName}</span></div>
              <div className="flex justify-between"><span className="font-bold">Produk:</span><span className="text-right max-w-[150px] truncate">{showReceipt.product_name}</span></div>
            </div>
            
            <div className="w-full flex justify-between items-center text-lg font-black mb-6">
              <span>TOTAL</span><span className="text-red-600">Rp {Number(showReceipt.price).toLocaleString('id-ID')}</span>
            </div>
            
            <div className="flex gap-3 w-full">
                <button onClick={() => downloadPDF(showReceipt)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-black py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"><Download size={14}/> PDF</button>
                <button onClick={() => setShowReceipt(null)} className="flex-[2] bg-red-600 hover:bg-red-700 text-white font-black py-3 rounded-lg text-sm transition-colors shadow-lg shadow-red-600/30">TUTUP STRUK</button>
            </div>
            
            <p className="text-[9px] text-gray-500 mt-4 text-center">Silakan salin link G-Drive di halaman sebelumnya.</p>
          </div>
        </div>
      )}

    </div>
  )
}