'use client'
// @ts-nocheck
/* eslint-disable */
import React, { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

let _sb = null
const getSupabase = () => {
  if (!_sb) {
    _sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  }
  return _sb
}















const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'vinz.official9922@gmail.com'
const fmt     = (n) => n?.toLocaleString('id-ID') || '0'
const fmtDate = (d) => d ? new Date(d).toLocaleString('id-ID',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}) : '-'
const fmtDateShort = (d) => d ? new Date(d).toLocaleDateString('id-ID',{day:'2-digit',month:'short'}) : '-'

/* ── TIER CONFIG WITH DIAMONDS ── */
const TIERS = {
  '1H':  { name:'Bronze', color:'#cd7f32', glow:'rgba(205,127,50,.7)',  bg:'rgba(205,127,50,.15)',  border:'rgba(205,127,50,.4)' },
  '7D':  { name:'Silver', color:'#60a5fa', glow:'rgba(96,165,250,.7)',  bg:'rgba(96,165,250,.15)',  border:'rgba(96,165,250,.4)' },
  '14D': { name:'Gold',   color:'#fbbf24', glow:'rgba(251,191,36,.7)',  bg:'rgba(251,191,36,.15)',  border:'rgba(251,191,36,.4)' },
  '30D': { name:'Ruby',   color:'#f472b6', glow:'rgba(244,114,182,.7)', bg:'rgba(244,114,182,.15)', border:'rgba(244,114,182,.4)' },
}

/* ── DIAMOND SVG ── */
const Diamond = ({ color='#60a5fa', glow='rgba(96,165,250,.7)', size=20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    style={{filter:`drop-shadow(0 0 4px ${glow}) drop-shadow(0 0 8px ${glow})`}}>
    <polygon points="12,2 20,8 20,10 12,22 4,10 4,8" fill={color} opacity="0.9"/>
    <polygon points="12,2 20,8 12,10 4,8" fill="white" opacity="0.35"/>
    <polygon points="12,10 20,10 12,22" fill={color} opacity="0.6"/>
    <polygon points="4,10 12,10 12,22" fill={color} opacity="0.8"/>
    <line x1="4" y1="8" x2="20" y2="8" stroke="white" strokeWidth="0.5" opacity="0.4"/>
  </svg>
)

const getTier = (tier) => TIERS[tier] || TIERS['7D']

/* ── MINI BAR CHART ── */
const MiniBarChart = ({ data=[], color='#3b82f6', height=60, label='' }) => {
  const max = Math.max(...data.map(d=>d.value), 1)
  return (
    <div style={{width:'100%'}}>
      <div style={{display:'flex',alignItems:'flex-end',gap:3,height:height}}>
        {data.map((d,i) => (
          <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-end',height:'100%'}}>
            <div style={{
              width:'100%',
              height:`${(d.value/max)*100}%`,
              minHeight:2,
              background:`linear-gradient(to top,${color}cc,${color})`,
              borderRadius:'3px 3px 0 0',
              boxShadow:`0 0 6px ${color}60`,
              transition:'height .5s ease',
            }}/>
          </div>
        ))}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:4}}>
        {data.filter((_,i)=>i%Math.ceil(data.length/5)===0||i===data.length-1).map((d,i)=>(
          <span key={i} style={{fontSize:8,color:'rgba(255,255,255,.3)',fontFamily:'monospace'}}>{d.label}</span>
        ))}
      </div>
    </div>
  )
}

/* ── DONUT CHART ── */
const DonutChart = ({ segments=[], size=120, thickness=20 }) => {
  const total = segments.reduce((s,d)=>s+d.value,0)||1
  let offset = 0
  const r = (size-thickness)/2
  const circ = 2*Math.PI*r
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segments.map((seg,i)=>{
        const pct = seg.value/total
        const dash = pct*circ
        const gap  = circ-dash
        const rot  = offset*360-90
        offset += pct
        return(
          <circle key={i}
            cx={size/2} cy={size/2} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={thickness}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-((offset-pct)*circ)}
            transform={`rotate(-90 ${size/2} ${size/2})`}
            style={{filter:`drop-shadow(0 0 4px ${seg.color}80)`,transition:'all .5s'}}
          />
        )
      })}
      {/* center hole */}
      <circle cx={size/2} cy={size/2} r={r-thickness/2-2} fill="rgba(5,9,25,.8)"/>
    </svg>
  )
}

/* ── SPARKLINE ── */
const Sparkline = ({ data=[], color='#3b82f6', width=80, height=30 }) => {
  if(data.length<2) return null
  const max=Math.max(...data,1); const min=Math.min(...data,0)
  const pts=data.map((v,i)=>{
    const x=(i/(data.length-1))*width
    const y=height-((v-min)/(max-min||1))*height
    return `${x},${y}`
  }).join(' ')
  return(
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5"
        style={{filter:`drop-shadow(0 0 3px ${color})`}}/>
    </svg>
  )
}

