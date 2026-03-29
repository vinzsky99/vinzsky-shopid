'use client'
// @ts-nocheck
/* eslint-disable */
import React, { useState, useEffect, useCallback, useRef } from 'react'
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

const TIERS = {
  '1H':  { name:'Bronze', color:'#cd7f32', glow:'rgba(205,127,50,.7)',  bg:'rgba(205,127,50,.12)',  border:'rgba(205,127,50,.4)' },
  '7D':  { name:'Silver', color:'#60a5fa', glow:'rgba(96,165,250,.7)',  bg:'rgba(96,165,250,.12)',  border:'rgba(96,165,250,.4)' },
  '14D': { name:'Gold',   color:'#fbbf24', glow:'rgba(251,191,36,.7)',  bg:'rgba(251,191,36,.12)',  border:'rgba(251,191,36,.4)' },
  '30D': { name:'Ruby',   color:'#f472b6', glow:'rgba(244,114,182,.7)', bg:'rgba(244,114,182,.12)', border:'rgba(244,114,182,.4)' },
}

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

/* ── GALAXY BG CANVAS ── */
const GalaxyBg = () => {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight
    const onR = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
    window.addEventListener('resize', onR)

    const stars = Array.from({length:380}, () => ({
      x:Math.random()*W, y:Math.random()*H,
      r:Math.random()*1.6+0.2,
      sp:Math.random()*0.003+0.001,
      ph:Math.random()*Math.PI*2,
      col:['#fff','#ffe8c0','#c0d8ff','#ffd0ff','#c0ffee'][Math.floor(Math.random()*5)]
    }))

    const mw = Array.from({length:600}, () => {
      const t = Math.random()
      return {
        x: W*t + (Math.random()-.5)*140,
        y: H*0.46 + Math.sin(t*Math.PI*2.5)*H*0.14 + (Math.random()-.5)*H*0.18,
        r: Math.random()*1.3+0.15,
        op: Math.random()*0.55+0.15,
        col:['#ffe8c0','#ffd0e0','#d0e8ff','#fff','#ffe0ff'][Math.floor(Math.random()*5)]
      }
    })

    const nebs = [
      {x:W*.22,y:H*.38,rx:240,ry:110,col:'rgba(100,0,60,.1)',ang:-.25},
      {x:W*.75,y:H*.52,rx:260,ry:130,col:'rgba(0,20,110,.09)',ang:.2},
      {x:W*.5,y:H*.2, rx:170,ry:90, col:'rgba(70,0,100,.08)',ang:.1},
      {x:W*.1,y:H*.7, rx:190,ry:80, col:'rgba(0,70,80,.07)', ang:-.1},
    ]

    let fr=0, raf
    const draw = () => {
      ctx.clearRect(0,0,W,H)
      nebs.forEach(n=>{
        ctx.save(); ctx.translate(n.x,n.y); ctx.rotate(n.ang)
        const g=ctx.createRadialGradient(0,0,0,0,0,Math.max(n.rx,n.ry))
        g.addColorStop(0,n.col); g.addColorStop(1,'transparent')
        ctx.fillStyle=g; ctx.scale(n.rx/Math.max(n.rx,n.ry),n.ry/Math.max(n.rx,n.ry))
        ctx.beginPath(); ctx.arc(0,0,Math.max(n.rx,n.ry),0,Math.PI*2); ctx.fill(); ctx.restore()
      })
      mw.forEach(s=>{
        ctx.globalAlpha=s.op*(0.5+0.5*Math.sin(fr*.004+s.x*.01))
        ctx.fillStyle=s.col; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill()
      })
      ctx.globalAlpha=1
      stars.forEach(s=>{
        const tw=0.35+0.65*Math.sin(fr*s.sp*60+s.ph)
        ctx.globalAlpha=0.25+tw*0.75
        const g=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.r*3)
        g.addColorStop(0,s.col); g.addColorStop(1,'transparent')
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(s.x,s.y,s.r*3,0,Math.PI*2); ctx.fill()
        ctx.globalAlpha=tw; ctx.fillStyle='#fff'
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r*.5,0,Math.PI*2); ctx.fill()
      })
      ctx.globalAlpha=1
      if(fr%130===0){
        const bx=Math.random()*W,by=Math.random()*H
        const bg=ctx.createRadialGradient(bx,by,0,bx,by,28)
        bg.addColorStop(0,'rgba(255,255,255,.85)'); bg.addColorStop(.3,'rgba(200,210,255,.25)'); bg.addColorStop(1,'transparent')
        ctx.fillStyle=bg; ctx.beginPath(); ctx.arc(bx,by,28,0,Math.PI*2); ctx.fill()
        ctx.globalAlpha=.5; ctx.strokeStyle='rgba(255,255,255,.5)'; ctx.lineWidth=.5
        ctx.beginPath(); ctx.moveTo(bx-36,by); ctx.lineTo(bx+36,by); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(bx,by-36); ctx.lineTo(bx,by+36); ctx.stroke()
        ctx.globalAlpha=1
      }
      fr++; raf=requestAnimationFrame(draw)
    }
    draw()
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener('resize',onR) }
  },[])
  return <canvas ref={ref} style={{position:'fixed',inset:0,zIndex:0,width:'100%',height:'100%',pointerEvents:'none'}}/>
}

/* ── MINI BAR CHART ── */
const MiniBarChart = ({ data=[], color='#3b82f6', height=60 }) => {
  const max = Math.max(...data.map(d=>d.value), 1)
  return (
    <div style={{width:'100%'}}>
      <div style={{display:'flex',alignItems:'flex-end',gap:3,height}}>
        {data.map((d,i) => (
          <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-end',height:'100%'}}>
            <div style={{width:'100%',height:`${(d.value/max)*100}%`,minHeight:2,background:`linear-gradient(to top,${color}cc,${color})`,borderRadius:'3px 3px 0 0',boxShadow:`0 0 6px ${color}60`,transition:'height .5s ease'}}/>
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
        const pct=seg.value/total, dash=pct*circ, gap=circ-dash
        const o=offset; offset+=pct
        return(
          <circle key={i} cx={size/2} cy={size/2} r={r} fill="none" stroke={seg.color} strokeWidth={thickness}
            strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-(o*circ)}
            transform={`rotate(-90 ${size/2} ${size/2})`}
            style={{filter:`drop-shadow(0 0 4px ${seg.color}80)`,transition:'all .5s'}}/>
        )
      })}
      <circle cx={size/2} cy={size/2} r={r-thickness/2-2} fill="rgba(5,0,20,.6)"/>
    </svg>
  )
}

