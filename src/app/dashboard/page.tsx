"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, CheckCircle, Clock, ShieldX, TrendingUp, ChevronRight, AlertCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, LineChart, Line, Legend } from "recharts";
import Link from "next/link";
import clsx from "clsx";

const INSURERS = ["All", "HealthCare Plus", "LifeShield", "SecureMed"];
const PERIODS = ["7D", "30D", "12M"];

// --- Mock Data Generators ---
const sparklineData = Array.from({ length: 10 }, () => ({ val: Math.random() * 100 }));

const getMockData = (period: string, insurer: string) => {
  const multiplier = period === "7D" ? 0.25 : period === "12M" ? 12 : 1;
  const isAll = insurer === "All";

  return {
    risk: 1450000 * multiplier * (isAll ? 1 : 0.4),
    recovered: 420000 * multiplier * (isAll ? 1 : 0.4),
    checked: 1248 * multiplier * (isAll ? 1 : 0.4),
    rate: isAll ? 12.4 : 10 + Math.random() * 5,
    riskDelta: 5.2,
    recoveredDelta: 12.5,
    checkedDelta: 8.1,
    rateDelta: -2.1,
  };
};

const getChartData = (period: string) => {
  const m = period === "7D" ? 0.25 : period === "12M" ? 12 : 1;
  return [
    { name: "Code Conflict", "HealthCare Plus": 45*m, "LifeShield": 30*m, "SecureMed": 70*m, "HealthCare Plus_val": 45000*m, "LifeShield_val": 30000*m, "SecureMed_val": 70000*m },
    { name: "Missing Info", "HealthCare Plus": 50*m, "LifeShield": 40*m, "SecureMed": 30*m, "HealthCare Plus_val": 50000*m, "LifeShield_val": 40000*m, "SecureMed_val": 30000*m },
    { name: "Date Error", "HealthCare Plus": 20*m, "LifeShield": 35*m, "SecureMed": 30*m, "HealthCare Plus_val": 20000*m, "LifeShield_val": 35000*m, "SecureMed_val": 30000*m },
    { name: "Policy Viol.", "HealthCare Plus": 10*m, "LifeShield": 15*m, "SecureMed": 15*m, "HealthCare Plus_val": 10000*m, "LifeShield_val": 15000*m, "SecureMed_val": 15000*m },
  ];
};

const getTrendData = (period: string) => {
  const points = period === "7D" ? 7 : period === "30D" ? 6 : 12; // 6 points for 30D as weeks, etc.
  const labels = period === "7D" ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] : period === "30D" ? ["W1", "W2", "W3", "W4", "W5", "W6"] : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return labels.map((l, i) => {
    const risk = 100000 + Math.random() * 50000;
    return {
      label: l,
      risk: risk,
      recovered: risk * (0.2 + Math.random() * 0.2), // Recovered is <= Risk
    };
  });
};

const tableData = [
  { id: "CLM-84920", insurer: "HealthCare Plus", riskScore: 85, amount: 420000 },
  { id: "CLM-99123", insurer: "LifeShield", riskScore: 45, amount: 150000 },
  { id: "CLM-77341", insurer: "SecureMed", riskScore: 92, amount: 850000 },
  { id: "CLM-11234", insurer: "HealthCare Plus", riskScore: 60, amount: 55000 },
  { id: "CLM-55992", insurer: "SecureMed", riskScore: 25, amount: 12000 },
];

function CountUp({ to, prefix = "", suffix = "", decimals = 0 }: { to: number, prefix?: string, suffix?: string, decimals?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const interval = 30;
    const steps = duration / interval;
    const step = to / steps;
    
    const timer = setInterval(() => {
      start += 1;
      if (start <= steps) {
        setVal(step * start);
      } else {
        setVal(to);
        clearInterval(timer);
      }
    }, interval);
    return () => clearInterval(timer);
  }, [to]);
  
  return <span>{prefix}{val.toFixed(decimals)}{suffix}</span>;
}

