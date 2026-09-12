import { useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Database,
  Download,
  FileBarChart,
  Gauge,
  HeartPulse,
  Map,
  MapPin,
  Pill,
  RefreshCw,
  Route,
  Search,
  ShieldCheck,
  Stethoscope,
  TrendingDown,
  TrendingUp,
  Users,
  UserRound,
  XCircle,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export type GovernmentIntelligenceView =
  | 'government-overview'
  | 'healthcare-gap'
  | 'village-heatmap'
  | 'government-early-warning'
  | 'government-facility-intelligence'
  | 'doctor-intelligence'
  | 'government-medicine-intelligence'
  | 'government-healthcare-demand'
  | 'referral-monitoring'
  | 'medical-camp-planner'
  | 'government-data-reliability'
  | 'government-reports'

type Navigate = (view: GovernmentIntelligenceView) => void

const villages = [
  { name: 'Daund', population: 42500, gap: 82, doctors: 6, requiredDoctors: 10, accessibility: 38, risk: 'Critical' },
  { name: 'Nandgaon', population: 31200, gap: 71, doctors: 5, requiredDoctors: 8, accessibility: 44, risk: 'High' },
  { name: 'Baramati Rural', population: 55800, gap: 48, doctors: 14, requiredDoctors: 17, accessibility: 69, risk: 'Medium' },
  { name: 'MIDC Area', population: 28900, gap: 63, doctors: 7, requiredDoctors: 9, accessibility: 52, risk: 'High' },
  { name: 'Village Cluster A', population: 18400, gap: 57, doctors: 4, requiredDoctors: 6, accessibility: 47, risk: 'Medium' },
  { name: 'Village Cluster B', population: 22700, gap: 35, doctors: 6, requiredDoctors: 7, accessibility: 73, risk: 'Low' },
]

const facilities = [
  { name: 'Daund PHC', type: 'PHC', load: 91, doctors: 6, required: 10, beds: 88, medicine: 64, score: 58, status: 'Critical' },
  { name: 'Nandgaon PHC', type: 'PHC', load: 84, doctors: 5, required: 8, beds: 76, medicine: 42, score: 61, status: 'High Risk' },
  { name: 'Baramati Rural Hospital', type: 'Rural Hospital', load: 72, doctors: 14, required: 17, beds: 69, medicine: 81, score: 78, status: 'Stable' },
  { name: 'MIDC Health Centre', type: 'Health Centre', load: 79, doctors: 7, required: 9, beds: 63, medicine: 57, score: 67, status: 'Watch' },
]

const demandTrend = [
  { month: 'Jan', demand: 3400, capacity: 4100 },
  { month: 'Feb', demand: 3900, capacity: 4200 },
  { month: 'Mar', demand: 4300, capacity: 4300 },
  { month: 'Apr', demand: 4700, capacity: 4400 },
  { month: 'May', demand: 5200, capacity: 4600 },
  { month: 'Jun', demand: 5800, capacity: 4800 },
  { month: 'Jul', demand: 6100, capacity: 5000 },
]

const medicineData = [
  { medicine: 'ORS', facility: 'Daund PHC', stock: 1240, daily: 310, days: 4, risk: 'Critical' },
  { medicine: 'Paracetamol', facility: 'Nandgaon PHC', stock: 2100, daily: 350, days: 6, risk: 'High' },
  { medicine: 'Amoxicillin', facility: 'MIDC Health Centre', stock: 1850, daily: 210, days: 9, risk: 'Medium' },
  { medicine: 'Iron Tablets', facility: 'Baramati Rural Hospital', stock: 7200, daily: 410, days: 18, risk: 'Low' },
]

const referrals = [
  { from: 'Daund PHC', to: 'Baramati Rural Hospital', total: 126, pending: 18, delayed: 9, avg: 47 },
  { from: 'Nandgaon PHC', to: 'District Hospital', total: 98, pending: 21, delayed: 13, avg: 64 },
  { from: 'MIDC Health Centre', to: 'Baramati Rural Hospital', total: 74, pending: 7, delayed: 4, avg: 39 },
]

const reliability = [
  { name: 'Facility Data', value: 96 },
  { name: 'Medicine Data', value: 88 },
  { name: 'Doctor Data', value: 93 },
  { name: 'Demand Data', value: 84 },
  { name: 'Village Data', value: 79 },
]

const navItems: { id: GovernmentIntelligenceView; label: string; icon: any }[] = [
  { id: 'government-overview', label: 'Overview', icon: Gauge },
  { id: 'healthcare-gap', label: 'Healthcare Gaps', icon: Activity },
  { id: 'village-heatmap', label: 'Village Heatmap', icon: Map },
  { id: 'government-early-warning', label: 'Early Warning', icon: AlertTriangle },
  { id: 'government-facility-intelligence', label: 'Facilities', icon: Building2 },
  { id: 'doctor-intelligence', label: 'Doctors', icon: Stethoscope },
  { id: 'government-medicine-intelligence', label: 'Medicines', icon: Pill },
  { id: 'government-healthcare-demand', label: 'Demand', icon: BarChart3 },
  { id: 'referral-monitoring', label: 'Referrals', icon: Route },
  { id: 'medical-camp-planner', label: 'Camp Planner', icon: CalendarDays },
  { id: 'government-data-reliability', label: 'Data Reliability', icon: Database },
  { id: 'government-reports', label: 'Reports', icon: FileBarChart },
]

function PageHeader({
  icon: Icon,
  title,
  subtitle,
  badge,
}: {
  icon: any
  title: string
  subtitle: string
  badge?: string
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
          <Icon size={28} />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">{title}</h1>
            {badge && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                {badge}
              </span>
            )}
          </div>
          <p className="mt-1 max-w-3xl text-sm text-slate-500 md:text-base">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}

function GovernmentNav({
  activeView,
  navigate,
}: {
  activeView: GovernmentIntelligenceView
  navigate: Navigate
}) {
  return (
    <div className="mb-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="flex min-w-max gap-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = activeView === item.id
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                active
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-700'
              }`}
            >
              <Icon size={15} />
              {item.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Shell({
  children,
  activeView,
  navigate,
}: {
  children: React.ReactNode
  activeView: GovernmentIntelligenceView
  navigate: Navigate
}) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 lg:px-8">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
          <ShieldCheck size={16} />
          Government Intelligence
        </div>
        <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Live intelligence layer
        </div>
      </div>
      <GovernmentNav activeView={activeView} navigate={navigate} />
      {children}
    </section>
  )
}

function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  trend,
  tone = 'emerald',
}: {
  label: string
  value: string | number
  detail: string
  icon: any
  trend?: 'up' | 'down'
  tone?: 'emerald' | 'amber' | 'red' | 'blue'
}) {
  const tones = {
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
  }
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className={`rounded-xl p-2.5 ${tones[tone]}`}>
          <Icon size={20} />
        </div>
        {trend && (
          <span className={trend === 'up' ? 'text-red-500' : 'text-emerald-600'}>
            {trend === 'up' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
          </span>
        )}
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{detail}</p>
    </div>
  )
}

function SectionCard({
  title,
  subtitle,
  children,
  action,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}

function RiskBadge({ risk }: { risk: string }) {
  const styles: Record<string, string> = {
    Critical: 'bg-red-50 text-red-700',
    'High Risk': 'bg-orange-50 text-orange-700',
    High: 'bg-orange-50 text-orange-700',
    Medium: 'bg-amber-50 text-amber-700',
    Watch: 'bg-amber-50 text-amber-700',
    Low: 'bg-emerald-50 text-emerald-700',
    Stable: 'bg-emerald-50 text-emerald-700',
  }
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[risk] || 'bg-slate-100 text-slate-600'}`}>{risk}</span>
}

