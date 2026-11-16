'use client'
import React, { useState, useRef } from 'react'

const fmtRp = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`
const nowWIB = () => new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })
const generateOrderId = () => 'MANUAL-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase()

const PAYMENT_METHODS = [
  { id: 'transfer', label: 'Transfer Bank BCA', icon: '🏦', desc: 'BCA Khusus' },
  { id: 'qris',     label: 'QRIS',              icon: '📱', desc: 'Scan dari semua e-wallet' },
  { id: 'dana',     label: 'DANA',              icon: '💙', desc: 'Transfer via DANA' },
  { id: 'gopay',    label: 'GoPay',             icon: '💚', desc: 'Transfer via GoPay' },
  { id: 'ovo',      label: 'OVO',               icon: '💜', desc: 'Transfer via OVO' },
]

const STEPS = ['Metode Bayar', 'Data Diri', 'Konfirmasi & Bukti']

export default function CheckoutManual({ isOpen = false, onClose, cartItems = [], totalAmount = 0, onSuccess, supabase }) {
  const [step, setStep] = useState(0)
  const [payMethod, setPayMethod] = useState(PAYMENT_METHODS[0])
  const [name, setName] = useState('')
  const [wa, setWa] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [proofFile, setProofFile] = useState(null)
  const [proofBase64, setProofBase64] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [orderId, setOrderId] = useState(null)
  const [orderTime, setOrderTime] = useState(null)
  const fileRef = useRef(null)

  const handleFileChange = (e) => {
    const f = e.target.files?.[0]; if (!f) return
    if (f.size > 5 * 1024 * 1024) { setError('Ukuran file max 5 MB'); return }
    setProofFile(f); const reader = new FileReader(); reader.onload = (ev) => setProofBase64(ev.target.result); reader.readAsDataURL(f); setError('')
  }

  const canNext = () => {
    if (step === 0) return !!payMethod
    if (step === 1) return name.trim() && wa.trim() && (totalAmount === 0 || email.trim())
    return true
  }

  const submitOrder = async () => {
    setSubmitting(true); setError('')
    const oid = generateOrderId(); const ts = nowWIB(); setOrderId(oid); setOrderTime(ts)
    
    try {
      const itemsList = cartItems.map(i => `${i.name} (${i.durationLabel})`).join(', ')
      const key = 'MANUAL-' + Math.random().toString(36).substring(2, 10).toUpperCase()
      
      const isLifetimeOrder = cartItems.some(c => c.isLifetime || c.durationCode === 'LIFETIME');

      let durationDays = 30;
      if (cartItems[0]?.durationCode === '1H') durationDays = 1;
      else if (cartItems[0]?.durationCode === '7D') durationDays = 7;
      else if (cartItems[0]?.durationCode === '14D') durationDays = 14;
      else if (cartItems[0]?.durationCode === '30D') durationDays = 30;
      else if (cartItems[0]?.durationCode === 'LIFETIME') durationDays = 36500;
      else durationDays = 36500;

      // === LOGIKA PEMISAHAN DATABASE ===
      let dbErr = null;

      if (isLifetimeOrder) {
        // Masuk ke tabel Lifetime (G-Drive)
        const { error } = await supabase.from('lifetime_orders').insert([{
          order_id: oid,
          email: email.trim() || null,
          product_name: cartItems[0]?.name || 'Produk Lifetime',
          price: totalAmount,
          status: 'PENDING',
          drive_link: cartItems[0]?.zipLink || cartItems[0]?.pdfLink || 'Link Google Drive Belum Tersedia'
        }])
        dbErr = error;
      } else {
        // Masuk ke tabel Lisensi Lama (Video Upscale)
        const { error } = await supabase.from('user_licenses').insert([{
          user_name: name.trim(), user_email: email.trim() || null, is_guest: true, user_wa: wa.trim(),
          license_key: key, hwid: 'MENUNGGU-HWID', package_name: cartItems[0]?.name || 'Produk',
          tier_code: cartItems[0]?.durationCode || 'MIX', duration_days: durationDays,
          order_status: 'PENDING', license_status: 'INACTIVE', order_id: oid
        }])
        dbErr = error;
      }
      
      if (dbErr) throw new Error("Gagal nyimpen ke database: " + dbErr.message);

      // KABARIN ADMIN LEWAT TELEGRAM
      const msgText = `🛒 *ORDER MANUAL BARU*\n📋 ID: \`${oid}\`\n⏰ Waktu: ${ts}\n──────────────────\n👤 Nama: ${name.trim()}\n📱 WA: ${wa.trim()}\n📧 Email: ${email.trim() || '-'}\n──────────────────\n📦 Produk: ${itemsList}\n💳 Bayar: ${payMethod.label}\n💰 Total: ${fmtRp(totalAmount)}\n${notes ? `📝 Catatan: ${notes}\n` : ''}──────────────────\n➡️ Status: *MENUNGGU VERIFIKASI ADMIN*`
      await fetch('/api/telegram', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: msgText, parse_mode: 'Markdown' }) }).catch(() => {})
      
      if (proofFile) {
        const fd = new FormData(); fd.append('photo', proofFile); fd.append('caption', `📸 Bukti Bayar — ${name.trim()} — ${oid}`)
        await fetch('/api/telegram', { method: 'POST', body: fd }).catch(() => {})
      }

      if(typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('new_purchase_fomo', { detail: { name: name.trim(), product: cartItems[0]?.name || 'Produk VIP' } }));
      }

      // LEMPAR KE STRUK (Sesuaikan tampilan status kunci untuk riwayat)
      if(onSuccess) onSuccess({ 
        id: oid, 
        date: ts, 
        total: totalAmount, 
        masterHwid: isLifetimeOrder ? 'TANPA-HWID' : 'MENUNGGU-HWID',
        hwidItems: cartItems.map(c => ({ 
            productName: c.name, 
            duration: c.durationLabel, 
            keyStatus: isLifetimeOrder ? 'Menunggu Verifikasi Admin (LIFETIME)' : 'Menunggu Verifikasi Admin', 
            isSuccess: false,
            isLifetime: c.isLifetime || c.durationCode === 'LIFETIME'
        })), 
        customerName: name, 
        paymentMethod: payMethod.label 
      });

    } catch (e) { setError('Gagal kirim order: ' + (e.message || 'coba lagi')) }
    finally { setSubmitting(false) }
  }

  const reset = () => { setStep(0); setPayMethod(PAYMENT_METHODS[0]); setName(''); setWa(''); setEmail(''); setNotes(''); setProofFile(null); setProofBase64(null); setError('') }
  const handleClose = () => { reset(); onClose?.() }

  if (!isOpen) return null

  return (
    <div style={css.overlay} onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div style={css.modal}>
        <div style={css.header}><div><p style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#fff' }}>🛒 Checkout Manual</p><p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>VinzSky-shopID • 0% Fee</p></div><button onClick={handleClose} style={css.closeBtn}>✕</button></div>
        <div style={css.stepWrap}>{STEPS.map((s, i) => (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ ...css.stepDot, background: i <= step ? '#4ade80' : 'rgba(255,255,255,.12)', color: i <= step ? '#fff' : 'rgba(255,255,255,.3)', boxShadow: i === step ? '0 0 12px rgba(74,222,128,.6)' : 'none' }}>{i < step ? '✓' : i + 1}</div>{i < STEPS.length - 1 && <div style={{ width: 20, height: 1, background: i < step ? '#4ade80' : 'rgba(255,255,255,.1)' }} />}</div>))}</div>
        <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,.5)', margin: '4px 0 0', fontWeight: 700 }}>{STEPS[step]}</p>

        <div style={css.body}>
          {error && <div style={css.errorBox}>{error}</div>}

          {step === 0 && (
            <div>
              <p style={css.sectionTitle}>Pilih Metode Pembayaran</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {PAYMENT_METHODS.map(m => (
                  <button key={m.id} onClick={() => setPayMethod(m)} style={{ ...css.optionBtn, borderColor: payMethod.id === m.id ? '#ef4444' : 'rgba(255,255,255,.12)', background: payMethod.id === m.id ? 'rgba(239,68,68,.12)' : 'rgba(255,255,255,.04)' }}>
                    <span style={{ fontSize: 26 }}>{m.icon}</span><div style={{ flex: 1, textAlign: 'left' }}><p style={{ margin: 0, fontWeight: 900, fontSize: 13, color: '#fff' }}>{m.label}</p><p style={{ margin: '2px 0 0', fontSize: 10, color: 'rgba(255,255,255,.4)' }}>{m.desc}</p></div>
                    {payMethod.id === m.id && <span style={{ color: '#ef4444', fontSize: 18 }}>✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <p style={css.sectionTitle}>Data Pembeli</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <label style={css.label}>Nama Lengkap <span style={{ color: '#ef4444' }}>*</span><input value={name} onChange={e => setName(e.target.value)} placeholder="Contoh: Budi Santoso" style={css.input} /></label>
                <label style={css.label}>Nomor WhatsApp <span style={{ color: '#ef4444' }}>*</span><input value={wa} onChange={e => setWa(e.target.value)} placeholder="Contoh: 08123456789" type="tel" style={css.input} /></label>
                <label style={css.label}>Email <span style={{ color: '#ef4444' }}>*</span><input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@gmail.com" type="email" style={css.input} /></label>
                <label style={css.label}>Catatan (opsional)<textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Catatan tambahan..." rows={2} style={{ ...css.input, resize: 'vertical' }} /></label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p style={css.sectionTitle}>Transfer & Upload Bukti</p>
              <div style={css.summaryBox}>
                <Row label="Bayar Via" value={payMethod.label} />
                <Row label="Nama" value={name} />
                <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 10, marginTop: 8 }}><Row label="Total Tagihan" value={fmtRp(totalAmount)} highlight /></div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: 16, padding: '20px', marginTop: 16, textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                {['qris', 'dana', 'gopay', 'ovo'].includes(payMethod.id) ? (
                  <>
                    <p style={{ color: '#1f2937', fontWeight: 900, marginBottom: 12, fontSize: 14 }}>SCAN QRIS / TRANSFER E-WALLET</p>
                    <div style={{ width: '100%', maxWidth: '320px', margin: '0 auto', padding: '10px', background: '#fff', border: '2px dashed #3b82f6', borderRadius: '12px' }}>
                        <img src="/qris-dana.jpeg" alt="QRIS VinzSky" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }} />
                    </div>
                    <p style={{ margin: '16px 0 0', color: '#1f2937', fontWeight: 900, fontSize: 13 }}>Atau Kirim Ke (DANA/GoPay/OVO):<br/><span style={{fontSize:24, color:'#2563eb', letterSpacing: '1px'}}>087785404383</span></p>
                  </>
                ) : (
                  <>
                    <p style={{ color: '#1f2937', fontWeight: 900, marginBottom: 8, fontSize: 14 }}>TRANSFER BANK BCA</p>
                    <div style={{ fontSize: 50, marginBottom: 10 }}>🏦</div>
                    <p style={{ margin: 0, color: '#1f2937', fontWeight: 700 }}>BCA:<br/><span style={{fontSize:28, color:'#2563eb', fontWeight: 900, letterSpacing: '2px'}}>856-073-8960</span></p>
                    <p style={{ margin: '8px 0 0', color: '#4b5563', fontWeight: 'bold' }}>a.n. VinzSky</p>
                  </>
                )}
              </div>

              <div style={{ marginTop: 20 }}>
                <p style={{ ...css.sectionTitle, marginBottom: 8 }}>📸 Upload Bukti (Wajib) <span style={{color: '#ef4444'}}>*</span></p>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                {proofBase64 ? (
                  <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                    <img src={proofBase64} alt="bukti" style={{ width: '100%', maxHeight: 200, objectFit: 'contain', borderRadius: 12, border: '2px solid rgba(74,222,128,.8)', background: 'rgba(0,0,0,.4)' }} />
                    <button onClick={() => { setProofFile(null); setProofBase64(null) }} style={{ position: 'absolute', top: 6, right: 6, background: '#ef4444', border: 'none', borderRadius: '50%', width: 28, height: 28, color: '#fff', cursor: 'pointer', fontWeight: 900 }}>✕</button>
                  </div>
                ) : (
                  <button onClick={() => fileRef.current?.click()} style={css.uploadBtn}>📁 Pilih Foto Bukti Transfer</button>
                )}
              </div>
            </div>
          )}
        </div>

        <div style={css.footer}>
          {step > 0 ? <button onClick={() => setStep(s => s - 1)} style={css.btnSecondary}>← Kembali</button> : <button onClick={handleClose} style={css.btnSecondary}>Batal</button>}
          {step < 2 ? <button onClick={() => { if (!canNext()) { setError('Lengkapi dulu!'); return }; setError(''); setStep(s => s + 1) }} disabled={!canNext()} style={{ ...css.btnPrimary, opacity: canNext() ? 1 : 0.4 }}>Lanjut →</button> : <button onClick={submitOrder} disabled={submitting || !proofFile} style={{ ...css.btnPrimary, opacity: (submitting || !proofFile) ? 0.5 : 1 }}>{submitting ? '⏳ Kirim...' : '✅ Kirim Order'}</button>}
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, highlight, mono }) { return (<div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}><span style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', fontWeight: 700 }}>{label}</span><span style={{ fontSize: mono ? 9 : 11, fontWeight: 900, color: highlight ? '#4ade80' : '#fff', fontFamily: mono ? 'monospace' : 'inherit' }}>{value || '-'}</span></div>) }

const css = {
  overlay: { position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(10px)', padding: 16 },
  modal: { width: '100%', maxWidth: 480, background: 'rgba(10,0,15,.95)', border: '1px solid rgba(239,68,68,.4)', borderRadius: 28, display: 'flex', flexDirection: 'column', maxHeight: '92vh', color: 'white', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,.08)' },
  closeBtn: { background: 'rgba(239,68,68,.15)', border: '1px solid rgba(239,68,68,.3)', borderRadius: '50%', width: 32, height: 32, color: '#f87171', cursor: 'pointer', fontWeight: 900 },
  stepWrap: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, padding: '16px 20px 4px' },
  stepDot: { width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 },
  body: { flex: 1, overflowY: 'auto', padding: '16px 20px', scrollbarWidth: 'none' },
  footer: { display: 'flex', justifyContent: 'space-between', padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,.08)' },
  sectionTitle: { fontSize: 12, fontWeight: 900, color: 'rgba(255,255,255,.6)', textTransform: 'uppercase', margin: '0 0 12px' },
  optionBtn: { width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, border: '1px solid rgba(255,255,255,.12)', cursor: 'pointer', textAlign: 'left' },
  label: { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.5)' },
  input: { background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 10, padding: '12px 14px', color: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box' },
  uploadBtn: { width: '100%', padding: '16px', borderRadius: 12, background: 'rgba(239,68,68,.1)', border: '2px dashed rgba(239,68,68,.4)', color: '#fca5a5', cursor: 'pointer', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 },
  summaryBox: { background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, padding: '12px 16px' },
  errorBox: { background: 'rgba(239,68,68,.12)', border: '1px solid rgba(239,68,68,.3)', borderRadius: 10, padding: '10px 14px', fontSize: 11, color: '#f87171', marginBottom: 12 },
  btnPrimary: { padding: '12px 24px', borderRadius: 12, background: 'linear-gradient(135deg,#991b1b,#ef4444)', border: '1px solid #f87171', color: '#fff', fontWeight: 900, cursor: 'pointer' },
  btnSecondary: { padding: '12px 24px', borderRadius: 12, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', color: 'rgba(255,255,255,.6)', fontWeight: 900, cursor: 'pointer' },
}