export default function AdminPanel() {
  const [supabase,      setSupabase]      = useState(null)
  const [authUser,      setAuthUser]      = useState(null)
  const [loading,       setLoading]       = useState(true)
  const [activeTab,     setActiveTab]     = useState('dashboard')
  const [orders,        setOrders]        = useState([])
  const [licenses,      setLicenses]      = useState([])
  const [reviews,       setReviews]       = useState([])
  const [visitors,      setVisitors]      = useState([])
  const [products,      setProducts]      = useState([])
  const [viewCounts,    setViewCounts]    = useState({})
  const [members,       setMembers]       = useState([])
  const [searchQ,       setSearchQ]       = useState('')
  const [isRefreshing,  setIsRefreshing]  = useState(false)
  const [stats,         setStats]         = useState({
    totalRevenue:0, totalOrders:0, activeVisitors:0, totalReviews:0,
    totalMembers:0, revenueByDay:[], visitorsByDay:[], ordersByTier:{},
    convRate:0, avgOrder:0,
  })

  /* ── init supabase ── */
  useEffect(()=>{
    const sb = getSupabase()
    setSupabase(sb)
    sb.auth.getSession().then(({data:{session}})=>{
      if(session?.user){
        const u=session.user
        if(u.email===ADMIN_EMAIL||u.user_metadata?.is_admin) setAuthUser(u)
      }
      setLoading(false)
    })
    const{data:{subscription}}=sb.auth.onAuthStateChange((_,session)=>{
      if(session?.user&&(session.user.email===ADMIN_EMAIL||session.user.user_metadata?.is_admin)){
        setAuthUser(session.user)
      }else setAuthUser(null)
    })
    return()=>subscription.unsubscribe()
  },[])

  /* ── fetch all ── */
  const fetchAll = useCallback(async()=>{
    if(!supabase) return
    setIsRefreshing(true)
    try{
      const[{data:ord},{data:lic},{data:rev},{data:vis},{data:prod},{data:pv}]=await Promise.all([
        supabase.from('orders').select('*').order('created_at',{ascending:false}),
        supabase.from('licenses').select('*').order('created_at',{ascending:false}),
        supabase.from('reviews').select('*').order('created_at',{ascending:false}),
        supabase.from('visitors').select('*').order('last_seen',{ascending:false}).limit(300),
        supabase.from('products').select('*').order('id',{ascending:true}),
        supabase.from('product_views').select('product_id'),
      ])

      setOrders(ord||[])
      setLicenses(lic||[])
      setReviews(rev||[])
      setVisitors(vis||[])
      setProducts(prod||[])

      const vc={}
      ;(pv||[]).forEach(v=>{vc[v.product_id]=(vc[v.product_id]||0)+1})
      setViewCounts(vc)

      // build members from licenses (unique HWID)
      const memberMap={}
      ;(lic||[]).forEach(l=>{
        if(!l.master_hwid) return
        if(!memberMap[l.master_hwid]){
          const o=(ord||[]).find(o=>o.master_hwid===l.master_hwid)
          memberMap[l.master_hwid]={
            hwid:l.master_hwid,
            name:o?.customer_name||'Guest',
            email:o?.customer_email||'-',
            wa:o?.customer_wa||'-',
            tier:l.tier||'7D',
            status:l.status||'PENDING',
            createdAt:l.created_at,
            totalSpend:(ord||[]).filter(o=>o.master_hwid===l.master_hwid).reduce((s,o)=>s+(o.total_price||0),0),
          }
        }
      })
      setMembers(Object.values(memberMap))

      // analytics
      const totalRev=(ord||[]).reduce((s,o)=>s+(o.total_price||0),0)
      const since5m=new Date(Date.now()-5*60*1000).toISOString()
      const activeV=(vis||[]).filter(v=>v.last_seen>=since5m).length

      // revenue by day (last 14 days)
      const days14=Array.from({length:14},(_,i)=>{
        const d=new Date(); d.setDate(d.getDate()-13+i)
        return{label:fmtDateShort(d.toISOString()),date:d.toISOString().split('T')[0],value:0}
      })
      ;(ord||[]).forEach(o=>{
        const day=o.created_at?.split('T')[0]
        const found=days14.find(d=>d.date===day)
        if(found) found.value+=o.total_price||0
      })

      // visitors by day
      const vdays14=Array.from({length:14},(_,i)=>{
        const d=new Date(); d.setDate(d.getDate()-13+i)
        return{label:fmtDateShort(d.toISOString()),date:d.toISOString().split('T')[0],value:0}
      })
      ;(vis||[]).forEach(v=>{
        const day=v.created_at?.split('T')[0]||v.last_seen?.split('T')[0]
        const found=vdays14.find(d=>d.date===day)
        if(found) found.value++
      })

      // orders by tier
      const tierCounts={'1H':0,'7D':0,'14D':0,'30D':0}
      ;(lic||[]).forEach(l=>{ if(tierCounts[l.tier]!==undefined) tierCounts[l.tier]++ })

      // conversion rate = orders/visitors*100
      const convRate=vis?.length>0?((ord||[]).length/vis.length*100):0

      setStats({
        totalRevenue:totalRev,
        totalOrders:(ord||[]).length,
        activeVisitors:activeV,
        totalReviews:(rev||[]).length,
        totalMembers:Object.keys(memberMap).length,
        revenueByDay:days14,
        visitorsByDay:vdays14,
        ordersByTier:tierCounts,
        convRate:Math.min(convRate,100).toFixed(1),
        avgOrder:(ord||[]).length>0?(totalRev/(ord||[]).length):0,
      })
    }catch(e){console.error(e)}
    setIsRefreshing(false)
  },[supabase])

  useEffect(()=>{ if(authUser&&supabase) fetchAll() },[authUser,supabase,fetchAll])

  /* ── realtime ── */
  useEffect(()=>{
    if(!authUser||!supabase) return
    const ch=supabase.channel('admin-rt')
      .on('postgres_changes',{event:'*',schema:'public',table:'orders'},()=>fetchAll())
      .on('postgres_changes',{event:'*',schema:'public',table:'licenses'},()=>fetchAll())
      .on('postgres_changes',{event:'*',schema:'public',table:'reviews'},()=>fetchAll())
      .on('postgres_changes',{event:'*',schema:'public',table:'visitors'},()=>fetchAll())
      .subscribe()
    return()=>supabase.removeChannel(ch)
  },[authUser,supabase,fetchAll])

  const handleLogin=async()=>{
    if(!supabase) return
    await supabase.auth.signInWithOAuth({provider:'google',options:{redirectTo:window.location.origin+'/admin'}})
  }
  const handleLogout=async()=>{ if(!supabase) return; await supabase.auth.signOut(); setAuthUser(null) }

  const updateLicense=async(id,status)=>{ if(!supabase) return; await supabase.from('licenses').update({status}).eq('id',id); fetchAll() }
  const deleteOrder=async(id)=>{ if(!supabase||!window.confirm('Hapus order ini?')) return; await supabase.from('orders').delete().eq('id',id); fetchAll() }
  const deleteReview=async(id)=>{ if(!supabase||!window.confirm('Hapus review ini?')) return; await supabase.from('reviews').delete().eq('id',id); fetchAll() }

  const exportCSV=()=>{
    const rows=[['ID','Nama','WA','Email','Produk','Total','Tanggal'],...orders.map(o=>[o.id,o.customer_name||'',o.customer_wa||'',o.customer_email||'',o.items?.[0]?.name||'',o.total_price||0,fmtDate(o.created_at)])]
    const a=document.createElement('a');a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(rows.map(r=>r.join(',')).join('\n'));a.download='orders_vinzsky.csv';a.click()
  }

  const filteredOrders=orders.filter(o=>{const q=searchQ.toLowerCase();return(o.customer_name||'').toLowerCase().includes(q)||(o.customer_email||'').toLowerCase().includes(q)||(o.customer_wa||'').toLowerCase().includes(q)})
  const filteredMembers=members.filter(m=>{const q=searchQ.toLowerCase();return(m.name||'').toLowerCase().includes(q)||(m.email||'').toLowerCase().includes(q)})

  const S={
    card:(bg,border)=>({background:bg,border:`1px solid ${border}`,borderRadius:16,padding:16}),
    th:{padding:'10px 12px',textAlign:'left',fontSize:10,fontWeight:900,color:'rgba(255,255,255,.4)',textTransform:'uppercase',letterSpacing:1,whiteSpace:'nowrap',borderBottom:'1px solid rgba(255,255,255,.07)',background:'rgba(255,255,255,.03)'},
    td:{padding:'10px 12px',borderBottom:'1px solid rgba(255,255,255,.05)',fontSize:12},
    badge:(c,bg,border)=>({color:c,background:bg,border:`1px solid ${border}`,borderRadius:99,padding:'2px 8px',fontSize:9,fontWeight:900,textTransform:'uppercase'}),
  }

  /* ════ LOADING ════ */
  if(loading) return(
    <div style={{minHeight:'100vh',background:'#020610',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center',color:'#60a5fa',fontFamily:'monospace',fontWeight:900}}>
        <div style={{fontSize:40,marginBottom:16}}>⏳</div>Loading Admin Panel...
      </div>
    </div>
  )

  /* ════ LOGIN PAGE ════ */
  if(!authUser) return(
    <div style={{minHeight:'100vh',background:'#020610',display:'flex',alignItems:'center',justifyContent:'center',padding:24,fontFamily:'system-ui'}}>
      <div style={{maxWidth:400,width:'100%',background:'rgba(5,9,25,.95)',border:'1px solid rgba(59,130,246,.3)',borderRadius:24,padding:40,textAlign:'center',boxShadow:'0 0 60px rgba(37,99,235,.15)'}}>
        {/* Logo */}
        <div style={{width:80,height:80,borderRadius:18,background:'linear-gradient(135deg,#0f1729,#1a1040)',border:'1px solid rgba(255,255,255,.15)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',boxShadow:'0 0 24px rgba(37,99,235,.4)'}}>
          <span style={{fontWeight:900,fontSize:18,color:'white',letterSpacing:-0.5}}>VinzSky</span>
          <div style={{display:'flex',alignItems:'center',gap:2,marginTop:1}}>
            <span style={{fontSize:8,fontWeight:900,color:'#93c5fd',letterSpacing:2}}>ADMIN</span>
          </div>
        </div>
        <h1 style={{color:'white',fontWeight:900,fontSize:22,margin:'0 0 6px'}}>Admin Panel</h1>
        <p style={{color:'rgba(255,255,255,.4)',fontSize:12,margin:'0 0 6px',fontWeight:700}}>VinzSky-shopID</p>
        {/* Tier diamonds */}
        <div style={{display:'flex',justifyContent:'center',gap:12,margin:'16px 0 24px'}}>
          {Object.entries(TIERS).map(([k,t])=>(
            <div key={k} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
              <Diamond color={t.color} glow={t.glow} size={18}/>
              <span style={{fontSize:7,fontWeight:900,color:t.color,textTransform:'uppercase',letterSpacing:1}}>{t.name}</span>
            </div>
          ))}
        </div>
        <p style={{color:'rgba(255,255,255,.25)',fontSize:11,margin:'0 0 28px'}}>Login dengan akun Google admin yang terdaftar</p>
        <button onClick={handleLogin} style={{width:'100%',padding:14,borderRadius:14,background:'linear-gradient(135deg,#1d4ed8,#4f46e5)',border:'none',color:'white',fontWeight:900,fontSize:14,cursor:'pointer',boxShadow:'0 0 20px rgba(37,99,235,.4)'}}>
          🔑 Login dengan Google
        </button>
        <p style={{color:'rgba(255,255,255,.15)',fontSize:10,marginTop:16}}>Hanya email admin yang dapat mengakses</p>
      </div>
    </div>
  )

  const tabs=[
    {id:'dashboard',label:'Dashboard'},
    {id:'members',  label:`Members (${members.length})`},
    {id:'orders',   label:`Orders (${orders.length})`},
    {id:'licenses', label:`Lisensi (${licenses.length})`},
    {id:'reviews',  label:`Reviews (${reviews.length})`},
    {id:'visitors', label:'Visitors'},
    {id:'products', label:'Produk'},
  ]

  /* ════ MAIN PANEL ════ */
  return(
    <div style={{minHeight:'100vh',background:'#020610',color:'white',fontFamily:'system-ui'}}>
      {/* ── HEADER ── */}
      <div style={{position:'sticky',top:0,zIndex:50,padding:'12px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',background:'rgba(3,7,20,.95)',backdropFilter:'blur(24px)',borderBottom:'1px solid rgba(255,255,255,.07)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          {/* Logo */}
          <div style={{width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,#0f1729,#1a1040)',border:'1px solid rgba(255,255,255,.15)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',boxShadow:'0 0 12px rgba(37,99,235,.3)'}}>
            <span style={{fontWeight:900,fontSize:10,color:'white',letterSpacing:-0.3,lineHeight:1}}>VinzSky</span>
            <span style={{fontSize:6,fontWeight:900,color:'#93c5fd',letterSpacing:1}}>ADMIN</span>
          </div>
          <div>
            <p style={{fontWeight:900,fontSize:13,margin:0}}>Admin Panel</p>
            <p style={{fontSize:9,color:'rgba(255,255,255,.3)',margin:0}}>VinzSky-shopID • {authUser.email}</p>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <button onClick={fetchAll} disabled={isRefreshing} style={{padding:'6px 12px',borderRadius:8,background:'rgba(59,130,246,.12)',border:'1px solid rgba(59,130,246,.25)',cursor:'pointer',color:'#93c5fd',fontSize:10,fontWeight:900}}>
            {isRefreshing?'⏳':'🔄'} Refresh
          </button>
          <button onClick={exportCSV} style={{padding:'6px 12px',borderRadius:8,background:'rgba(34,197,94,.12)',border:'1px solid rgba(34,197,94,.25)',cursor:'pointer',color:'#4ade80',fontSize:10,fontWeight:900}}>📥 CSV</button>
          <button onClick={handleLogout} style={{padding:'6px 12px',borderRadius:8,background:'rgba(239,68,68,.12)',border:'1px solid rgba(239,68,68,.25)',cursor:'pointer',color:'#f87171',fontSize:10,fontWeight:900}}>🚪 Keluar</button>
        </div>
      </div>

      <div style={{maxWidth:1280,margin:'0 auto',padding:'20px 16px'}}>
        {/* ── TABS ── */}
        <div style={{display:'flex',gap:6,marginBottom:20,overflowX:'auto',paddingBottom:4}}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setActiveTab(t.id)}
              style={{padding:'8px 14px',borderRadius:10,fontSize:11,fontWeight:900,whiteSpace:'nowrap',cursor:'pointer',flexShrink:0,
                background:activeTab===t.id?'rgba(37,99,235,.25)':'rgba(255,255,255,.04)',
                border:activeTab===t.id?'1px solid rgba(59,130,246,.5)':'1px solid rgba(255,255,255,.07)',
                color:activeTab===t.id?'#93c5fd':'rgba(255,255,255,.4)'}}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ══════════════════ DASHBOARD ══════════════════ */}
        {activeTab==='dashboard'&&(
          <div>
            {/* ── stat cards ── */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:12,marginBottom:20}}>
              {[
                {label:'Total Pemasukan',  value:`Rp ${fmt(stats.totalRevenue)}`,  color:'#4ade80',bg:'rgba(34,197,94,.1)',  border:'rgba(34,197,94,.2)',   spark:[100,120,90,140,110,160,130].map((v,i)=>stats.revenueByDay.slice(-7)[i]?.value||v)},
                {label:'Total Orders',     value:stats.totalOrders,                color:'#93c5fd',bg:'rgba(59,130,246,.1)', border:'rgba(59,130,246,.2)',   spark:[3,5,4,7,6,8,9]},
                {label:'Online Sekarang',  value:stats.activeVisitors,             color:'#4ade80',bg:'rgba(34,197,94,.08)',border:'rgba(34,197,94,.15)',  spark:[10,15,12,18,14,20,16]},
                {label:'Total Members',    value:stats.totalMembers,               color:'#c4b5fd',bg:'rgba(168,85,247,.1)',border:'rgba(168,85,247,.2)',   spark:[1,2,3,4,5,6,7]},
                {label:'Total Reviews',    value:stats.totalReviews,               color:'#fcd34d',bg:'rgba(234,179,8,.08)',border:'rgba(234,179,8,.2)',    spark:[0,1,0,1,1,2,1]},
                {label:'Avg Order',        value:`Rp ${fmt(Math.round(stats.avgOrder))}`,color:'#fdba74',bg:'rgba(249,115,22,.08)',border:'rgba(249,115,22,.2)', spark:[50,60,55,70,65,80,75]},
                {label:'Konversi',         value:`${stats.convRate}%`,             color:'#67e8f9',bg:'rgba(6,182,212,.08)', border:'rgba(6,182,212,.2)',   spark:[1,2,1.5,2.5,2,3,2.5]},
                {label:'Total Views',      value:Object.values(viewCounts).reduce((a,b)=>a+b,0), color:'#f9a8d4',bg:'rgba(236,72,153,.08)',border:'rgba(236,72,153,.2)', spark:[5,8,6,10,8,12,9]},
              ].map((s,i)=>(
                <div key={i} style={{...S.card(s.bg,s.border)}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                    <p style={{color:s.color,fontWeight:900,fontSize:20,margin:0}}>{s.value}</p>
                    <Sparkline data={s.spark} color={s.color} width={50} height={24}/>
                  </div>
                  <p style={{color:'rgba(255,255,255,.4)',fontSize:9,fontWeight:700,textTransform:'uppercase',margin:0,letterSpacing:1}}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* ── GRAFIK REVENUE & VISITORS ── */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}>
              {/* Revenue chart */}
              <div style={{...S.card('rgba(255,255,255,.02)','rgba(255,255,255,.07)'),padding:20}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                  <div>
                    <p style={{fontWeight:900,fontSize:13,margin:'0 0 2px'}}>📈 Revenue Harian</p>
                    <p style={{fontSize:10,color:'rgba(255,255,255,.3)',margin:0}}>14 hari terakhir</p>
                  </div>
                  <div style={{background:'rgba(34,197,94,.1)',border:'1px solid rgba(34,197,94,.25)',borderRadius:8,padding:'4px 10px'}}>
                    <span style={{fontSize:11,fontWeight:900,color:'#4ade80'}}>Rp {fmt(stats.totalRevenue)}</span>
                  </div>
                </div>
                <MiniBarChart data={stats.revenueByDay} color="#4ade80" height={80}/>
              </div>

              {/* Visitors chart */}
              <div style={{...S.card('rgba(255,255,255,.02)','rgba(255,255,255,.07)'),padding:20}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                  <div>
                    <p style={{fontWeight:900,fontSize:13,margin:'0 0 2px'}}>👥 Visitor Harian</p>
                    <p style={{fontSize:10,color:'rgba(255,255,255,.3)',margin:0}}>14 hari terakhir</p>
                  </div>
                  <div style={{background:'rgba(59,130,246,.1)',border:'1px solid rgba(59,130,246,.25)',borderRadius:8,padding:'4px 10px'}}>
                    <span style={{fontSize:11,fontWeight:900,color:'#93c5fd'}}>{visitors.length} total</span>
                  </div>
                </div>
                <MiniBarChart data={stats.visitorsByDay} color="#60a5fa" height={80}/>
              </div>
            </div>

            {/* ── TIER DISTRIBUTION + RECENT ORDERS ── */}
            <div style={{display:'grid',gridTemplateColumns:'300px 1fr',gap:16,marginBottom:20}}>
              {/* Tier donut */}
              <div style={{...S.card('rgba(255,255,255,.02)','rgba(255,255,255,.07)'),padding:20}}>
                <p style={{fontWeight:900,fontSize:13,margin:'0 0 16px'}}>💎 Distribusi Tier</p>
                <div style={{display:'flex',alignItems:'center',gap:16}}>
                  <div style={{flexShrink:0}}>
                    <DonutChart size={100} thickness={18} segments={[
                      {value:stats.ordersByTier['1H']||0,  color:TIERS['1H'].color},
                      {value:stats.ordersByTier['7D']||0,  color:TIERS['7D'].color},
                      {value:stats.ordersByTier['14D']||0, color:TIERS['14D'].color},
                      {value:stats.ordersByTier['30D']||0, color:TIERS['30D'].color},
                    ]}/>
                  </div>
                  <div style={{flex:1}}>
                    {Object.entries(TIERS).map(([k,t])=>{
                      const cnt=stats.ordersByTier[k]||0
                      const total=Object.values(stats.ordersByTier).reduce((a,b)=>a+b,0)||1
                      const pct=((cnt/total)*100).toFixed(0)
                      return(
                        <div key={k} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                          <Diamond color={t.color} glow={t.glow} size={14}/>
                          <div style={{flex:1}}>
                            <div style={{display:'flex',justifyContent:'space-between',marginBottom:2}}>
                              <span style={{fontSize:10,fontWeight:900,color:t.color}}>{t.name}</span>
                              <span style={{fontSize:10,color:'rgba(255,255,255,.4)'}}>{cnt} ({pct}%)</span>
                            </div>
                            <div style={{height:3,borderRadius:99,background:'rgba(255,255,255,.06)'}}>
                              <div style={{height:'100%',borderRadius:99,width:`${pct}%`,background:t.color,boxShadow:`0 0 4px ${t.glow}`,transition:'width .5s'}}/>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Recent orders */}
              <div style={{...S.card('rgba(255,255,255,.02)','rgba(255,255,255,.07)'),padding:0,overflow:'hidden'}}>
                <div style={{padding:'14px 16px',borderBottom:'1px solid rgba(255,255,255,.06)'}}><span style={{fontWeight:900,fontSize:13}}>📋 5 Order Terbaru</span></div>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr>{['Nama','Produk','Tier','Total','Tgl'].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {orders.slice(0,5).map((o,i)=>{
                      const tier=getTier(o.items?.[0]?.durationCode||'7D')
                      return(
                        <tr key={i}>
                          <td style={S.td}><p style={{fontWeight:700,fontSize:12,margin:0}}>{o.customer_name||'Guest'}</p><p style={{fontSize:9,color:'rgba(255,255,255,.3)',margin:0}}>{o.customer_email}</p></td>
                          <td style={S.td}><span style={{fontSize:11,color:'#93c5fd'}}>{o.items?.[0]?.name||'-'}</span></td>
                          <td style={S.td}><div style={{display:'flex',alignItems:'center',gap:4}}><Diamond color={tier.color} glow={tier.glow} size={12}/><span style={{fontSize:10,color:tier.color,fontWeight:900}}>{tier.name}</span></div></td>
                          <td style={S.td}><span style={{fontWeight:900,color:'#4ade80',fontSize:12}}>Rp {fmt(o.total_price)}</span></td>
                          <td style={S.td}><span style={{fontSize:9,color:'rgba(255,255,255,.35)'}}>{fmtDate(o.created_at)}</span></td>
                        </tr>
                      )
                    })}
                    {orders.length===0&&<tr><td colSpan={5} style={{...S.td,textAlign:'center',color:'rgba(255,255,255,.2)',padding:32}}>Belum ada order</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── TRAFFIC PERCENTAGE ── */}
            <div style={{...S.card('rgba(255,255,255,.02)','rgba(255,255,255,.07)'),padding:20,marginBottom:20}}>
              <p style={{fontWeight:900,fontSize:13,margin:'0 0 16px'}}>📊 Trafik & Performa</p>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12}}>
                {[
                  {label:'Konversi Visitor→Order',value:parseFloat(stats.convRate),color:'#4ade80',max:10},
                  {label:'Produk Terlaris',value:Math.max(...Object.values(viewCounts),1)>0?((Math.max(...Object.values(viewCounts))/Math.max(Object.values(viewCounts).reduce((a,b)=>a+b,0),1))*100):0,color:'#f472b6',max:100,suffix:'% views'},
                  {label:'Member Aktif vs Total',value:stats.totalMembers>0?(licenses.filter(l=>l.status==='ACTIVE').length/Math.max(stats.totalMembers,1)*100):0,color:'#fbbf24',max:100},
                  {label:'Review Rate',value:orders.length>0?(reviews.length/Math.max(orders.length,1)*100):0,color:'#93c5fd',max:100},
                ].map((m,i)=>{
                  const pct=Math.min((m.value/m.max)*100,100)
                  return(
                    <div key={i} style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)',borderRadius:12,padding:14}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                        <span style={{fontSize:10,color:'rgba(255,255,255,.5)',fontWeight:700}}>{m.label}</span>
                        <span style={{fontSize:13,fontWeight:900,color:m.color}}>{m.value.toFixed(1)}{m.suffix||'%'}</span>
                      </div>
                      {/* circular progress */}
                      <div style={{position:'relative',width:56,height:56,margin:'0 auto'}}>
                        <svg width="56" height="56" viewBox="0 0 56 56">
                          <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="6"/>
                          <circle cx="28" cy="28" r="22" fill="none" stroke={m.color} strokeWidth="6"
                            strokeDasharray={`${(pct/100)*138.2} 138.2`}
                            strokeDashoffset="0"
                            transform="rotate(-90 28 28)"
                            style={{filter:`drop-shadow(0 0 4px ${m.color}80)`,transition:'stroke-dasharray .8s ease'}}/>
                        </svg>
                        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                          <span style={{fontSize:10,fontWeight:900,color:m.color}}>{Math.round(pct)}%</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════ MEMBERS ══════════════════ */}
        {activeTab==='members'&&(
          <div>
            <div style={{display:'flex',gap:10,marginBottom:14,flexWrap:'wrap'}}>
              <div style={{flex:1,minWidth:200,display:'flex',alignItems:'center',gap:8,background:'rgba(0,0,0,.4)',border:'1px solid rgba(255,255,255,.08)',borderRadius:10,padding:'8px 12px'}}>
                <span style={{color:'rgba(255,255,255,.3)',fontSize:14}}>🔍</span>
                <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Cari nama, email..." style={{background:'transparent',border:'none',outline:'none',color:'white',fontSize:12,width:'100%'}}/>
              </div>
              {/* tier filter stats */}
              <div style={{display:'flex',gap:8}}>
                {Object.entries(TIERS).map(([k,t])=>(
                  <div key={k} style={{display:'flex',alignItems:'center',gap:4,padding:'6px 10px',borderRadius:8,background:t.bg,border:`1px solid ${t.border}`}}>
                    <Diamond color={t.color} glow={t.glow} size={12}/>
                    <span style={{fontSize:10,fontWeight:900,color:t.color}}>{stats.ordersByTier[k]||0}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:'rgba(255,255,255,.02)',border:'1px solid rgba(255,255,255,.07)',borderRadius:16,overflow:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',minWidth:700}}>
                <thead><tr>{['Member','Email / WA','Tier','Status','Total Spend','Bergabung'].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {filteredMembers.map((m,i)=>{
                    const tier=getTier(m.tier)
                    return(
                      <tr key={i} style={{background:i%2===0?'transparent':'rgba(255,255,255,.01)'}}>
                        <td style={S.td}><p style={{fontWeight:700,margin:0,fontSize:12}}>{m.name}</p><p style={{fontSize:9,color:'rgba(255,255,255,.25)',margin:0,fontFamily:'monospace'}}>{m.hwid?.substring(0,12)}...</p></td>
                        <td style={S.td}><p style={{fontSize:10,color:'rgba(255,255,255,.5)',margin:0}}>{m.email}</p><p style={{fontSize:10,color:'rgba(255,255,255,.35)',margin:0}}>{m.wa}</p></td>
                        <td style={S.td}>
                          <div style={{display:'flex',alignItems:'center',gap:6,padding:'4px 8px',borderRadius:8,width:'fit-content',background:tier.bg,border:`1px solid ${tier.border}`}}>
                            <Diamond color={tier.color} glow={tier.glow} size={14}/>
                            <span style={{fontSize:10,fontWeight:900,color:tier.color}}>{tier.name}</span>
                          </div>
                        </td>
                        <td style={S.td}><span style={S.badge(m.status==='ACTIVE'?'#4ade80':'#fcd34d',m.status==='ACTIVE'?'rgba(34,197,94,.1)':'rgba(234,179,8,.1)',m.status==='ACTIVE'?'rgba(34,197,94,.3)':'rgba(234,179,8,.3)')}>{m.status||'PENDING'}</span></td>
                        <td style={S.td}><span style={{fontWeight:900,color:'#4ade80',fontSize:12}}>Rp {fmt(m.totalSpend)}</span></td>
                        <td style={S.td}><span style={{fontSize:10,color:'rgba(255,255,255,.35)'}}>{fmtDate(m.createdAt)}</span></td>
                      </tr>
                    )
                  })}
                  {filteredMembers.length===0&&<tr><td colSpan={6} style={{...S.td,textAlign:'center',color:'rgba(255,255,255,.2)',padding:32}}>Belum ada member</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════════ ORDERS ══════════════════ */}
        {activeTab==='orders'&&(
          <div>
            <div style={{display:'flex',gap:10,marginBottom:14,flexWrap:'wrap'}}>
              <div style={{flex:1,minWidth:200,display:'flex',alignItems:'center',gap:8,background:'rgba(0,0,0,.4)',border:'1px solid rgba(255,255,255,.08)',borderRadius:10,padding:'8px 12px'}}>
                <span style={{color:'rgba(255,255,255,.3)'}}>🔍</span>
                <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Cari nama, email, WA..." style={{background:'transparent',border:'none',outline:'none',color:'white',fontSize:12,width:'100%'}}/>
              </div>
              <button onClick={exportCSV} style={{padding:'8px 14px',borderRadius:10,background:'rgba(34,197,94,.12)',border:'1px solid rgba(34,197,94,.25)',color:'#4ade80',fontSize:11,fontWeight:900,cursor:'pointer'}}>📥 Export CSV</button>
            </div>
            <div style={{background:'rgba(255,255,255,.02)',border:'1px solid rgba(255,255,255,.07)',borderRadius:16,overflow:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',minWidth:700}}>
                <thead><tr>{['Nama','Kontak','Produk','Tier','Status','Total','Tanggal','Aksi'].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {filteredOrders.map((o,i)=>{
                    const tier=getTier(o.items?.[0]?.durationCode||'7D')
                    return(
                      <tr key={i}>
                        <td style={S.td}><p style={{fontWeight:700,margin:0,fontSize:12}}>{o.customer_name||'-'}</p><p style={{fontSize:9,color:'rgba(255,255,255,.25)',margin:0,fontFamily:'monospace'}}>{o.master_hwid}</p></td>
                        <td style={S.td}><p style={{fontSize:10,color:'rgba(255,255,255,.5)',margin:0}}>{o.customer_wa||'-'}</p><p style={{fontSize:10,color:'rgba(255,255,255,.35)',margin:0}}>{o.customer_email||'-'}</p></td>
                        <td style={S.td}><p style={{fontSize:11,color:'#93c5fd',margin:0}}>{o.items?.[0]?.name||'-'}</p></td>
                        <td style={S.td}><div style={{display:'flex',alignItems:'center',gap:4}}><Diamond color={tier.color} glow={tier.glow} size={12}/><span style={{fontSize:10,color:tier.color,fontWeight:900}}>{tier.name}</span></div></td>
                        <td style={S.td}>{(()=>{
                          const st=o.order_status||o.status||'PENDING'
                          const isS=st==='SUCCESS'||st.includes('LUNAS')
                          const isP=st==='PROGRESS'||st.includes('PROGRESS')
                          const isC=st==='CANCELLED'||st.includes('CANCEL')||st.includes('GAGAL')
                          const isPe=!isS&&!isP&&!isC
                          const c=isS?'#4ade80':isP?'#60a5fa':isC?'#f87171':'#9ca3af'
                          const bg=isS?'rgba(34,197,94,.1)':isP?'rgba(59,130,246,.1)':isC?'rgba(239,68,68,.1)':'rgba(255,255,255,.05)'
                          const br=isS?'rgba(34,197,94,.3)':isP?'rgba(59,130,246,.3)':isC?'rgba(239,68,68,.3)':'rgba(255,255,255,.1)'
                          const lbl=isS?'✅ BERHASIL':isP?'🔄 PROSES':isC?'❌ BATAL':'⏳ PENDING'
                          return(
                            <div style={{display:'flex',flexDirection:'column',gap:4}}>
                              <span style={S.badge(c,bg,br)}>{lbl}</span>
                              <div style={{display:'flex',gap:3,flexWrap:'wrap'}}>
                                {['PENDING','PROGRESS','SUCCESS','CANCELLED'].map(s=>(
                                  <button key={s} onClick={async()=>{await supabase.from('orders').update({order_status:s}).eq('id',o.id);fetchAll()}}
                                    style={{padding:'2px 5px',borderRadius:4,fontSize:8,fontWeight:900,cursor:'pointer',
                                      background:(o.order_status||'PENDING')===s?'rgba(255,255,255,.15)':'rgba(255,255,255,.04)',
                                      border:'1px solid rgba(255,255,255,.1)',
                                      color:s==='SUCCESS'?'#4ade80':s==='PROGRESS'?'#60a5fa':s==='CANCELLED'?'#f87171':'#9ca3af'}}>
                                    {s==='SUCCESS'?'✅':s==='PROGRESS'?'🔄':s==='CANCELLED'?'❌':'⏳'}{s}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )
                        })()}</td>
                        <td style={S.td}><span style={{fontWeight:900,color:'#4ade80',fontSize:12}}>Rp {fmt(o.total_price)}</span></td>
                        <td style={S.td}><span style={{fontSize:10,color:'rgba(255,255,255,.35)'}}>{fmtDate(o.created_at)}</span></td>
                        <td style={S.td}><button onClick={()=>deleteOrder(o.id)} style={{padding:'4px 8px',borderRadius:6,background:'rgba(239,68,68,.12)',border:'1px solid rgba(239,68,68,.25)',color:'#f87171',cursor:'pointer',fontSize:10}}>Hapus</button></td>
                      </tr>
                    )
                  })}
                  {filteredOrders.length===0&&<tr><td colSpan={7} style={{...S.td,textAlign:'center',color:'rgba(255,255,255,.2)',padding:32}}>Tidak ada order</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════════ LICENSES ══════════════════ */}
        {activeTab==='licenses'&&(
          <div style={{background:'rgba(255,255,255,.02)',border:'1px solid rgba(255,255,255,.07)',borderRadius:16,overflow:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',minWidth:700}}>
              <thead><tr>{['License Key','HWID','Tier','Status','Expired','Aksi'].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
              <tbody>
                {licenses.map((l,i)=>{
                  const tier=getTier(l.tier)
                  return(
                    <tr key={i}>
                      <td style={S.td}><code style={{fontSize:10,color:'#fcd34d',fontFamily:'monospace'}}>{l.license_key||'-'}</code></td>
                      <td style={S.td}><code style={{fontSize:9,color:'rgba(255,255,255,.4)',fontFamily:'monospace'}}>{l.master_hwid||'-'}</code></td>
                      <td style={S.td}><div style={{display:'flex',alignItems:'center',gap:6,padding:'3px 8px',borderRadius:8,width:'fit-content',background:tier.bg,border:`1px solid ${tier.border}`}}><Diamond color={tier.color} glow={tier.glow} size={13}/><span style={{fontSize:10,fontWeight:900,color:tier.color}}>{tier.name}</span></div></td>
                      <td style={S.td}>{(()=>{
                        const isExp = l.tier!=='LIFETIME' && l.expires_at && new Date(l.expires_at)<new Date()
                        const st = isExp?'EXPIRED':l.status||'PENDING'
                        const c = st==='ACTIVE'?'#4ade80':st==='EXPIRED'?'#f87171':st==='PENDING'?'#fcd34d':'#f87171'
                        const bg = st==='ACTIVE'?'rgba(34,197,94,.1)':st==='EXPIRED'?'rgba(239,68,68,.1)':st==='PENDING'?'rgba(234,179,8,.1)':'rgba(239,68,68,.1)'
                        const br = st==='ACTIVE'?'rgba(34,197,94,.3)':st==='EXPIRED'?'rgba(239,68,68,.3)':st==='PENDING'?'rgba(234,179,8,.3)':'rgba(239,68,68,.3)'
                        return <span style={S.badge(c,bg,br)}>{st}</span>
                      })()}</td>
                      <td style={S.td}><span style={{fontSize:10,color:'rgba(255,255,255,.35)'}}>{fmtDate(l.expires_at)}</span></td>
                      <td style={S.td}><div style={{display:'flex',gap:4}}>
                        {l.status!=='ACTIVE'&&<button onClick={()=>updateLicense(l.id,'ACTIVE')} style={{padding:'4px 8px',borderRadius:6,background:'rgba(34,197,94,.12)',border:'1px solid rgba(34,197,94,.25)',color:'#4ade80',cursor:'pointer',fontSize:10,fontWeight:900}}>Aktifkan</button>}
                        {l.status==='ACTIVE'&&<button onClick={()=>updateLicense(l.id,'REVOKED')} style={{padding:'4px 8px',borderRadius:6,background:'rgba(239,68,68,.12)',border:'1px solid rgba(239,68,68,.25)',color:'#f87171',cursor:'pointer',fontSize:10,fontWeight:900}}>Cabut</button>}
                      </div></td>
                    </tr>
                  )
                })}
                {licenses.length===0&&<tr><td colSpan={6} style={{...S.td,textAlign:'center',color:'rgba(255,255,255,.2)',padding:32}}>Belum ada lisensi</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* ══════════════════ REVIEWS ══════════════════ */}
        {activeTab==='reviews'&&(
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:12}}>
            {reviews.map((r,i)=>(
              <div key={i} style={S.card('rgba(255,255,255,.03)','rgba(255,255,255,.07)')}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    {/* Avatar */}
                    {r.buyer_avatar
                      ? <img src={r.buyer_avatar} alt="av" style={{width:36,height:36,borderRadius:'50%',objectFit:'cover',border:'1.5px solid rgba(59,130,246,.4)',flexShrink:0}}/>
                      : <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#1d4ed8,#7c3aed)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:900,flexShrink:0,border:'1.5px solid rgba(59,130,246,.4)'}}>{(r.name||'G')[0].toUpperCase()}</div>
                    }
                    <div>
                      <p style={{fontWeight:900,fontSize:13,margin:0}}>{r.name||'Guest'}</p>
                      <div style={{display:'flex',alignItems:'center',gap:6,marginTop:2}}>
                        {/* Tier diamond */}
                        {(()=>{const t=getTier(r.tier_code||'7D');return(
                          <div style={{display:'flex',alignItems:'center',gap:3,padding:'1px 6px',borderRadius:8,background:t.bg,border:`1px solid ${t.border}`}}>
                            <Diamond color={t.color} glow={t.glow} size={9}/>
                            <span style={{fontSize:8,fontWeight:900,color:t.color,textTransform:'uppercase'}}>{t.name}</span>
                          </div>
                        )})()}
                        <p style={{fontSize:10,color:'#93c5fd',margin:0}}>{r.product||'Produk'}</p>
                      </div>
                      <p style={{fontSize:9,color:'rgba(255,255,255,.25)',margin:'2px 0 0'}}>{fmtDate(r.created_at)}</p>
                    </div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    <span style={{color:'#eab308'}}>{'★'.repeat(r.rating||5)}</span>
                    <button onClick={()=>deleteReview(r.id)} style={{padding:'4px 6px',borderRadius:6,background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.2)',color:'#f87171',cursor:'pointer',fontSize:10}}>✕</button>
                  </div>
                </div>
                <p style={{fontSize:12,color:'rgba(255,255,255,.6)',fontStyle:'italic',margin:0,lineHeight:1.6}}>"{r.review_text||r.text||'...'}"</p>
              </div>
            ))}
            {reviews.length===0&&<div style={{gridColumn:'1/-1',textAlign:'center',padding:60,color:'rgba(255,255,255,.2)'}}>Belum ada review</div>}
          </div>
        )}

        {/* ══════════════════ VISITORS ══════════════════ */}
        {activeTab==='visitors'&&(
          <div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:16}}>
              {[
                {label:'Online (5 menit)',   value:stats.activeVisitors, color:'#4ade80',bg:'rgba(34,197,94,.08)',border:'rgba(34,197,94,.2)'},
                {label:'Total Visitor',      value:visitors.length,      color:'#93c5fd',bg:'rgba(59,130,246,.08)',border:'rgba(59,130,246,.2)'},
                {label:'Total Product Views',value:Object.values(viewCounts).reduce((a,b)=>a+b,0),color:'#fdba74',bg:'rgba(249,115,22,.08)',border:'rgba(249,115,22,.2)'},
              ].map((s,i)=>(
                <div key={i} style={{...S.card(s.bg,s.border),textAlign:'center'}}>
                  <p style={{color:s.color,fontWeight:900,fontSize:24,margin:'0 0 4px'}}>{s.value}</p>
                  <p style={{color:'rgba(255,255,255,.4)',fontSize:10,fontWeight:700,margin:0}}>{s.label}</p>
                </div>
              ))}
            </div>
            {/* Visitor chart */}
            <div style={{...S.card('rgba(255,255,255,.02)','rgba(255,255,255,.07)'),padding:20,marginBottom:16}}>
              <p style={{fontWeight:900,fontSize:13,margin:'0 0 16px'}}>📊 Visitor 14 Hari Terakhir</p>
              <MiniBarChart data={stats.visitorsByDay} color="#60a5fa" height={100}/>
            </div>
            <div style={{background:'rgba(255,255,255,.02)',border:'1px solid rgba(255,255,255,.07)',borderRadius:16,overflow:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',minWidth:500}}>
                <thead><tr>{['Visitor ID','Device','Last Seen','Status'].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {visitors.slice(0,50).map((v,i)=>{
                    const isActive=new Date(v.last_seen)>new Date(Date.now()-5*60*1000)
                    return(
                      <tr key={i}>
                        <td style={S.td}><code style={{fontSize:9,color:'#fcd34d',fontFamily:'monospace'}}>{(v.visitor_id||'').substring(0,20)}...</code></td>
                        <td style={S.td}><p style={{fontSize:9,color:'rgba(255,255,255,.35)',margin:0,maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{(v.user_agent||'').substring(0,50)}</p></td>
                        <td style={S.td}><span style={{fontSize:10,color:'rgba(255,255,255,.4)'}}>{fmtDate(v.last_seen)}</span></td>
                        <td style={S.td}><span style={S.badge(isActive?'#4ade80':'rgba(255,255,255,.25)',isActive?'rgba(34,197,94,.1)':'rgba(255,255,255,.04)',isActive?'rgba(34,197,94,.3)':'rgba(255,255,255,.08)')}>{isActive?'🟢 Online':'Offline'}</span></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════════ PRODUCTS ══════════════════ */}
        {activeTab==='products'&&(
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:12}}>
            {products.map((p,i)=>(
              <div key={i} style={S.card('rgba(255,255,255,.03)','rgba(255,255,255,.07)')}>
                <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>
                  <img src={p.image||'/produk1.jpg'} onError={e=>{e.target.src='/produk1.jpg'}} style={{width:56,height:56,borderRadius:10,objectFit:'cover',flexShrink:0,border:'1px solid rgba(255,255,255,.08)'}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{fontWeight:900,fontSize:13,margin:'0 0 2px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.name}</p>
                    <p style={{fontSize:10,color:'#93c5fd',margin:'0 0 6px'}}>{p.category}</p>
                    <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                      <span style={{fontSize:11,fontWeight:900,color:'#4ade80'}}>Rp {(p.price||0).toLocaleString()}</span>
                      {p.isflashsale&&<span style={S.badge('#f87171','rgba(239,68,68,.1)','rgba(239,68,68,.25)')}>⚡ Flash</span>}
                      {p.discount_aktif&&<span style={S.badge('#c4b5fd','rgba(168,85,247,.1)','rgba(168,85,247,.25)')}>-{p.discount_persen}%</span>}
                    </div>
                    <div style={{display:'flex',gap:8,marginTop:6,flexWrap:'wrap'}}>
                      <span style={{fontSize:9,color:'rgba(255,255,255,.4)'}}>👁 {viewCounts[p.id]||0} views</span>
                      <span style={{fontSize:9,color:'rgba(255,255,255,.4)'}}>📦 Stok: {p.stock||99}</span>
                      {p.ziplink&&p.ziplink!=='#'&&<span style={{fontSize:9,color:'#4ade80'}}>✅ G-Drive</span>}
                      {p.pdflink&&p.pdflink!=='#'&&<span style={{fontSize:9,color:'#c4b5fd'}}>✅ PDF</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {products.length===0&&<div style={{gridColumn:'1/-1',textAlign:'center',padding:60,color:'rgba(255,255,255,.2)'}}>Belum ada produk</div>}
          </div>
        )}
      </div>
    </div>
  )
}