/* ── SPARKLINE ── */
const Sparkline = ({ data=[], color='#3b82f6', width=80, height=30 }) => {
  if(data.length<2) return null
  const max=Math.max(...data,1); const min=Math.min(...data,0)
  const pts=data.map((v,i)=>`${(i/(data.length-1))*width},${height-((v-min)/(max-min||1))*height}`).join(' ')
  return(
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" style={{filter:`drop-shadow(0 0 3px ${color})`}}/>
    </svg>
  )
}

/* ── GLASS CARD styles ── */
const glass = (accent='rgba(255,255,255,.08)') => ({
  background: 'rgba(5,0,20,0.35)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: `1px solid ${accent}`,
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
})

/* ── SHOOTING STARS ── */
const ShootingStars = () => (
  <>
    {[
      {top:'8%',left:'15%',h:70,delay:'0s',dur:'3.2s'},
      {top:'25%',left:'65%',h:50,delay:'1.3s',dur:'4.1s'},
      {top:'55%',left:'8%',h:90,delay:'2.6s',dur:'3.7s'},
      {top:'4%',left:'82%',h:60,delay:'0.8s',dur:'5.2s'},
      {top:'75%',left:'45%',h:45,delay:'3.5s',dur:'4.8s'},
    ].map((s,i)=>(
      <div key={i} style={{
        position:'fixed',zIndex:1,pointerEvents:'none',
        top:s.top,left:s.left,
        width:'2px',height:s.h,
        background:'linear-gradient(to bottom,rgba(255,255,255,0),rgba(255,255,255,.9))',
        borderRadius:999,
        animation:`adminShootStar ${s.dur} linear ${s.delay} infinite`,
      }}/>
    ))}
    <style>{`
      @keyframes adminShootStar {
        0%{transform:translateX(-80px) translateY(-80px) rotate(35deg);opacity:1}
        100%{transform:translateX(110vw) translateY(110vh) rotate(35deg);opacity:0}
      }
      @keyframes adminPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(1.04)}}
      @keyframes adminRainbow{
        0%{box-shadow:0 0 15px rgba(239,68,68,.7),0 0 30px rgba(239,68,68,.3),inset 0 0 10px rgba(239,68,68,.15);border-color:rgba(239,68,68,.6)}
        20%{box-shadow:0 0 15px rgba(249,115,22,.7),0 0 30px rgba(249,115,22,.3),inset 0 0 10px rgba(249,115,22,.15);border-color:rgba(249,115,22,.6)}
        40%{box-shadow:0 0 15px rgba(234,179,8,.7),0 0 30px rgba(234,179,8,.3),inset 0 0 10px rgba(234,179,8,.15);border-color:rgba(234,179,8,.6)}
        60%{box-shadow:0 0 15px rgba(34,197,94,.7),0 0 30px rgba(34,197,94,.3),inset 0 0 10px rgba(34,197,94,.15);border-color:rgba(34,197,94,.6)}
        80%{box-shadow:0 0 15px rgba(99,102,241,.7),0 0 30px rgba(99,102,241,.3),inset 0 0 10px rgba(99,102,241,.15);border-color:rgba(99,102,241,.6)}
        100%{box-shadow:0 0 15px rgba(168,85,247,.7),0 0 30px rgba(168,85,247,.3),inset 0 0 10px rgba(168,85,247,.15);border-color:rgba(168,85,247,.6)}
      }
      .admin-hover:hover{animation:adminRainbow 2s linear infinite!important;transform:translateY(-4px) scale(1.01)!important;cursor:pointer}
      .admin-tab-active{background:rgba(59,130,246,.2)!important;border-color:rgba(59,130,246,.5)!important;color:#93c5fd!important;box-shadow:0 0 20px rgba(59,130,246,.25)!important}
      .admin-tab:hover{animation:adminRainbow 2s linear infinite!important}
    `}</style>
  </>
)

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
    totalRevenue:0,totalOrders:0,activeVisitors:0,totalReviews:0,
    totalMembers:0,revenueByDay:[],visitorsByDay:[],ordersByTier:{},
    convRate:0,avgOrder:0,
  })

  useEffect(()=>{
    const sb=getSupabase(); setSupabase(sb)
    sb.auth.getSession().then(({data:{session}})=>{
      if(session?.user){const u=session.user;if(u.email===ADMIN_EMAIL||u.user_metadata?.is_admin)setAuthUser(u)}
      setLoading(false)
    })
    const{data:{subscription}}=sb.auth.onAuthStateChange((_,session)=>{
      if(session?.user&&(session.user.email===ADMIN_EMAIL||session.user.user_metadata?.is_admin)){setAuthUser(session.user)}else setAuthUser(null)
    })
    return()=>subscription.unsubscribe()
  },[])

  const fetchAll=useCallback(async()=>{
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
      setOrders(ord||[]); setLicenses(lic||[]); setReviews(rev||[]); setVisitors(vis||[]); setProducts(prod||[])
      const vc={};(pv||[]).forEach(v=>{vc[v.product_id]=(vc[v.product_id]||0)+1}); setViewCounts(vc)
      const memberMap={}
      ;(lic||[]).forEach(l=>{
        if(!l.master_hwid) return
        if(!memberMap[l.master_hwid]){
          const o=(ord||[]).find(o=>o.master_hwid===l.master_hwid)
          memberMap[l.master_hwid]={hwid:l.master_hwid,name:o?.customer_name||'Guest',email:o?.customer_email||'-',wa:o?.customer_wa||'-',tier:l.tier||'7D',status:l.status||'PENDING',createdAt:l.created_at,totalSpend:(ord||[]).filter(o=>o.master_hwid===l.master_hwid).reduce((s,o)=>s+(o.total_price||0),0)}
        }
      })
      setMembers(Object.values(memberMap))
      const totalRev=(ord||[]).reduce((s,o)=>s+(o.total_price||0),0)
      const since5m=new Date(Date.now()-5*60*1000).toISOString()
      const activeV=(vis||[]).filter(v=>v.last_seen>=since5m).length
      const days14=Array.from({length:14},(_,i)=>{const d=new Date();d.setDate(d.getDate()-13+i);return{label:fmtDateShort(d.toISOString()),date:d.toISOString().split('T')[0],value:0}})
      ;(ord||[]).forEach(o=>{const day=o.created_at?.split('T')[0];const found=days14.find(d=>d.date===day);if(found)found.value+=o.total_price||0})
      const vdays14=Array.from({length:14},(_,i)=>{const d=new Date();d.setDate(d.getDate()-13+i);return{label:fmtDateShort(d.toISOString()),date:d.toISOString().split('T')[0],value:0}})
      ;(vis||[]).forEach(v=>{const day=v.created_at?.split('T')[0]||v.last_seen?.split('T')[0];const found=vdays14.find(d=>d.date===day);if(found)found.value++})
      const tierCounts={'1H':0,'7D':0,'14D':0,'30D':0};(lic||[]).forEach(l=>{if(tierCounts[l.tier]!==undefined)tierCounts[l.tier]++})
      const convRate=vis?.length>0?((ord||[]).length/vis.length*100):0
      setStats({totalRevenue:totalRev,totalOrders:(ord||[]).length,activeVisitors:activeV,totalReviews:(rev||[]).length,totalMembers:Object.keys(memberMap).length,revenueByDay:days14,visitorsByDay:vdays14,ordersByTier:tierCounts,convRate:Math.min(convRate,100).toFixed(1),avgOrder:(ord||[]).length>0?(totalRev/(ord||[]).length):0})
    }catch(e){console.error(e)}
    setIsRefreshing(false)
  },[supabase])

  useEffect(()=>{ if(authUser&&supabase) fetchAll() },[authUser,supabase,fetchAll])

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

  const handleLogin=async()=>{ if(!supabase) return; await supabase.auth.signInWithOAuth({provider:'google',options:{redirectTo:window.location.origin+'/admin'}}) }
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

  /* GLASS STYLE HELPERS */
  const S = {
    th:{padding:'10px 12px',textAlign:'left',fontSize:10,fontWeight:900,color:'rgba(255,255,255,.5)',textTransform:'uppercase',letterSpacing:1,whiteSpace:'nowrap',borderBottom:'1px solid rgba(255,255,255,.08)',background:'rgba(255,255,255,.04)'},
    td:{padding:'10px 12px',borderBottom:'1px solid rgba(255,255,255,.05)',fontSize:12,color:'rgba(255,255,255,.85)'},
    badge:(c,bg,border)=>({color:c,background:bg,border:`1px solid ${border}`,borderRadius:99,padding:'2px 8px',fontSize:9,fontWeight:900,textTransform:'uppercase',display:'inline-block'}),
    glassCard:(accent='rgba(255,255,255,.1)')=>({...glass(accent),padding:16}),
  }

  /* ── LOADING ── */
  if(loading) return(
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#000008,#050010,#080018)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden'}}>
      <GalaxyBg/>
      <ShootingStars/>
      <div style={{position:'relative',zIndex:10,textAlign:'center',...glass('rgba(59,130,246,.3)'),padding:48,borderRadius:24}}>
        <div style={{fontSize:48,marginBottom:16,animation:'adminPulse 1s ease infinite'}}>🌌</div>
        <p style={{color:'#93c5fd',fontFamily:'monospace',fontWeight:900,fontSize:14,letterSpacing:2}}>LOADING ADMIN PANEL...</p>
      </div>
    </div>
  )

  /* ── LOGIN ── */
  if(!authUser) return(
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#000008,#050010,#080018)',display:'flex',alignItems:'center',justifyContent:'center',padding:24,position:'relative',overflow:'hidden'}}>
      <GalaxyBg/>
      <ShootingStars/>
      <div style={{position:'relative',zIndex:10,maxWidth:420,width:'100%',...glass('rgba(59,130,246,.3)'),padding:48,textAlign:'center',borderRadius:28}}>
        {/* Galaxy glow behind logo */}
        <div style={{position:'absolute',top:-40,left:'50%',transform:'translateX(-50%)',width:160,height:160,borderRadius:'50%',background:'radial-gradient(ellipse,rgba(59,130,246,.2) 0%,transparent 70%)',pointerEvents:'none'}}/>
        <div style={{position:'relative',width:80,height:80,borderRadius:20,...glass('rgba(59,130,246,.4)'),display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',margin:'0 auto 24px',boxShadow:'0 0 30px rgba(37,99,235,.4)'}}>
          <span style={{fontWeight:900,fontSize:16,color:'white',letterSpacing:-.5}}>VinzSky</span>
          <span style={{fontSize:7,fontWeight:900,color:'#93c5fd',letterSpacing:2,marginTop:2}}>ADMIN</span>
        </div>
        <h1 style={{color:'white',fontWeight:900,fontSize:24,margin:'0 0 6px',textShadow:'0 0 20px rgba(147,197,253,.5)'}}>Admin Portal</h1>
        <p style={{color:'rgba(255,255,255,.4)',fontSize:12,margin:'0 0 8px',fontWeight:700}}>VinzSky-shopID</p>
        <div style={{display:'flex',justifyContent:'center',gap:14,margin:'20px 0 28px'}}>
          {Object.entries(TIERS).map(([k,t])=>(
            <div key={k} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,...glass(t.border),padding:'8px 10px',borderRadius:12,animation:'adminPulse 2s ease infinite'}}>
              <Diamond color={t.color} glow={t.glow} size={18}/>
              <span style={{fontSize:7,fontWeight:900,color:t.color,textTransform:'uppercase',letterSpacing:1}}>{t.name}</span>
            </div>
          ))}
        </div>
        <button onClick={handleLogin} className="admin-hover" style={{width:'100%',padding:16,borderRadius:16,...glass('rgba(59,130,246,.4)'),color:'white',fontWeight:900,fontSize:14,cursor:'pointer',border:'1px solid rgba(59,130,246,.5)',boxShadow:'0 0 25px rgba(37,99,235,.35)',transition:'all .3s'}}>
          🔑 Login dengan Google
        </button>
        <p style={{color:'rgba(255,255,255,.15)',fontSize:10,marginTop:20}}>Hanya email admin yang dapat mengakses</p>
      </div>
    </div>
  )

  const tabs=[
    {id:'dashboard',label:'🏠 Dashboard'},
    {id:'members',  label:`💎 Members (${members.length})`},
    {id:'orders',   label:`📋 Orders (${orders.length})`},
    {id:'licenses', label:`🔑 Lisensi (${licenses.length})`},
    {id:'reviews',  label:`⭐ Reviews (${reviews.length})`},
    {id:'visitors', label:'👁 Visitors'},
    {id:'products', label:'📦 Produk'},
  ]

  /* ── MAIN PANEL ── */
  return(
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#000008 0%,#050010 35%,#080018 65%,#030010 100%)',color:'white',fontFamily:'system-ui',position:'relative',overflow:'hidden'}}>
      <GalaxyBg/>
      <ShootingStars/>
      {/* Nebula layers */}
      {[
        {w:800,h:800,bg:'radial-gradient(ellipse,rgba(100,0,60,.1) 0%,rgba(60,0,80,.05) 40%,transparent 70%)',top:-200,left:-200},
        {w:600,h:600,bg:'radial-gradient(ellipse,rgba(0,20,110,.1) 0%,rgba(0,50,100,.05) 40%,transparent 70%)',bottom:-150,right:-150},
        {w:450,h:450,bg:'radial-gradient(ellipse,rgba(60,0,100,.08) 0%,transparent 70%)',top:'40%',left:'30%'},
      ].map((n,i)=>(
        <div key={i} style={{position:'fixed',zIndex:0,pointerEvents:'none',borderRadius:'50%',
          width:n.w,height:n.h,background:n.bg,top:n.top,left:n.left,right:n.right,bottom:n.bottom,
          animation:`adminPulse ${20+i*8}s ease-in-out ${i*4}s infinite`}}/>
      ))}

      {/* ── HEADER ── */}
      <div style={{position:'sticky',top:0,zIndex:50,padding:'10px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',...glass('rgba(255,255,255,.1)'),borderRadius:0,borderLeft:'none',borderRight:'none',borderTop:'none'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:40,height:40,borderRadius:12,...glass('rgba(59,130,246,.4)'),display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',boxShadow:'0 0 15px rgba(37,99,235,.4)'}}>
            <span style={{fontWeight:900,fontSize:9,color:'white',letterSpacing:-.3,lineHeight:1.2}}>VinzSky</span>
            <span style={{fontSize:5,fontWeight:900,color:'#93c5fd',letterSpacing:1}}>ADMIN</span>
          </div>
          <div>
            <p style={{fontWeight:900,fontSize:14,margin:0,textShadow:'0 0 10px rgba(147,197,253,.5)'}}>Admin Portal</p>
            <p style={{fontSize:9,color:'rgba(255,255,255,.35)',margin:0}}>VinzSky-shopID • {authUser.email}</p>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <button onClick={fetchAll} disabled={isRefreshing} className="admin-hover" style={{padding:'6px 14px',borderRadius:10,...glass('rgba(59,130,246,.3)'),color:'#93c5fd',fontSize:10,fontWeight:900,cursor:'pointer',border:'1px solid rgba(59,130,246,.3)',transition:'all .3s'}}>
            {isRefreshing?'⏳':'🔄'} Refresh
          </button>
          <button onClick={exportCSV} className="admin-hover" style={{padding:'6px 14px',borderRadius:10,...glass('rgba(34,197,94,.3)'),color:'#4ade80',fontSize:10,fontWeight:900,cursor:'pointer',border:'1px solid rgba(34,197,94,.3)',transition:'all .3s'}}>📥 CSV</button>
          <button onClick={handleLogout} className="admin-hover" style={{padding:'6px 14px',borderRadius:10,...glass('rgba(239,68,68,.3)'),color:'#f87171',fontSize:10,fontWeight:900,cursor:'pointer',border:'1px solid rgba(239,68,68,.3)',transition:'all .3s'}}>🚪 Keluar</button>
        </div>
      </div>

      <div style={{position:'relative',zIndex:10,maxWidth:1300,margin:'0 auto',padding:'20px 16px'}}>
        {/* ── TABS ── */}
        <div style={{display:'flex',gap:6,marginBottom:24,overflowX:'auto',paddingBottom:4}}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setActiveTab(t.id)} className={`admin-tab ${activeTab===t.id?'admin-tab-active':''}`}
              style={{padding:'9px 16px',borderRadius:12,fontSize:11,fontWeight:900,whiteSpace:'nowrap',cursor:'pointer',flexShrink:0,...glass(activeTab===t.id?'rgba(59,130,246,.5)':'rgba(255,255,255,.08)'),color:activeTab===t.id?'#93c5fd':'rgba(255,255,255,.45)',transition:'all .3s'}}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ══════════ DASHBOARD ══════════ */}
        {activeTab==='dashboard'&&(
          <div>
            {/* Stat cards */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(155px,1fr))',gap:14,marginBottom:24}}>
              {[
                {label:'Total Pemasukan', value:`Rp ${fmt(stats.totalRevenue)}`, color:'#4ade80',  accent:'rgba(34,197,94,.25)',  spark:[100,120,90,140,110,160,130].map((v,i)=>stats.revenueByDay.slice(-7)[i]?.value||v)},
                {label:'Total Orders',    value:stats.totalOrders,               color:'#93c5fd',  accent:'rgba(59,130,246,.25)', spark:[3,5,4,7,6,8,9]},
                {label:'Online Sekarang', value:stats.activeVisitors,            color:'#4ade80',  accent:'rgba(34,197,94,.2)',  spark:[10,15,12,18,14,20,16]},
                {label:'Total Reviews',   value:stats.totalReviews,              color:'#fbbf24',  accent:'rgba(251,191,36,.25)',spark:[2,4,3,5,4,6,5]},
                {label:'Total Members',   value:stats.totalMembers,              color:'#f472b6',  accent:'rgba(244,114,182,.25)',spark:[1,3,2,4,3,5,4]},
                {label:'Avg Order',       value:`Rp ${fmt(Math.round(stats.avgOrder))}`, color:'#c4b5fd', accent:'rgba(168,85,247,.25)',spark:[50,60,55,70,65,80,75]},
              ].map((c,i)=>(
                <div key={i} className="admin-hover" style={{...S.glassCard(c.accent),transition:'all .3s'}}>
                  <p style={{fontSize:9,color:'rgba(255,255,255,.45)',fontWeight:700,textTransform:'uppercase',letterSpacing:1,margin:'0 0 8px'}}>{c.label}</p>
                  <p style={{fontWeight:900,fontSize:typeof c.value==='string'&&c.value.length>12?13:18,color:c.color,margin:'0 0 8px',textShadow:`0 0 10px ${c.color}60`}}>{c.value}</p>
                  <Sparkline data={c.spark} color={c.color} width={100} height={28}/>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}>
              <div style={{...S.glassCard('rgba(34,197,94,.2)'),padding:20}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                  <div><p style={{fontWeight:900,fontSize:13,margin:'0 0 2px',textShadow:'0 0 8px rgba(74,222,128,.4)'}}>💰 Revenue Harian</p><p style={{fontSize:10,color:'rgba(255,255,255,.3)',margin:0}}>14 hari terakhir</p></div>
                  <div style={{...glass('rgba(34,197,94,.3)'),padding:'4px 10px',borderRadius:8}}><span style={{fontSize:11,fontWeight:900,color:'#4ade80'}}>Rp {fmt(stats.totalRevenue)}</span></div>
                </div>
                <MiniBarChart data={stats.revenueByDay} color="#4ade80" height={90}/>
              </div>
              <div style={{...S.glassCard('rgba(59,130,246,.2)'),padding:20}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                  <div><p style={{fontWeight:900,fontSize:13,margin:'0 0 2px',textShadow:'0 0 8px rgba(147,197,253,.4)'}}>👥 Visitor Harian</p><p style={{fontSize:10,color:'rgba(255,255,255,.3)',margin:0}}>14 hari terakhir</p></div>
                  <div style={{...glass('rgba(59,130,246,.3)'),padding:'4px 10px',borderRadius:8}}><span style={{fontSize:11,fontWeight:900,color:'#93c5fd'}}>{visitors.length} total</span></div>
                </div>
                <MiniBarChart data={stats.visitorsByDay} color="#60a5fa" height={90}/>
              </div>
            </div>

            {/* Tier donut + recent orders */}
            <div style={{display:'grid',gridTemplateColumns:'300px 1fr',gap:16,marginBottom:20}}>
              <div style={{...S.glassCard('rgba(168,85,247,.2)'),padding:20}}>
                <p style={{fontWeight:900,fontSize:13,margin:'0 0 16px',textShadow:'0 0 8px rgba(196,181,253,.4)'}}>💎 Distribusi Tier</p>
                <div style={{display:'flex',alignItems:'center',gap:16}}>
                  <DonutChart size={100} thickness={18} segments={[
                    {value:stats.ordersByTier['1H']||0,  color:TIERS['1H'].color},
                    {value:stats.ordersByTier['7D']||0,  color:TIERS['7D'].color},
                    {value:stats.ordersByTier['14D']||0, color:TIERS['14D'].color},
                    {value:stats.ordersByTier['30D']||0, color:TIERS['30D'].color},
                  ]}/>
                  <div style={{flex:1}}>
                    {Object.entries(TIERS).map(([k,t])=>{
                      const cnt=stats.ordersByTier[k]||0
                      const total=Object.values(stats.ordersByTier).reduce((a,b)=>a+b,0)||1
                      const pct=((cnt/total)*100).toFixed(0)
                      return(
                        <div key={k} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                          <Diamond color={t.color} glow={t.glow} size={12}/>
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
              <div style={{...glass('rgba(255,255,255,.08)'),padding:0,overflow:'hidden',borderRadius:16}}>
                <div style={{padding:'14px 18px',borderBottom:'1px solid rgba(255,255,255,.08)',...glass('rgba(255,255,255,.05)'),borderRadius:0}}><span style={{fontWeight:900,fontSize:13,textShadow:'0 0 8px rgba(255,255,255,.3)'}}>📋 5 Order Terbaru</span></div>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr>{['Nama','Produk','Tier','Total','Tgl'].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {orders.slice(0,5).map((o,i)=>{
                      const tier=getTier(o.items?.[0]?.durationCode||'7D')
                      return(
                        <tr key={i} className="admin-hover" style={{transition:'background .2s'}}>
                          <td style={S.td}><p style={{fontWeight:700,fontSize:12,margin:0}}>{o.customer_name||'Guest'}</p><p style={{fontSize:9,color:'rgba(255,255,255,.3)',margin:0}}>{o.customer_email}</p></td>
                          <td style={S.td}><span style={{fontSize:11,color:'#93c5fd'}}>{o.items?.[0]?.name||'-'}</span></td>
                          <td style={S.td}><div style={{display:'flex',alignItems:'center',gap:4,...glass(tier.border),padding:'3px 7px',borderRadius:8,width:'fit-content'}}><Diamond color={tier.color} glow={tier.glow} size={10}/><span style={{fontSize:9,color:tier.color,fontWeight:900}}>{tier.name}</span></div></td>
                          <td style={S.td}><span style={{fontWeight:900,color:'#4ade80',fontSize:12,textShadow:'0 0 8px rgba(74,222,128,.4)'}}>Rp {fmt(o.total_price)}</span></td>
                          <td style={S.td}><span style={{fontSize:9,color:'rgba(255,255,255,.35)'}}>{fmtDate(o.created_at)}</span></td>
                        </tr>
                      )
                    })}
                    {orders.length===0&&<tr><td colSpan={5} style={{...S.td,textAlign:'center',color:'rgba(255,255,255,.2)',padding:32}}>Belum ada order</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Traffic metrics */}
            <div style={{...S.glassCard('rgba(255,255,255,.08)'),padding:20}}>
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
                    <div key={i} className="admin-hover" style={{...glass(`${m.color}30`),padding:14,borderRadius:14,transition:'all .3s'}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                        <span style={{fontSize:10,color:'rgba(255,255,255,.5)',fontWeight:700}}>{m.label}</span>
                        <span style={{fontSize:14,fontWeight:900,color:m.color,textShadow:`0 0 10px ${m.color}60`}}>{m.value.toFixed(1)}{m.suffix||'%'}</span>
                      </div>
                      <div style={{position:'relative',width:56,height:56,margin:'0 auto'}}>
                        <svg width="56" height="56" viewBox="0 0 56 56">
                          <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="6"/>
                          <circle cx="28" cy="28" r="22" fill="none" stroke={m.color} strokeWidth="6"
                            strokeDasharray={`${(pct/100)*138.2} 138.2`} strokeDashoffset="0"
                            transform="rotate(-90 28 28)" style={{filter:`drop-shadow(0 0 5px ${m.color}80)`,transition:'stroke-dasharray .8s ease'}}/>
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

        {/* ══════════ MEMBERS ══════════ */}
        {activeTab==='members'&&(
          <div>
            <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap'}}>
              <div style={{flex:1,minWidth:200,display:'flex',alignItems:'center',gap:8,...glass('rgba(255,255,255,.1)'),borderRadius:12,padding:'8px 14px'}}>
                <span style={{color:'rgba(255,255,255,.4)',fontSize:14}}>🔍</span>
                <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Cari nama, email..." style={{background:'transparent',border:'none',outline:'none',color:'white',fontSize:12,width:'100%'}}/>
              </div>
              <div style={{display:'flex',gap:8}}>
                {Object.entries(TIERS).map(([k,t])=>(
                  <div key={k} style={{display:'flex',alignItems:'center',gap:4,padding:'6px 10px',borderRadius:10,...glass(t.border)}}>
                    <Diamond color={t.color} glow={t.glow} size={12}/>
                    <span style={{fontSize:10,fontWeight:900,color:t.color}}>{stats.ordersByTier[k]||0}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{...glass('rgba(255,255,255,.08)'),borderRadius:16,overflow:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',minWidth:700}}>
                <thead><tr>{['Member','Email / WA','Tier','Status','Total Spend','Bergabung'].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {filteredMembers.map((m,i)=>{
                    const tier=getTier(m.tier)
                    return(
                      <tr key={i} className="admin-hover" style={{background:i%2===0?'transparent':'rgba(255,255,255,.015)',transition:'background .2s'}}>
                        <td style={S.td}><p style={{fontWeight:700,margin:0,fontSize:12}}>{m.name}</p><p style={{fontSize:9,color:'rgba(255,255,255,.25)',margin:0,fontFamily:'monospace'}}>{m.hwid?.substring(0,12)}...</p></td>
                        <td style={S.td}><p style={{fontSize:10,color:'rgba(255,255,255,.5)',margin:0}}>{m.email}</p><p style={{fontSize:10,color:'rgba(255,255,255,.35)',margin:0}}>{m.wa}</p></td>
                        <td style={S.td}><div style={{display:'flex',alignItems:'center',gap:6,padding:'4px 8px',borderRadius:8,width:'fit-content',...glass(tier.border)}}><Diamond color={tier.color} glow={tier.glow} size={12}/><span style={{fontSize:10,fontWeight:900,color:tier.color}}>{tier.name}</span></div></td>
                        <td style={S.td}><span style={S.badge(m.status==='ACTIVE'?'#4ade80':'#fcd34d',m.status==='ACTIVE'?'rgba(34,197,94,.15)':'rgba(234,179,8,.15)',m.status==='ACTIVE'?'rgba(34,197,94,.35)':'rgba(234,179,8,.35)')}>{m.status||'PENDING'}</span></td>
                        <td style={S.td}><span style={{fontWeight:900,color:'#4ade80',fontSize:12,textShadow:'0 0 8px rgba(74,222,128,.4)'}}>Rp {fmt(m.totalSpend)}</span></td>
                        <td style={S.td}><span style={{fontSize:10,color:'rgba(255,255,255,.35)'}}>{fmtDate(m.createdAt)}</span></td>
                      </tr>
                    )
                  })}
                  {filteredMembers.length===0&&<tr><td colSpan={6} style={{...S.td,textAlign:'center',color:'rgba(255,255,255,.2)',padding:40}}>Belum ada member</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════ ORDERS ══════════ */}
        {activeTab==='orders'&&(
          <div>
            <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap'}}>
              <div style={{flex:1,minWidth:200,display:'flex',alignItems:'center',gap:8,...glass('rgba(255,255,255,.1)'),borderRadius:12,padding:'8px 14px'}}>
                <span style={{color:'rgba(255,255,255,.4)'}}>🔍</span>
                <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Cari nama, email, WA..." style={{background:'transparent',border:'none',outline:'none',color:'white',fontSize:12,width:'100%'}}/>
              </div>
              <button onClick={exportCSV} className="admin-hover" style={{padding:'8px 16px',borderRadius:12,...glass('rgba(34,197,94,.25)'),color:'#4ade80',fontSize:11,fontWeight:900,cursor:'pointer',border:'1px solid rgba(34,197,94,.3)',transition:'all .3s'}}>📥 Export CSV</button>
            </div>
            <div style={{...glass('rgba(255,255,255,.08)'),borderRadius:16,overflow:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',minWidth:700}}>
                <thead><tr>{['Nama','Kontak','Produk','Tier','Status','Total','Tanggal','Aksi'].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {filteredOrders.map((o,i)=>{
                    const tier=getTier(o.items?.[0]?.durationCode||'7D')
                    return(
                      <tr key={i} className="admin-hover" style={{transition:'background .2s'}}>
                        <td style={S.td}><p style={{fontWeight:700,margin:0,fontSize:12}}>{o.customer_name||'-'}</p><p style={{fontSize:9,color:'rgba(255,255,255,.25)',margin:0,fontFamily:'monospace'}}>{o.master_hwid}</p></td>
                        <td style={S.td}><p style={{fontSize:10,color:'rgba(255,255,255,.5)',margin:0}}>{o.customer_wa||'-'}</p><p style={{fontSize:10,color:'rgba(255,255,255,.35)',margin:0}}>{o.customer_email||'-'}</p></td>
                        <td style={S.td}><p style={{fontSize:11,color:'#93c5fd',margin:0}}>{o.items?.[0]?.name||'-'}</p></td>
                        <td style={S.td}><div style={{display:'flex',alignItems:'center',gap:4,...glass(tier.border),padding:'3px 7px',borderRadius:8,width:'fit-content'}}><Diamond color={tier.color} glow={tier.glow} size={10}/><span style={{fontSize:10,color:tier.color,fontWeight:900}}>{tier.name}</span></div></td>
                        <td style={S.td}>{(()=>{
                          const st=o.order_status||o.status||'PENDING'
                          const isS=st==='SUCCESS'||st.includes('LUNAS')
                          const isP=st.includes('PROGRESS')
                          const isC=st.includes('CANCEL')||st.includes('GAGAL')
                          const c=isS?'#4ade80':isP?'#60a5fa':isC?'#f87171':'#9ca3af'
                          const bg=isS?'rgba(34,197,94,.12)':isP?'rgba(59,130,246,.12)':isC?'rgba(239,68,68,.12)':'rgba(255,255,255,.05)'
                          const br=isS?'rgba(34,197,94,.35)':isP?'rgba(59,130,246,.35)':isC?'rgba(239,68,68,.35)':'rgba(255,255,255,.12)'
                          const lbl=isS?'✅ BERHASIL':isP?'🔄 PROSES':isC?'❌ BATAL':'⏳ PENDING'
                          return(
                            <div style={{display:'flex',flexDirection:'column',gap:4}}>
                              <span style={S.badge(c,bg,br)}>{lbl}</span>
                              <div style={{display:'flex',gap:3,flexWrap:'wrap'}}>
                                {['PENDING','PROGRESS','SUCCESS','CANCELLED'].map(s=>(
                                  <button key={s} onClick={async()=>{await supabase.from('orders').update({order_status:s}).eq('id',o.id);fetchAll()}}
                                    style={{padding:'2px 5px',borderRadius:4,fontSize:8,fontWeight:900,cursor:'pointer',...glass((o.order_status||'PENDING')===s?'rgba(255,255,255,.2)':'rgba(255,255,255,.06)'),color:s==='SUCCESS'?'#4ade80':s==='PROGRESS'?'#60a5fa':s==='CANCELLED'?'#f87171':'#9ca3af',border:'1px solid rgba(255,255,255,.08)',transition:'all .2s'}}>
                                    {s==='SUCCESS'?'✅':s==='PROGRESS'?'🔄':s==='CANCELLED'?'❌':'⏳'}{s}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )
                        })()}</td>
                        <td style={S.td}><span style={{fontWeight:900,color:'#4ade80',fontSize:12,textShadow:'0 0 8px rgba(74,222,128,.4)'}}>Rp {fmt(o.total_price)}</span></td>
                        <td style={S.td}><span style={{fontSize:9,color:'rgba(255,255,255,.35)'}}>{fmtDate(o.created_at)}</span></td>
                        <td style={S.td}><button onClick={()=>deleteOrder(o.id)} className="admin-hover" style={{padding:'5px 8px',borderRadius:8,...glass('rgba(239,68,68,.25)'),color:'#f87171',cursor:'pointer',fontSize:10,border:'1px solid rgba(239,68,68,.3)',transition:'all .3s'}}>🗑</button></td>
                      </tr>
                    )
                  })}
                  {filteredOrders.length===0&&<tr><td colSpan={8} style={{...S.td,textAlign:'center',color:'rgba(255,255,255,.2)',padding:40}}>Belum ada order</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════ LICENSES ══════════ */}
        {activeTab==='licenses'&&(
          <div style={{...glass('rgba(255,255,255,.08)'),borderRadius:16,overflow:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',minWidth:600}}>
              <thead><tr>{['License Key','HWID','Tier','Status','Expires','Aksi'].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
              <tbody>
                {licenses.map((l,i)=>{
                  const tier=getTier(l.tier)
                  const isExp=l.expires_at&&new Date(l.expires_at)<new Date()
                  return(
                    <tr key={i} className="admin-hover" style={{transition:'background .2s'}}>
                      <td style={S.td}><code style={{fontSize:10,color:'#fcd34d',fontFamily:'monospace',textShadow:'0 0 6px rgba(252,211,77,.4)'}}>{l.license_key}</code></td>
                      <td style={S.td}><code style={{fontSize:9,color:'rgba(255,255,255,.4)',fontFamily:'monospace'}}>{(l.master_hwid||'').substring(0,16)}</code></td>
                      <td style={S.td}><div style={{display:'flex',alignItems:'center',gap:5,...glass(tier.border),padding:'3px 8px',borderRadius:8,width:'fit-content'}}><Diamond color={tier.color} glow={tier.glow} size={12}/><span style={{fontSize:10,fontWeight:900,color:tier.color}}>{tier.name}</span></div></td>
                      <td style={S.td}><span style={S.badge(l.status==='ACTIVE'?'#4ade80':isExp?'#f87171':'#fcd34d',l.status==='ACTIVE'?'rgba(34,197,94,.12)':isExp?'rgba(239,68,68,.12)':'rgba(252,211,77,.12)',l.status==='ACTIVE'?'rgba(34,197,94,.35)':isExp?'rgba(239,68,68,.35)':'rgba(252,211,77,.35)')}>{isExp?'EXPIRED':l.status}</span></td>
                      <td style={S.td}><span style={{fontSize:10,color:isExp?'#f87171':'rgba(255,255,255,.4)'}}>{fmtDate(l.expires_at)}</span></td>
                      <td style={S.td}>
                        <div style={{display:'flex',gap:4}}>
                          {['ACTIVE','PENDING','EXPIRED'].map(s=>(
                            <button key={s} onClick={()=>updateLicense(l.id,s)} className="admin-hover"
                              style={{padding:'3px 7px',borderRadius:6,fontSize:8,fontWeight:900,cursor:'pointer',...glass(l.status===s?'rgba(255,255,255,.2)':'rgba(255,255,255,.06)'),color:s==='ACTIVE'?'#4ade80':s==='EXPIRED'?'#f87171':'#fcd34d',border:`1px solid ${s==='ACTIVE'?'rgba(34,197,94,.3)':s==='EXPIRED'?'rgba(239,68,68,.3)':'rgba(252,211,77,.3)'}`,transition:'all .2s'}}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {licenses.length===0&&<tr><td colSpan={6} style={{...S.td,textAlign:'center',color:'rgba(255,255,255,.2)',padding:40}}>Belum ada lisensi</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* ══════════ REVIEWS ══════════ */}
        {activeTab==='reviews'&&(
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:14}}>
            {reviews.map((r,i)=>(
              <div key={i} className="admin-hover" style={{...S.glassCard('rgba(255,255,255,.1)'),transition:'all .3s'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    {r.buyer_avatar
                      ?<img src={r.buyer_avatar} style={{width:38,height:38,borderRadius:'50%',objectFit:'cover',flexShrink:0,border:'2px solid rgba(59,130,246,.5)',boxShadow:'0 0 10px rgba(59,130,246,.4)'}}/>
                      :<div style={{width:38,height:38,borderRadius:'50%',...glass('rgba(59,130,246,.4)'),display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:900,flexShrink:0}}>{(r.name||'G')[0].toUpperCase()}</div>
                    }
                    <div>
                      <p style={{fontWeight:900,fontSize:13,margin:0}}>{r.name||'Guest'}</p>
                      <div style={{display:'flex',alignItems:'center',gap:6,marginTop:3}}>
                        {(()=>{const t=getTier(r.tier_code||'7D');return(
                          <div style={{display:'flex',alignItems:'center',gap:3,padding:'1px 6px',borderRadius:8,...glass(t.border)}}>
                            <Diamond color={t.color} glow={t.glow} size={9}/>
                            <span style={{fontSize:8,fontWeight:900,color:t.color,textTransform:'uppercase'}}>{t.name}</span>
                          </div>
                        )})()}
                        <span style={{fontSize:10,color:'#93c5fd'}}>{r.product||'Produk'}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    <span style={{color:'#eab308',textShadow:'0 0 6px rgba(234,179,8,.6)'}}>{'★'.repeat(r.rating||5)}</span>
                    <button onClick={()=>deleteReview(r.id)} className="admin-hover" style={{padding:'4px 6px',borderRadius:6,...glass('rgba(239,68,68,.2)'),color:'#f87171',cursor:'pointer',fontSize:10,border:'1px solid rgba(239,68,68,.25)',transition:'all .3s'}}>✕</button>
                  </div>
                </div>
                <p style={{fontSize:12,color:'rgba(255,255,255,.7)',fontStyle:'italic',margin:0,lineHeight:1.7}}>"{r.review_text||r.text||'...'}"</p>
                <p style={{fontSize:9,color:'rgba(255,255,255,.25)',margin:'10px 0 0'}}>{fmtDate(r.created_at)}</p>
              </div>
            ))}
            {reviews.length===0&&<div style={{gridColumn:'1/-1',textAlign:'center',padding:60,color:'rgba(255,255,255,.2)'}}>Belum ada review</div>}
          </div>
        )}

        {/* ══════════ VISITORS ══════════ */}
        {activeTab==='visitors'&&(
          <div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:18}}>
              {[
                {label:'Online (5 menit)',   value:stats.activeVisitors, color:'#4ade80', accent:'rgba(34,197,94,.2)'},
                {label:'Total Visitor',      value:visitors.length,      color:'#93c5fd', accent:'rgba(59,130,246,.2)'},
                {label:'Total Product Views',value:Object.values(viewCounts).reduce((a,b)=>a+b,0), color:'#fdba74', accent:'rgba(249,115,22,.2)'},
              ].map((s,i)=>(
                <div key={i} className="admin-hover" style={{...S.glassCard(s.accent),textAlign:'center',transition:'all .3s'}}>
                  <p style={{color:s.color,fontWeight:900,fontSize:26,margin:'0 0 4px',textShadow:`0 0 12px ${s.color}60`}}>{s.value}</p>
                  <p style={{color:'rgba(255,255,255,.4)',fontSize:10,fontWeight:700,margin:0}}>{s.label}</p>
                </div>
              ))}
            </div>
            <div style={{...S.glassCard('rgba(59,130,246,.15)'),padding:20,marginBottom:16}}>
              <p style={{fontWeight:900,fontSize:13,margin:'0 0 16px'}}>📊 Visitor 14 Hari Terakhir</p>
              <MiniBarChart data={stats.visitorsByDay} color="#60a5fa" height={100}/>
            </div>
            <div style={{...glass('rgba(255,255,255,.08)'),borderRadius:16,overflow:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',minWidth:500}}>
                <thead><tr>{['Visitor ID','Device','Last Seen','Status'].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {visitors.slice(0,50).map((v,i)=>{
                    const isActive=new Date(v.last_seen)>new Date(Date.now()-5*60*1000)
                    return(
                      <tr key={i} className="admin-hover" style={{transition:'background .2s'}}>
                        <td style={S.td}><code style={{fontSize:9,color:'#fcd34d',fontFamily:'monospace'}}>{(v.visitor_id||'').substring(0,20)}...</code></td>
                        <td style={S.td}><p style={{fontSize:9,color:'rgba(255,255,255,.35)',margin:0,maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{(v.user_agent||'').substring(0,50)}</p></td>
                        <td style={S.td}><span style={{fontSize:10,color:'rgba(255,255,255,.4)'}}>{fmtDate(v.last_seen)}</span></td>
                        <td style={S.td}><span style={S.badge(isActive?'#4ade80':'rgba(255,255,255,.25)',isActive?'rgba(34,197,94,.12)':'rgba(255,255,255,.04)',isActive?'rgba(34,197,94,.35)':'rgba(255,255,255,.1)')}>{isActive?'🟢 Online':'Offline'}</span></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════ PRODUCTS ══════════ */}
        {activeTab==='products'&&(
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14}}>
            {products.map((p,i)=>(
              <div key={i} className="admin-hover" style={{...S.glassCard('rgba(255,255,255,.1)'),transition:'all .3s'}}>
                <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>
                  <img src={p.image||'/produk1.jpg'} onError={e=>{e.target.src='/produk1.jpg'}} style={{width:58,height:58,borderRadius:12,objectFit:'cover',flexShrink:0,border:'1px solid rgba(255,255,255,.12)',boxShadow:'0 0 10px rgba(0,0,0,.4)'}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{fontWeight:900,fontSize:13,margin:'0 0 2px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.name}</p>
                    <p style={{fontSize:10,color:'#93c5fd',margin:'0 0 6px'}}>{p.category}</p>
                    <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                      <span style={{fontSize:12,fontWeight:900,color:'#4ade80',textShadow:'0 0 8px rgba(74,222,128,.4)'}}>Rp {(p.price||0).toLocaleString()}</span>
                      {p.isflashsale&&<span style={S.badge('#f87171','rgba(239,68,68,.12)','rgba(239,68,68,.3)')}>⚡ Flash</span>}
                      {p.discount_aktif&&<span style={S.badge('#c4b5fd','rgba(168,85,247,.12)','rgba(168,85,247,.3)')}>-{p.discount_persen}%</span>}
                    </div>
                    <div style={{display:'flex',gap:8,marginTop:6,flexWrap:'wrap'}}>
                      <span style={{fontSize:9,color:'rgba(255,255,255,.4)'}}>👁 {viewCounts[p.id]||0} views</span>
                      <span style={{fontSize:9,color:'rgba(255,255,255,.4)'}}>📦 {p.stock||99}</span>
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