function Overview({ navigate }: { navigate: Navigate }) {
  return (
    <Shell activeView="government-overview" navigate={navigate}>
      <PageHeader
        icon={Gauge}
        title="Government Intelligence Overview"
        subtitle="A decision-support command centre for identifying healthcare gaps, prioritising interventions and allocating public resources."
        badge="Decision Support"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Healthcare Gap Score" value="68/100" detail="Across monitored areas" icon={Activity} tone="red" trend="up" />
        <StatCard label="Villages At Risk" value="14" detail="5 critical · 9 high" icon={MapPin} tone="amber" />
        <StatCard label="Doctor Shortage" value="47" detail="Posts below required strength" icon={Users} tone="red" />
        <StatCard label="Active Warnings" value="9" detail="3 require immediate action" icon={AlertTriangle} tone="amber" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.45fr_1fr]">
        <SectionCard title="Priority intervention areas" subtitle="Ranked using access, capacity, workforce and supply signals.">
          <div className="space-y-3">
            {[
              ['Daund PHC', 'Medicine depletion + doctor shortage', 'Critical', 'government-early-warning'],
              ['Nandgaon', 'Referral delays + workforce gap', 'High', 'referral-monitoring'],
              ['MIDC Area', 'Rising demand + limited capacity', 'High', 'government-healthcare-demand'],
              ['Baramati Rural', 'Moderate capacity pressure', 'Medium', 'government-facility-intelligence'],
            ].map(([name, reason, risk, target]) => (
              <button
                key={name}
                onClick={() => navigate(target as GovernmentIntelligenceView)}
                className="flex w-full items-center justify-between rounded-xl border border-slate-100 p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50/40"
              >
                <div>
                  <div className="font-semibold text-slate-900">{name}</div>
                  <div className="mt-1 text-sm text-slate-500">{reason}</div>
                </div>
                <div className="flex items-center gap-3">
                  <RiskBadge risk={risk} />
                  <ChevronRight size={17} className="text-slate-400" />
                </div>
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="System health" subtitle="Current operating picture">
          <div className="space-y-5">
            {[
              ['Facility reporting', 94],
              ['Medicine reporting', 88],
              ['Workforce reporting', 93],
              ['Demand signals', 84],
            ].map(([label, value]) => (
              <div key={label as string}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-slate-600">{label}</span>
                  <span className="font-bold text-slate-900">{value}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="mt-6">
        <SectionCard title="Healthcare demand vs capacity" subtitle="The gap is widening in several monitored areas.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={demandTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="demand" name="Demand" fillOpacity={0.12} strokeWidth={2} />
                <Area type="monotone" dataKey="capacity" name="Capacity" fillOpacity={0.08} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>
    </Shell>
  )
}

function HealthcareGap({ navigate }: { navigate: Navigate }) {
  return (
    <Shell activeView="healthcare-gap" navigate={navigate}>
      <PageHeader icon={Activity} title="Healthcare Gap Intelligence" subtitle="Identify where public healthcare capacity is insufficient and rank areas for intervention." badge="Gap Analysis" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Average Gap Score" value="68/100" detail="Higher means greater need" icon={Activity} tone="red" />
        <StatCard label="Critical Areas" value="5" detail="Immediate intervention" icon={AlertTriangle} tone="red" />
        <StatCard label="Doctor Gap" value="47" detail="Additional doctors needed" icon={Stethoscope} tone="amber" />
        <StatCard label="Access Gap" value="31%" detail="Population with low access" icon={MapPin} tone="blue" />
      </div>

      <div className="mt-6">
        <SectionCard title="Area-level healthcare gap" subtitle="Composite score combines workforce, facility capacity, medicines and accessibility.">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
                <tr><th className="pb-3">Area</th><th className="pb-3">Population</th><th className="pb-3">Gap</th><th className="pb-3">Doctors</th><th className="pb-3">Accessibility</th><th className="pb-3">Priority</th></tr>
              </thead>
              <tbody>
                {villages.map((v) => (
                  <tr key={v.name} className="border-b border-slate-50 last:border-0">
                    <td className="py-4 font-semibold text-slate-900">{v.name}</td>
                    <td className="py-4 text-slate-600">{v.population.toLocaleString()}</td>
                    <td className="py-4 font-bold text-slate-900">{v.gap}/100</td>
                    <td className="py-4 text-slate-600">{v.doctors}/{v.requiredDoctors}</td>
                    <td className="py-4 text-slate-600">{v.accessibility}%</td>
                    <td className="py-4"><RiskBadge risk={v.risk} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SectionCard title="Gap composition" subtitle="What is driving the overall deficit?">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Workforce', score: 76 },
                { name: 'Access', score: 64 },
                { name: 'Capacity', score: 58 },
                { name: 'Medicine', score: 51 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" name="Gap contribution" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
        <SectionCard title="Recommended government response">
          <div className="space-y-3">
            {['Deploy doctors to critical PHCs', 'Redistribute critical medicines', 'Prioritise transport support for remote villages', 'Schedule targeted medical camps'].map((x, i) => (
              <div key={x} className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">{i + 1}</span>
                <span className="text-sm font-medium text-slate-700">{x}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </Shell>
  )
}

function VillageHeatmap({ navigate }: { navigate: Navigate }) {
  const [selected, setSelected] = useState(villages[0])
  const [metric, setMetric] = useState<'gap' | 'accessibility' | 'population'>('gap')
  const max = Math.max(...villages.map(v => metric === 'gap' ? v.gap : metric === 'accessibility' ? 100 - v.accessibility : v.population))

  return (
    <Shell activeView="village-heatmap" navigate={navigate}>
      <PageHeader icon={Map} title="Village Heatmap" subtitle="Geographic view of healthcare gaps, access barriers and population needs." badge="GIS Intelligence" />
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <SectionCard title="Intervention priority map" subtitle="Prototype map layer for the SIH demonstration.">
          <div className="relative h-[460px] overflow-hidden rounded-2xl bg-slate-100">
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(90deg, #cbd5e1 1px, transparent 1px), linear-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '42px 42px' }} />
            <div className="absolute left-[17%] top-[25%] h-44 w-44 rounded-full bg-red-400/25 blur-2xl" />
            <div className="absolute right-[17%] top-[38%] h-40 w-40 rounded-full bg-orange-400/25 blur-2xl" />
            <div className="absolute bottom-[15%] left-[42%] h-36 w-36 rounded-full bg-amber-300/25 blur-2xl" />
            {villages.map((v, i) => {
              const positions = [
                ['23%', '31%'], ['68%', '34%'], ['49%', '58%'], ['76%', '69%'], ['31%', '70%'], ['58%', '22%'],
              ]
              const [left, top] = positions[i]
              const critical = v.gap >= 75
              const high = v.gap >= 60
              return (
                <button
                  key={v.name}
                  onClick={() => setSelected(v)}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left, top }}
                >
                  <span className={`flex h-10 w-10 items-center justify-center rounded-full border-4 border-white text-white shadow-lg ${critical ? 'bg-red-500' : high ? 'bg-orange-500' : 'bg-emerald-500'}`}>
                    <MapPin size={18} fill="currentColor" />
                  </span>
                  <span className="mt-1 block whitespace-nowrap rounded-lg bg-white/95 px-2 py-1 text-[11px] font-bold text-slate-700 shadow">{v.name}</span>
                </button>
              )
            })}
            <div className="absolute left-4 top-4 rounded-xl bg-white/95 p-3 shadow">
              <p className="mb-2 text-xs font-bold text-slate-700">Heatmap metric</p>
              <select value={metric} onChange={e => setMetric(e.target.value as typeof metric)} className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs">
                <option value="gap">Healthcare gap</option>
                <option value="accessibility">Access risk</option>
                <option value="population">Population</option>
              </select>
            </div>
          </div>
        </SectionCard>

        <SectionCard title={selected.name} subtitle="Selected area intelligence">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-400">Population</p><p className="mt-1 text-lg font-bold">{selected.population.toLocaleString()}</p></div>
              <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-400">Gap score</p><p className="mt-1 text-lg font-bold">{selected.gap}/100</p></div>
              <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-400">Doctors</p><p className="mt-1 text-lg font-bold">{selected.doctors}/{selected.requiredDoctors}</p></div>
              <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-400">Accessibility</p><p className="mt-1 text-lg font-bold">{selected.accessibility}%</p></div>
            </div>
            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
              <p className="text-sm font-bold text-red-800">Priority: {selected.risk}</p>
              <p className="mt-1 text-sm text-red-700">This area should be evaluated for workforce, supply and outreach intervention.</p>
            </div>
            <button onClick={() => navigate('medical-camp-planner')} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700">
              Plan intervention <ChevronRight size={16} />
            </button>
          </div>
        </SectionCard>
      </div>
    </Shell>
  )
}

function EarlyWarning({ navigate }: { navigate: Navigate }) {
  const warnings = [
    ['Daund PHC', 'ORS stock predicted to fall below safety level', '4 days', '91%', 'Critical'],
    ['Nandgaon PHC', 'Referral backlog may exceed capacity', '7 days', '86%', 'High'],
    ['MIDC Area', 'Patient demand expected to exceed capacity', '10 days', '82%', 'High'],
    ['Baramati Rural', 'Iron tablet stock trending downward', '16 days', '76%', 'Medium'],
  ]
  return (
    <Shell activeView="government-early-warning" navigate={navigate}>
      <PageHeader icon={AlertTriangle} title="Government Early Warning" subtitle="Predictive signals that help authorities act before a healthcare problem becomes critical." badge="Predictive Alerts" />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active warnings" value="9" detail="Across monitored facilities" icon={AlertTriangle} tone="red" />
        <StatCard label="Critical" value="3" detail="Immediate action recommended" icon={XCircle} tone="red" />
        <StatCard label="Prediction accuracy" value="87%" detail="Rolling validation estimate" icon={Activity} tone="emerald" />
      </div>
      <div className="mt-6">
        <SectionCard title="Priority warnings" subtitle="Each warning includes a time horizon and confidence score.">
          <div className="space-y-3">
            {warnings.map(([facility, message, horizon, confidence, risk]) => (
              <div key={facility} className="rounded-xl border border-slate-100 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-2"><AlertTriangle size={17} className="text-red-500" /><span className="font-bold text-slate-900">{facility}</span><RiskBadge risk={risk} /></div>
                    <p className="mt-2 text-sm text-slate-600">{message}</p>
                  </div>
                  <div className="flex gap-5 text-sm">
                    <div><p className="text-xs text-slate-400">Horizon</p><p className="font-bold text-slate-800">{horizon}</p></div>
                    <div><p className="text-xs text-slate-400">Confidence</p><p className="font-bold text-slate-800">{confidence}</p></div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={() => navigate('government-medicine-intelligence')} className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">View intervention</button>
                  <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600">Acknowledge</button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </Shell>
  )
}

function FacilityIntelligence({ navigate }: { navigate: Navigate }) {
  return (
    <Shell activeView="government-facility-intelligence" navigate={navigate}>
      <PageHeader icon={Building2} title="Facility Intelligence" subtitle="Compare public healthcare facilities by workload, staffing, supply and operational performance." badge="Facility Performance" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Facilities monitored" value="42" detail="PHCs, hospitals and centres" icon={Building2} />
        <StatCard label="High utilisation" value="11" detail="Above 80% capacity" icon={Gauge} tone="amber" />
        <StatCard label="Critical facilities" value="4" detail="Need intervention" icon={AlertTriangle} tone="red" />
        <StatCard label="Avg performance" value="71%" detail="Across monitored facilities" icon={TrendingUp} tone="emerald" />
      </div>
      <div className="mt-6">
        <SectionCard title="Facility performance matrix">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
                <tr><th className="pb-3">Facility</th><th className="pb-3">Type</th><th className="pb-3">Load</th><th className="pb-3">Doctors</th><th className="pb-3">Beds</th><th className="pb-3">Medicine</th><th className="pb-3">Score</th><th className="pb-3">Status</th></tr>
              </thead>
              <tbody>
                {facilities.map(f => (
                  <tr key={f.name} className="border-b border-slate-50">
                    <td className="py-4 font-semibold">{f.name}</td><td className="py-4 text-slate-500">{f.type}</td>
                    <td className="py-4 font-semibold">{f.load}%</td><td className="py-4">{f.doctors}/{f.required}</td>
                    <td className="py-4">{f.beds}%</td><td className="py-4">{f.medicine}%</td>
                    <td className="py-4 font-bold">{f.score}</td><td className="py-4"><RiskBadge risk={f.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
      <div className="mt-6">
        <SectionCard title="Facility utilisation trend">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={demandTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" /><YAxis /><Tooltip />
                <Line type="monotone" dataKey="demand" name="Patient demand" strokeWidth={3} />
                <Line type="monotone" dataKey="capacity" name="Available capacity" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>
    </Shell>
  )
}

function DoctorIntelligence({ navigate }: { navigate: Navigate }) {
  const specialties = [
    { name: 'General Medicine', required: 64, available: 51 },
    { name: 'Paediatrics', required: 28, available: 19 },
    { name: 'Gynaecology', required: 22, available: 15 },
    { name: 'Emergency Care', required: 31, available: 18 },
    { name: 'Anaesthesia', required: 16, available: 11 },
  ]
  return (
    <Shell activeView="doctor-intelligence" navigate={navigate}>
      <PageHeader icon={Stethoscope} title="Doctor Intelligence" subtitle="Workforce distribution, shortage analysis and specialty gaps across public facilities." badge="Workforce Planning" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Doctors available" value="137" detail="Across monitored facilities" icon={Stethoscope} />
        <StatCard label="Doctors required" value="184" detail="Sanctioned / estimated need" icon={Users} tone="blue" />
        <StatCard label="Shortage" value="47" detail="25.5% workforce gap" icon={TrendingDown} tone="red" />
        <StatCard label="Critical facilities" value="8" detail="Below minimum staffing" icon={AlertTriangle} tone="amber" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SectionCard title="Specialty workforce gap">
          <div className="space-y-5">
            {specialties.map(s => {
              const pct = Math.round((s.available / s.required) * 100)
              return (
                <div key={s.name}>
                  <div className="mb-2 flex justify-between text-sm"><span className="font-semibold">{s.name}</span><span className="text-slate-500">{s.available}/{s.required}</span></div>
                  <div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${pct}%` }} /></div>
                </div>
              )
            })}
          </div>
        </SectionCard>
        <SectionCard title="Priority workforce actions">
          <div className="space-y-3">
            {[
              ['Daund PHC', '4 doctors required', 'Critical'],
              ['Nandgaon PHC', '3 doctors required', 'High'],
              ['MIDC Health Centre', '2 doctors required', 'High'],
              ['Baramati Rural Hospital', '3 doctors required', 'Medium'],
            ].map(([place, text, risk]) => (
              <div key={place} className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                <div><p className="font-semibold">{place}</p><p className="text-xs text-slate-500">{text}</p></div><RiskBadge risk={risk} />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </Shell>
  )
}

function MedicineIntelligence({ navigate }: { navigate: Navigate }) {
  return (
    <Shell activeView="government-medicine-intelligence" navigate={navigate}>
      <PageHeader icon={Pill} title="Medicine Intelligence" subtitle="Monitor stock risk, predict depletion and identify opportunities for inter-facility redistribution." badge="Supply Intelligence" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Critical medicines" value="7" detail="Below safety threshold" icon={Pill} tone="red" />
        <StatCard label="At-risk facilities" value="12" detail="Supply intervention needed" icon={Building2} tone="amber" />
        <StatCard label="Redistribution candidates" value="9" detail="Surplus identified nearby" icon={RefreshCw} tone="blue" />
        <StatCard label="Stock coverage" value="86%" detail="Overall essential medicines" icon={CheckCircle2} tone="emerald" />
      </div>
      <div className="mt-6">
        <SectionCard title="Critical medicine watchlist" subtitle="Days remaining is estimated from current stock and daily demand.">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase text-slate-400"><tr><th className="pb-3">Medicine</th><th className="pb-3">Facility</th><th className="pb-3">Stock</th><th className="pb-3">Daily demand</th><th className="pb-3">Days left</th><th className="pb-3">Risk</th><th /></tr></thead>
              <tbody>
                {medicineData.map(m => (
                  <tr key={`${m.medicine}-${m.facility}`} className="border-b border-slate-50">
                    <td className="py-4 font-semibold">{m.medicine}</td><td className="py-4 text-slate-600">{m.facility}</td><td className="py-4">{m.stock.toLocaleString()}</td><td className="py-4">{m.daily}</td><td className="py-4 font-bold">{m.days}</td><td className="py-4"><RiskBadge risk={m.risk} /></td>
                    <td className="py-4"><button onClick={() => navigate('government-early-warning')} className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">Act</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SectionCard title="Redistribution recommendation">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5">
            <p className="text-sm font-bold text-emerald-800">ORS · Daund PHC</p>
            <p className="mt-2 text-sm text-emerald-700">Transfer 800 units from a nearby facility with surplus stock to extend coverage beyond the current 4-day risk window.</p>
            <button className="mt-4 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white">Create transfer plan</button>
          </div>
        </SectionCard>
        <SectionCard title="Stock risk by medicine">
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={medicineData}>
                <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="medicine" /><YAxis /><Tooltip />
                <Bar dataKey="days" name="Days remaining" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>
    </Shell>
  )
}

function HealthcareDemand({ navigate }: { navigate: Navigate }) {
  return (
    <Shell activeView="government-healthcare-demand" navigate={navigate}>
      <PageHeader icon={BarChart3} title="Healthcare Demand" subtitle="Understand where demand is increasing and whether public healthcare capacity can absorb the projected load." badge="Demand Forecasting" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Monthly demand" value="6,100" detail="Patient visits / encounters" icon={Users} tone="blue" trend="up" />
        <StatCard label="Demand growth" value="+24%" detail="Compared with January" icon={TrendingUp} tone="amber" />
        <StatCard label="Capacity gap" value="1,100" detail="Estimated monthly shortfall" icon={Activity} tone="red" />
        <StatCard label="High-demand areas" value="8" detail="Requiring capacity review" icon={MapPin} tone="amber" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <SectionCard title="Demand forecast" subtitle="Observed demand compared with available system capacity.">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={demandTrend}>
                <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Legend />
                <Area type="monotone" dataKey="demand" name="Demand" fillOpacity={0.12} strokeWidth={3} />
                <Area type="monotone" dataKey="capacity" name="Capacity" fillOpacity={0.08} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
        <SectionCard title="Demand hotspots">
          <div className="space-y-3">
            {[
              ['Daund', '+31%', 'Emergency + OPD'],
              ['MIDC Area', '+27%', 'OPD'],
              ['Nandgaon', '+22%', 'Maternal care'],
              ['Baramati Rural', '+16%', 'General medicine'],
            ].map(([area, growth, category]) => (
              <div key={area} className="rounded-xl bg-slate-50 p-4">
                <div className="flex justify-between"><span className="font-bold">{area}</span><span className="font-bold text-red-600">{growth}</span></div>
                <p className="mt-1 text-xs text-slate-500">{category}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </Shell>
  )
}

function ReferralMonitoring({ navigate }: { navigate: Navigate }) {
  return (
    <Shell activeView="referral-monitoring" navigate={navigate}>
      <PageHeader icon={Route} title="Referral Monitoring" subtitle="Track referral flows, pending cases and delays across the public healthcare network." badge="Referral Intelligence" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Referrals this month" value="298" detail="Across monitored facilities" icon={Route} />
        <StatCard label="Pending" value="46" detail="Awaiting completion" icon={ClockIcon} tone="amber" />
        <StatCard label="Delayed" value="26" detail="Beyond expected time" icon={AlertTriangle} tone="red" />
        <StatCard label="Avg referral time" value="50 min" detail="Current network average" icon={Activity} tone="blue" />
      </div>
      <div className="mt-6">
        <SectionCard title="Referral bottlenecks">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase text-slate-400"><tr><th className="pb-3">From</th><th className="pb-3">Destination</th><th className="pb-3">Total</th><th className="pb-3">Pending</th><th className="pb-3">Delayed</th><th className="pb-3">Avg time</th></tr></thead>
              <tbody>
                {referrals.map(r => (
                  <tr key={r.from} className="border-b border-slate-50"><td className="py-4 font-semibold">{r.from}</td><td className="py-4">{r.to}</td><td className="py-4">{r.total}</td><td className="py-4 font-bold text-amber-600">{r.pending}</td><td className="py-4 font-bold text-red-600">{r.delayed}</td><td className="py-4">{r.avg} min</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SectionCard title="Referral flow">
          <div className="flex flex-col items-center gap-2 py-6">
            {['Village', 'PHC', 'Taluk / Rural Hospital', 'District Hospital'].map((x, i) => (
              <div key={x} className="flex flex-col items-center">
                <div className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold shadow-sm">{x}</div>
                {i < 3 && <ChevronRight className="my-2 rotate-90 text-slate-300" size={18} />}
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Recommended actions">
          <div className="space-y-3">
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-800"><b>Nandgaon:</b> investigate 13 delayed referrals.</div>
            <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800"><b>Daund:</b> review receiving-facility capacity during peak hours.</div>
            <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800"><b>MIDC:</b> flow is improving; continue monitoring.</div>
          </div>
        </SectionCard>
      </div>
    </Shell>
  )
}

function MedicalCampPlanner({ navigate }: { navigate: Navigate }) {
  const [area, setArea] = useState('Nandgaon')
  const [campType, setCampType] = useState('General screening')
  const selected = villages.find(v => v.name === area) || villages[1]
  return (
    <Shell activeView="medical-camp-planner" navigate={navigate}>
      <PageHeader icon={CalendarDays} title="Medical Camp Planner" subtitle="Turn healthcare gap intelligence into targeted outreach and resource plans." badge="Intervention Planning" />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
        <SectionCard title="Create intervention plan" subtitle="Select the priority area and intervention type.">
          <div className="space-y-5">
            <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Priority area</span><select value={area} onChange={e => setArea(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm">{villages.map(v => <option key={v.name}>{v.name}</option>)}</select></label>
            <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Camp type</span><select value={campType} onChange={e => setCampType(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"><option>General screening</option><option>Maternal & child health</option><option>Chronic disease screening</option><option>Medicine distribution</option><option>Specialty consultation</option></select></label>
            <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Target date</span><input type="date" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" /></label>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700"><ClipboardList size={17} /> Generate camp plan</button>
          </div>
        </SectionCard>
        <SectionCard title="Recommended camp" subtitle={`Generated from intelligence signals for ${selected.name}.`}>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
            <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wide text-emerald-600">Recommended location</p><h3 className="mt-1 text-xl font-bold text-slate-900">{selected.name}</h3></div><RiskBadge risk={selected.risk} /></div>
            <p className="mt-4 text-sm text-slate-600">Reason: high healthcare gap combined with access constraints and workforce pressure.</p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[['Doctors','2'],['Nurses','3'],['Pharmacist','1'],['Expected','420']].map(([a,b]) => <div key={a} className="rounded-xl bg-white p-3"><p className="text-xs text-slate-400">{a}</p><p className="mt-1 font-bold">{b}</p></div>)}
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {['Basic diagnostic kit', 'Essential medicine kit', 'Patient registration desk', 'Referral support'].map(x => <div key={x} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 text-sm font-medium"><CheckCircle2 size={17} className="text-emerald-600" />{x}</div>)}
          </div>
        </SectionCard>
      </div>
    </Shell>
  )
}

function DataReliability({ navigate }: { navigate: Navigate }) {
  return (
    <Shell activeView="government-data-reliability" navigate={navigate}>
      <PageHeader icon={Database} title="Data Reliability" subtitle="Measure data completeness, freshness and consistency before using intelligence for policy decisions." badge="Data Quality" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Overall reliability" value="91%" detail="Across monitored data sources" icon={ShieldCheck} tone="emerald" />
        <StatCard label="Records updated" value="94%" detail="Within expected reporting window" icon={RefreshCw} />
        <StatCard label="Missing records" value="6%" detail="Requires follow-up" icon={Database} tone="amber" />
        <StatCard label="Data alerts" value="12" detail="Quality checks requiring review" icon={AlertTriangle} tone="red" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <SectionCard title="Reliability by domain">
          <div className="space-y-5">
            {reliability.map(r => (
              <div key={r.name}>
                <div className="mb-2 flex justify-between"><span className="text-sm font-semibold">{r.name}</span><span className="text-sm font-bold">{r.value}%</span></div>
                <div className="h-2.5 rounded-full bg-slate-100"><div className={`h-2.5 rounded-full ${r.value < 85 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${r.value}%` }} /></div>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Quality issues requiring attention">
          <div className="space-y-3">
            {[
              ['Village data', 'Some population records are older than 90 days', 'Medium'],
              ['Demand data', 'Weekend reporting gaps in 3 facilities', 'Medium'],
              ['Medicine data', '2 facilities have delayed stock updates', 'High'],
              ['Facility data', '1 duplicate facility record detected', 'Low'],
            ].map(([title, detail, risk]) => <div key={title} className="flex items-start justify-between gap-4 rounded-xl bg-slate-50 p-4"><div><p className="font-semibold">{title}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div><RiskBadge risk={risk} /></div>)}
          </div>
        </SectionCard>
      </div>
    </Shell>
  )
}

function Reports({ navigate }: { navigate: Navigate }) {
  const [query, setQuery] = useState('')
  const reports = [
    ['District Healthcare Report', 'Executive summary of gaps, capacity and workforce.', 'Monthly'],
    ['Village Gap Report', 'Area-level access and healthcare deficit ranking.', 'Weekly'],
    ['Medicine Shortage Report', 'Critical stock, days remaining and redistribution candidates.', 'Daily'],
    ['Doctor Workforce Report', 'Staffing gaps and specialty requirements.', 'Monthly'],
    ['Facility Performance Report', 'Operational indicators across public facilities.', 'Weekly'],
    ['Referral Monitoring Report', 'Referral flow, pending cases and delays.', 'Weekly'],
  ]
  const filtered = useMemo(() => reports.filter(r => r[0].toLowerCase().includes(query.toLowerCase())), [query])
  return (
    <Shell activeView="government-reports" navigate={navigate}>
      <PageHeader icon={FileBarChart} title="Government Reports" subtitle="Generate decision-ready reports for district reviews, resource planning and intervention tracking." badge="Reporting Centre" />
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1"><Search size={17} className="absolute left-3 top-3.5 text-slate-400" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search reports..." className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-emerald-400" /></div>
        <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700"><RefreshCw size={16} /> Refresh data</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map(([title, description, frequency]) => (
          <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4"><div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600"><FileTextIcon size={19} /></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{frequency}</span></div>
            <h3 className="mt-4 font-bold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
            <div className="mt-5 flex gap-2"><button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-bold text-white"><FileBarChart size={16} /> Generate</button><button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-600"><Download size={16} /> Export</button></div>
          </div>
        ))}
      </div>
    </Shell>
  )
}

function ClockIcon({ size = 20 }: { size?: number }) {
  return <Activity size={size} />
}

function FileTextIcon({ size = 20 }: { size?: number }) {
  return <ClipboardList size={size} />
}

export function GovernmentIntelligenceDashboard({
  navigate,
  activeView = 'government-overview',
}: {
  navigate: Navigate
  activeView: GovernmentIntelligenceView
}) {
  switch (activeView) {
    case 'healthcare-gap':
      return <HealthcareGap navigate={navigate} />
    case 'village-heatmap':
      return <VillageHeatmap navigate={navigate} />
    case 'government-early-warning':
      return <EarlyWarning navigate={navigate} />
    case 'government-facility-intelligence':
      return <FacilityIntelligence navigate={navigate} />
    case 'doctor-intelligence':
      return <DoctorIntelligence navigate={navigate} />
    case 'government-medicine-intelligence':
      return <MedicineIntelligence navigate={navigate} />
    case 'government-healthcare-demand':
      return <HealthcareDemand navigate={navigate} />
    case 'referral-monitoring':
      return <ReferralMonitoring navigate={navigate} />
    case 'medical-camp-planner':
      return <MedicalCampPlanner navigate={navigate} />
    case 'government-data-reliability':
      return <DataReliability navigate={navigate} />
    case 'government-reports':
      return <Reports navigate={navigate} />
    case 'government-overview':
    default:
      return <Overview navigate={navigate} />
  }
}