export default function DashboardPage() {
  const [filterInsurer, setFilterInsurer] = useState("All");
  const [filterPeriod, setFilterPeriod] = useState("30D");
  const [barToggle, setBarToggle] = useState<"Count" | "₹">("Count");
  
  const [roiClaims, setRoiClaims] = useState(50);
  const [roiRate, setRoiRate] = useState(3);

  const stats = getMockData(filterPeriod, filterInsurer);
  const chartData = getChartData(filterPeriod);
  const trendData = getTrendData(filterPeriod);

  const formatLakhs = (val: number) => (val / 100000).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto py-4 space-y-6">
      
      {/* 1. Hero Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl p-8 bg-white/60 dark:bg-[#1A1820]/60 backdrop-blur-xl border border-white/70 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-br from-primary-light/40 to-accent-peach/40 dark:from-primary-dark/30 dark:to-error/20">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-fredoka)] text-primary-dark dark:text-primary-light">
            You've saved ₹<CountUp to={4.2} decimals={1} />L this month 🎉
          </h1>
          <p className="opacity-80 text-lg mb-8 max-w-lg">ClaimGuard caught 14 critical errors before submission, protecting your hospital's bottom line.</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-bold transition-all hover:-translate-y-1 shadow-lg shadow-primary/30">
            Check a claim <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="flex items-center gap-8 relative z-10">
          <div className="relative w-40 h-40 flex items-center justify-center">
             <svg className="w-full h-full transform -rotate-90">
               <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="16" className="opacity-10 text-error" />
               <motion.circle 
                 cx="80" cy="80" r="70" fill="none" stroke="#76E5B1" strokeWidth="16" strokeDasharray="439.8" 
                 initial={{ strokeDashoffset: 439.8 }}
                 animate={{ strokeDashoffset: 439.8 - (439.8 * 0.29) }}
                 transition={{ duration: 2, ease: "easeOut" }}
                 strokeLinecap="round"
               />
             </svg>
             <div className="absolute text-center">
               <div className="text-3xl font-bold font-[family-name:var(--font-fredoka)]">29%</div>
               <div className="text-xs opacity-80 font-medium">Recovered</div>
             </div>
          </div>
          
          <div className="w-32 h-32 relative">
            {/* Inline waving Clay SVG */}
            <motion.svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
              <path fill="#B39DFF" d="M45,-75.6C58.3,-68.5,69,-54.3,77.5,-39.1C85.9,-23.9,92.1,-7.7,89.5,7.4C86.9,22.5,75.4,36.5,63.1,48.2C50.8,59.8,37.6,69.2,22.4,75.7C7.2,82.3,-10.1,86.1,-25.5,81.8C-40.8,77.5,-54.1,65.2,-64.5,51.2C-74.8,37.2,-82.2,21.5,-85.4,4.9C-88.5,-11.6,-87.4,-29,-79.1,-43.2C-70.8,-57.3,-55.4,-68.2,-40.1,-74.6C-24.8,-81,-9.6,-83,6.5,-91.6C22.6,-100.1,45,-115.3,45,-75.6Z" transform="translate(100 100)" />
              <circle cx="70" cy="80" r="10" fill="#2D2A32" />
              <circle cx="130" cy="80" r="10" fill="#2D2A32" />
              <circle cx="67" cy="77" r="3" fill="white" />
              <circle cx="127" cy="77" r="3" fill="white" />
              <path d="M 85 110 Q 100 130 115 110" stroke="#2D2A32" strokeWidth="6" fill="none" strokeLinecap="round" />
              {/* Waving Arm */}
              <motion.path d="M 170 100 Q 190 70 180 50" stroke="#B39DFF" strokeWidth="16" strokeLinecap="round" fill="none" transform-origin="170px 100px" animate={{ rotate: [0, 20, -10, 20, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} />
            </motion.svg>
          </div>
        </div>
      </motion.div>

      {/* 3. Filter Row */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-2">
        <div className="flex flex-wrap items-center gap-2 bg-white/40 dark:bg-black/20 p-1.5 rounded-full backdrop-blur-md border border-white/30 dark:border-white/10">
          {INSURERS.map(ins => (
            <button key={ins} onClick={() => setFilterInsurer(ins)} className={clsx("px-4 py-1.5 rounded-full text-sm font-medium transition-all", filterInsurer === ins ? "bg-white dark:bg-white/20 shadow-sm text-primary-dark dark:text-primary-light" : "hover:bg-white/50 opacity-70")}>
              {ins}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-white/40 dark:bg-black/20 p-1.5 rounded-full backdrop-blur-md border border-white/30 dark:border-white/10">
          {PERIODS.map(p => (
            <button key={p} onClick={() => setFilterPeriod(p)} className={clsx("px-4 py-1.5 rounded-full text-sm font-medium transition-all", filterPeriod === p ? "bg-primary text-white shadow-sm" : "hover:bg-white/50 opacity-70")}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Revenue at Risk", val: stats.risk / 100000, suffix: "L", prefix: "₹", delta: stats.riskDelta, color: "from-error/10 to-transparent", stroke: "#FF8A8A" },
          { label: "Recovered", val: stats.recovered / 100000, suffix: "L", prefix: "₹", delta: stats.recoveredDelta, color: "from-success/10 to-transparent", stroke: "#76E5B1" },
          { label: "Claims Checked", val: stats.checked, suffix: "", prefix: "", delta: stats.checkedDelta, color: "from-primary/10 to-transparent", stroke: "#B39DFF" },
          { label: "Denial Rate", val: stats.rate, suffix: "%", prefix: "", delta: stats.rateDelta, color: "from-accent-peach/10 to-transparent", stroke: "#FFC8A2" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 rounded-3xl p-6 bg-white/60 dark:bg-[#1A1820]/60 backdrop-blur-xl border border-white/70 dark:border-white/10 shadow-sm hover:shadow-lg bg-gradient-to-b ${stat.color}`}>
            <p className="font-medium opacity-80 mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-1 mb-3">
              <h3 className="text-3xl font-bold font-[family-name:var(--font-fredoka)]">
                <CountUp to={stat.val} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.suffix === "L" || stat.suffix === "%" ? 1 : 0} />
              </h3>
            </div>
            
            <div className="flex items-center justify-between">
              <div className={clsx("flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full", stat.delta > 0 && stat.label !== "Denial Rate" && stat.label !== "Revenue at Risk" ? "bg-success/20 text-green-700 dark:text-success" : stat.delta < 0 && stat.label === "Denial Rate" ? "bg-success/20 text-green-700 dark:text-success" : "bg-error/20 text-red-700 dark:text-error")}>
                {stat.delta > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(stat.delta)}%
              </div>
              <div className="w-16 h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData}>
                    <Line type="monotone" dataKey="val" stroke={stat.stroke} strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 4. Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Chart A: Stacked Bar */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="rounded-3xl p-6 bg-white/60 dark:bg-[#1A1820]/60 backdrop-blur-xl border border-white/70 dark:border-white/10 shadow-lg h-96 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold font-[family-name:var(--font-fredoka)] text-lg">Denial Reasons</h3>
            <div className="flex bg-white/50 dark:bg-black/30 rounded-lg p-1 text-xs font-medium">
              <button onClick={() => setBarToggle("Count")} className={clsx("px-3 py-1 rounded-md transition-colors", barToggle === "Count" ? "bg-white dark:bg-white/20 shadow-sm" : "opacity-60")}>Count</button>
              <button onClick={() => setBarToggle("₹")} className={clsx("px-3 py-1 rounded-md transition-colors", barToggle === "₹" ? "bg-white dark:bg-white/20 shadow-sm" : "opacity-60")}>₹ Value</button>
            </div>
          </div>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => barToggle === "₹" ? `₹${(val/1000).toFixed(0)}k` : val} />
                <Tooltip 
                  cursor={{ fill: "var(--border-color)", opacity: 0.2 }} 
                  contentStyle={{ borderRadius: '16px', background: 'var(--card-bg)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} 
                  formatter={(val: number) => barToggle === "₹" ? `₹${val.toLocaleString('en-IN')}` : val}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey={barToggle === "Count" ? "HealthCare Plus" : "HealthCare Plus_val"} name="HealthCare Plus" stackId="a" fill="#B39DFF" radius={[0,0,0,0]} />
                <Bar dataKey={barToggle === "Count" ? "LifeShield" : "LifeShield_val"} name="LifeShield" stackId="a" fill="#A0E8AF" radius={[0,0,0,0]} />
                <Bar dataKey={barToggle === "Count" ? "SecureMed" : "SecureMed_val"} name="SecureMed" stackId="a" fill="#FFC8A2" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Chart B: Area Chart */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="rounded-3xl p-6 bg-white/60 dark:bg-[#1A1820]/60 backdrop-blur-xl border border-white/70 dark:border-white/10 shadow-lg h-96 flex flex-col">
          <h3 className="font-bold font-[family-name:var(--font-fredoka)] text-lg mb-6">Recovered vs At Risk</h3>
          <div className="flex-grow relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF8A8A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FF8A8A" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#76E5B1" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#76E5B1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${(val/1000).toFixed(0)}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', background: 'var(--card-bg)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-color)' }}
                  formatter={(val: number) => `₹${val.toLocaleString('en-IN')}`}
                />
                <Area type="monotone" dataKey="risk" name="At Risk" stroke="#FF8A8A" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" activeDot={{ r: 6, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="recovered" name="Recovered" stroke="#76E5B1" strokeWidth={3} fillOpacity={1} fill="url(#colorRec)" activeDot={{ r: 8, strokeWidth: 0, className: "animate-pulse" }} />
              </AreaChart>
            </ResponsiveContainer>
            {/* Glowing dot on latest point simulation (optional visual flare) */}
            <div className="absolute top-[30%] right-[10%] w-3 h-3 bg-success rounded-full shadow-[0_0_15px_rgba(118,229,177,1)] animate-ping" style={{ pointerEvents: 'none' }} />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 5. Claims at risk Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 rounded-3xl p-6 bg-white/60 dark:bg-[#1A1820]/60 backdrop-blur-xl border border-white/70 dark:border-white/10 shadow-lg">
          <h3 className="font-bold font-[family-name:var(--font-fredoka)] text-lg mb-4">Claims at Risk</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase opacity-60 border-b border-black/10 dark:border-white/10">
                <tr>
                  <th className="px-4 py-3 font-medium">Claim ID</th>
                  <th className="px-4 py-3 font-medium">Insurer</th>
                  <th className="px-4 py-3 font-medium">Risk</th>
                  <th className="px-4 py-3 font-medium">₹ At Risk</th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {tableData.filter(d => filterInsurer === "All" || d.insurer === filterInsurer).map((row, i) => (
                    <motion.tr 
                      key={row.id}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      className="border-b border-black/5 dark:border-white/5 hover:bg-white/40 dark:hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-4 py-4 font-bold">{row.id}</td>
                      <td className="px-4 py-4 opacity-80">{row.insurer}</td>
                      <td className="px-4 py-4">
                        <span className={clsx("px-2.5 py-1 rounded-full text-xs font-bold", row.riskScore > 60 ? "bg-error/20 text-red-700 dark:text-error" : row.riskScore > 30 ? "bg-orange-500/20 text-orange-700 dark:text-orange-400" : "bg-success/20 text-green-700 dark:text-success")}>
                          {row.riskScore > 60 ? "High" : row.riskScore > 30 ? "Med" : "Low"}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-medium">₹{row.amount.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-4 text-right">
                        <Link href="/" className="inline-block px-4 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary-dark dark:text-primary-light font-bold rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                          Fix now
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* 6. ROI Calculator */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-3xl p-6 bg-white/60 dark:bg-[#1A1820]/60 backdrop-blur-xl border border-white/70 dark:border-white/10 shadow-lg bg-gradient-to-t from-primary-light/20 to-transparent flex flex-col justify-between">
          <div>
            <h3 className="font-bold font-[family-name:var(--font-fredoka)] text-lg mb-2 flex items-center gap-2"><TrendingUp className="text-primary" /> ROI Calculator</h3>
            <p className="opacity-70 text-sm mb-6">Estimate your hospital's annual revenue gain.</p>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span>Annual Claims (₹ Cr)</span>
                  <span className="text-primary-dark dark:text-primary-light font-bold">{roiClaims} Cr</span>
                </div>
                <input 
                  type="range" min="10" max="200" value={roiClaims} onChange={e => setRoiClaims(parseInt(e.target.value))}
                  className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span>Recovery Rate (%)</span>
                  <span className="text-success font-bold">{roiRate}%</span>
                </div>
                <input 
                  type="range" min="1" max="10" step="0.5" value={roiRate} onChange={e => setRoiRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-success"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10 text-center">
            <p className="text-sm font-medium mb-1 opacity-80">Estimated Gain</p>
            <h2 className="text-5xl font-bold font-[family-name:var(--font-fredoka)] text-transparent bg-clip-text bg-gradient-to-r from-success to-primary-dark">
              ₹<CountUp to={(roiClaims * (roiRate / 100))} decimals={1} /> Cr<span className="text-xl">/yr</span>
            </h2>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
