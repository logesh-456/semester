import { useMemo, useState, type ReactNode } from 'react'
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Brain,
  Building2,
  Calendar,
  CheckCircle2,
  Clock3,
  Database,
  Eye,
  HeartPulse,
  MapPin,
  MessageSquare,
  Pill,
  RefreshCw,
  Route,
  ShieldCheck,
  Stethoscope,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Activity,
  Ambulance,
  BarChart3,
  Hospital,
  Search,
  Wifi,
  UserRound,
} from 'lucide-react'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

export type IntelligenceView =
  | 'early-warning'
  | 'medicine-intelligence'
  | 'workforce-intelligence'
  | 'facility-performance'
  | 'medical-camp'
  | 'referral-bottleneck'
  | 'healthcare-demand'
  | 'data-reliability'
  | 'citizen-accessibility'

type Props = {
  navigate?: (view: IntelligenceView) => void
  activeView?: IntelligenceView
}

const riskAlerts = [
  {
    title: 'Medicine shortage predicted',
    facility: 'PHC Baramati Rural',
    detail: 'ORS stock may fall below safety level within 4 days.',
    severity: 'Critical',
    icon: Pill,
  },
  {
    title: 'Doctor shortage risk',
    facility: 'PHC Nandgaon',
    detail: 'Patient demand is 31% above available workforce capacity.',
    severity: 'High',
    icon: Stethoscope,
  },
  {
    title: 'Healthcare access deterioration',
    facility: 'Village A Cluster',
    detail: 'Average travel time increased by 18% this month.',
    severity: 'High',
    icon: MapPin,
  },
  {
    title: 'Referral delay',
    facility: 'CHC Daund',
    detail: 'Specialist referral waiting time crossed 24 hours.',
    severity: 'Medium',
    icon: Route,
  },
]

const riskTrend = [
  { month: 'Jan', risk: 32 },
  { month: 'Feb', risk: 38 },
  { month: 'Mar', risk: 35 },
  { month: 'Apr', risk: 47 },
  { month: 'May', risk: 52 },
  { month: 'Jun', risk: 61 },
]

const medicines = [
  {
    medicine: 'ORS',
    facility: 'PHC Baramati Rural',
    stock: 180,
    demand: 55,
    days: 3,
    status: 'Critical',
    redistribution: 'CHC Daund',
  },
  {
    medicine: 'Paracetamol',
    facility: 'PHC Nandgaon',
    stock: 620,
    demand: 78,
    days: 8,
    status: 'Warning',
    redistribution: 'CHC Daund',
  },
  {
    medicine: 'Amoxicillin',
    facility: 'PHC Malegaon',
    stock: 410,
    demand: 46,
    days: 9,
    status: 'Warning',
    redistribution: 'PHC Nandgaon',
  },
  {
    medicine: 'Insulin',
    facility: 'PHC Baramati Rural',
    stock: 85,
    demand: 12,
    days: 7,
    status: 'Warning',
    redistribution: 'CHC Daund',
  },
  {
    medicine: 'Azithromycin',
    facility: 'PHC Nandgaon',
    stock: 890,
    demand: 62,
    days: 14,
    status: 'Stable',
    redistribution: 'None',
  },
]

const redistribution = [
  {
    medicine: 'ORS',
    from: 'CHC Daund',
    to: 'PHC Baramati Rural',
    quantity: 250,
    urgency: 'Immediate',
  },
  {
    medicine: 'Paracetamol',
    from: 'CHC Daund',
    to: 'PHC Nandgaon',
    quantity: 300,
    urgency: 'High',
  },
  {
    medicine: 'Amoxicillin',
    from: 'PHC Nandgaon',
    to: 'PHC Malegaon',
    quantity: 180,
    urgency: 'Medium',
  },
]

const workforceData = [
  { name: 'Available', value: 72 },
  { name: 'Limited', value: 18 },
  { name: 'Unavailable', value: 10 },
]

const specialistGaps = [
  {
    specialist: 'Cardiology',
    level: 'Critical',
    affected: '12 villages',
    demand: 92,
  },
  {
    specialist: 'Pediatrics',
    level: 'High',
    affected: '9 villages',
    demand: 78,
  },
  {
    specialist: 'Gynecology',
    level: 'Moderate',
    affected: '7 villages',
    demand: 64,
  },
]

const demandData = [
  { village: 'Village A', demand: 86 },
  { village: 'Village B', demand: 73 },
  { village: 'Village C', demand: 68 },
  { village: 'Village D', demand: 55 },
  { village: 'Village E', demand: 48 },
]

const facilities = [
  {
    name: 'PHC Nandgaon',
    type: 'Primary Health Centre',
    score: 68,
    doctor: 61,
    medicine: 72,
    waiting: 48,
    load: 78,
    service: 76,
    reliability: 94,
  },
  {
    name: 'CHC Daund',
    type: 'Community Health Centre',
    score: 81,
    doctor: 88,
    medicine: 91,
    waiting: 32,
    load: 62,
    service: 89,
    reliability: 96,
  },
  {
    name: 'PHC Baramati Rural',
    type: 'Primary Health Centre',
    score: 54,
    doctor: 58,
    medicine: 63,
    waiting: 52,
    load: 91,
    service: 61,
    reliability: 84,
  },
  {
    name: 'PHC Malegaon',
    type: 'Primary Health Centre',
    score: 76,
    doctor: 81,
    medicine: 79,
    waiting: 29,
    load: 67,
    service: 82,
    reliability: 93,
  },
]

const campTrend = [
  { month: 'Jan', camps: 8, beneficiaries: 720 },
  { month: 'Feb', camps: 11, beneficiaries: 980 },
  { month: 'Mar', camps: 13, beneficiaries: 1120 },
  { month: 'Apr', camps: 16, beneficiaries: 1430 },
  { month: 'May', camps: 18, beneficiaries: 1640 },
  { month: 'Jun', camps: 22, beneficiaries: 2010 },
]

const campRecommendations = [
  {
    village: 'Village A',
    gap: 86,
    population: 6200,
    beneficiaries: 420,
    priority: 'Critical',
    problems: [
      'No specialist available',
      '18 km from nearest PHC',
      'High healthcare demand',
      'Poor transport access',
    ],
    departments: [
      'General Medicine',
      'Eye Care',
      "Women's Health",
    ],
  },
  {
    village: 'Village B',
    gap: 78,
    population: 4800,
    beneficiaries: 310,
    priority: 'High',
    problems: [
      'Pediatrics shortage',
      '14 km from nearest PHC',
      'Rising patient demand',
    ],
    departments: [
      'Pediatrics',
      'General Medicine',
    ],
  },
  {
    village: 'Village C',
    gap: 69,
    population: 3900,
    beneficiaries: 260,
    priority: 'High',
    problems: [
      'Limited specialist access',
      'Poor transport connectivity',
      'High women healthcare demand',
    ],
    departments: [
      "Women's Health",
      'General Medicine',
    ],
  },
]

const referralTrend = [
  { month: 'Jan', total: 112, delayed: 8 },
  { month: 'Feb', total: 128, delayed: 10 },
  { month: 'Mar', total: 143, delayed: 12 },
  { month: 'Apr', total: 151, delayed: 14 },
  { month: 'May', total: 168, delayed: 17 },
  { month: 'Jun', total: 184, delayed: 21 },
]

const referralFacilities = [
  {
    facility: 'PHC Baramati Rural',
    referrals: 48,
    pending: 8,
    accepted: 37,
    avgTime: 19,
    delayed: 6,
    reason: 'Specialist unavailable',
  },
  {
    facility: 'PHC Nandgaon',
    referrals: 41,
    pending: 5,
    accepted: 34,
    avgTime: 16,
    delayed: 4,
    reason: 'Transport delay',
  },
  {
    facility: 'CHC Daund',
    referrals: 36,
    pending: 4,
    accepted: 30,
    avgTime: 14,
    delayed: 3,
    reason: 'Bed availability',
  },
  {
    facility: 'PHC Malegaon',
    referrals: 29,
    pending: 3,
    accepted: 25,
    avgTime: 11,
    delayed: 2,
    reason: 'Documentation delay',
  },
]

const villageDemand = [
  { village: 'Village A', pediatrics: 34, women: 28, general: 21 },
  { village: 'Village B', pediatrics: 27, women: 35, general: 18 },
  { village: 'Village C', pediatrics: 22, women: 29, general: 31 },
  { village: 'Village D', pediatrics: 18, women: 21, general: 24 },
  { village: 'Village E', pediatrics: 14, women: 17, general: 19 },
]

const departmentDemand = [
  { department: 'General Medicine', demand: 86 },
  { department: 'Pediatrics', demand: 74 },
  { department: "Women's Health", demand: 68 },
  { department: 'Cardiology', demand: 59 },
  { department: 'Eye Care', demand: 47 },
]

const ageDemand = [
  { age: '0–5', demand: 38 },
  { age: '6–18', demand: 24 },
  { age: '19–40', demand: 51 },
  { age: '41–60', demand: 63 },
  { age: '60+', demand: 72 },
]

const weeklyDemand = [
  { day: 'Mon', patients: 320 },
  { day: 'Tue', patients: 350 },
  { day: 'Wed', patients: 390 },
  { day: 'Thu', patients: 420 },
  { day: 'Fri', patients: 450 },
  { day: 'Sat', patients: 380 },
  { day: 'Sun', patients: 210 },
]

const reliabilityFacilities = [
  {
    facility: 'PHC Nandgaon',
    reliability: 94,
    frequency: 'Every 15 min',
    verification: '10:32 AM',
    reports: 12,
    historical: 93,
    discrepancies: 2,
    status: 'Excellent',
  },
  {
    facility: 'CHC Daund',
    reliability: 96,
    frequency: 'Every 10 min',
    verification: '10:28 AM',
    reports: 8,
    historical: 97,
    discrepancies: 1,
    status: 'Excellent',
  },
  {
    facility: 'PHC Baramati Rural',
    reliability: 84,
    frequency: 'Every 2 hours',
    verification: 'Yesterday',
    reports: 27,
    historical: 82,
    discrepancies: 9,
    status: 'Needs Review',
  },
  {
    facility: 'PHC Malegaon',
    reliability: 93,
    frequency: 'Every 30 min',
    verification: '10:18 AM',
    reports: 11,
    historical: 91,
    discrepancies: 3,
    status: 'Good',
  },
]

const accessibilityTrend = [
  { month: 'Jan', distance: 17.2, time: 43, tele: 120 },
  { month: 'Feb', distance: 16.8, time: 41, tele: 150 },
  { month: 'Mar', distance: 16.1, time: 39, tele: 182 },
  { month: 'Apr', distance: 15.4, time: 37, tele: 220 },
  { month: 'May', distance: 14.7, time: 35, tele: 265 },
  { month: 'Jun', distance: 13.9, time: 33, tele: 310 },
]

const accessibilityVillages = [
  {
    village: 'Village A',
    distance: 18.4,
    time: 48,
    tele: 42,
    emergency: 8,
    camp: 76,
    visits: 14,
    feedback: 4.2,
  },
  {
    village: 'Village B',
    distance: 15.2,
    time: 39,
    tele: 35,
    emergency: 5,
    camp: 61,
    visits: 10,
    feedback: 4.4,
  },
  {
    village: 'Village C',
    distance: 12.7,
    time: 32,
    tele: 48,
    emergency: 4,
    camp: 55,
    visits: 8,
    feedback: 4.5,
  },
  {
    village: 'Village D',
    distance: 9.8,
    time: 26,
    tele: 31,
    emergency: 3,
    camp: 42,
    visits: 6,
    feedback: 4.6,
  },
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
            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
              {title}
            </h1>

            {badge && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                {badge}
              </span>
            )}
          </div>

          <p className="mt-1 max-w-3xl text-sm text-slate-500 md:text-base">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  )
}

function IntelligenceNav({
  activeView,
  navigate,
}: {
  activeView?: IntelligenceView
  navigate?: (view: IntelligenceView) => void
}) {
  const items: {
    id: IntelligenceView
    label: string
    icon: any
  }[] = [
    {
      id: 'early-warning',
      label: 'Early Warning',
      icon: AlertTriangle,
    },
    {
      id: 'medicine-intelligence',
      label: 'Medicine',
      icon: Pill,
    },
    {
      id: 'workforce-intelligence',
      label: 'Workforce',
      icon: Users,
    },
    {
      id: 'facility-performance',
      label: 'Facilities',
      icon: Building2,
    },
    {
      id: 'medical-camp',
      label: 'Medical Camps',
      icon: Calendar,
    },
    {
      id: 'referral-bottleneck',
      label: 'Referrals',
      icon: Route,
    },
    {
      id: 'healthcare-demand',
      label: 'Demand',
      icon: BarChart3,
    },
    {
      id: 'data-reliability',
      label: 'Data Reliability',
      icon: Database,
    },
    {
      id: 'citizen-accessibility',
      label: 'Accessibility',
      icon: MapPin,
    },
  ]

  return (
    <div className="mb-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="flex min-w-max gap-1">
        {items.map((item) => {
          const Icon = item.icon
          const active = activeView === item.id

          return (
            <button
              key={item.id}
              onClick={() => navigate?.(item.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                active
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-700'
              }`}
            >
              <Icon size={16} />
              {item.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  helper,
  trend,
  tone = 'emerald',
}: {
  icon: any
  label: string
  value: string | number
  helper?: string
  trend?: number
  tone?: 'emerald' | 'blue' | 'amber' | 'red' | 'purple'
}) {
  const tones = {
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        </div>

        <div className={`rounded-xl p-2.5 ${tones[tone]}`}>
          <Icon size={20} />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs">
        {trend !== undefined && (
          <span
            className={`flex items-center gap-1 font-semibold ${
              trend >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {trend >= 0 ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}
            {Math.abs(trend)}%
          </span>
        )}

        {helper && <span className="text-slate-400">{helper}</span>}
      </div>
    </div>
  )
}

function SeverityBadge({ severity }: { severity: string }) {
  const styles: Record<string, string> = {
    Critical: 'bg-red-100 text-red-700',
    High: 'bg-orange-100 text-orange-700',
    Medium: 'bg-amber-100 text-amber-700',
    Warning: 'bg-amber-100 text-amber-700',
    Stable: 'bg-emerald-100 text-emerald-700',
    Low: 'bg-blue-100 text-blue-700',
    Immediate: 'bg-red-100 text-red-700',
    Good: 'bg-emerald-100 text-emerald-700',
    Excellent: 'bg-emerald-100 text-emerald-700',
    'Needs Review': 'bg-orange-100 text-orange-700',
  }

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[severity] ?? 'bg-slate-100 text-slate-700'
      }`}
    >
      {severity}
    </span>
  )
}

function Progress({
  value,
  showValue = true,
}: {
  value: number
  showValue?: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${
            value >= 80
              ? 'bg-emerald-500'
              : value >= 60
                ? 'bg-amber-500'
                : 'bg-red-500'
          }`}
          style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        />
      </div>

      {showValue && (
        <span className="w-10 text-right text-xs font-semibold text-slate-600">
          {value}%
        </span>
      )}
    </div>
  )
}

function SectionTitle({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: any
  title: string
  subtitle?: string
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
        <Icon size={18} />
      </div>

      <div>
        <h2 className="font-semibold text-slate-900">{title}</h2>
        {subtitle && (
          <p className="text-xs text-slate-500">{subtitle}</p>
        )}
      </div>
    </div>
  )
}

function DashboardShell({
  children,
  activeView,
  navigate,
}: {
  children: ReactNode
  activeView?: IntelligenceView
  navigate?: (view: IntelligenceView) => void
}) {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <IntelligenceNav
          activeView={activeView}
          navigate={navigate}
        />
        {children}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* EARLY WARNING                                                              */
/* -------------------------------------------------------------------------- */

export function EarlyWarningDashboard({
  navigate,
  activeView,
}: Props) {
  return (
    <DashboardShell
      activeView={activeView}
      navigate={navigate}
    >
      <PageHeader
        icon={Brain}
        title="Early Warning & Risk Dashboard"
        subtitle="AI-assisted monitoring of emerging healthcare risks across facilities and underserved communities."
        badge="Predictive Intelligence"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={AlertTriangle}
          label="Active Risk Alerts"
          value="12"
          helper="Across monitored facilities"
          trend={18}
          tone="red"
        />
        <StatCard
          icon={Pill}
          label="Medicine Risks"
          value="4"
          helper="Shortage predicted"
          trend={12}
          tone="amber"
        />
        <StatCard
          icon={Users}
          label="Workforce Risks"
          value="3"
          helper="Facilities affected"
          trend={8}
          tone="purple"
        />
        <StatCard
          icon={Route}
          label="Referral Risks"
          value="5"
          helper="Potential delays"
          trend={21}
          tone="blue"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle
            icon={Activity}
            title="Healthcare Risk Trend"
            subtitle="Composite risk score over the last six months"
          />

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riskTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="risk"
                  stroke="#ef4444"
                  fill="#fecaca"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle
            icon={Target}
            title="Risk Engine"
            subtitle="Signals currently monitored"
          />

          <div className="space-y-4">
            {[
              ['Medicine stock', 'Active'],
              ['Doctor availability', 'Active'],
              ['Patient demand', 'Active'],
              ['Referral time', 'Active'],
              ['Accessibility', 'Active'],
            ].map(([name, status]) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-xl bg-slate-50 p-3"
              >
                <span className="text-sm text-slate-700">{name}</span>
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <CheckCircle2 size={14} />
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SectionTitle
          icon={AlertTriangle}
          title="Priority Risk Alerts"
          subtitle="Recommended actions based on current signals"
        />

        <div className="grid gap-4 md:grid-cols-2">
          {riskAlerts.map((alert) => {
            const Icon = alert.icon

            return (
              <div
                key={alert.title}
                className="rounded-2xl border border-slate-200 p-4"
              >
                <div className="flex gap-4">
                  <div className="rounded-xl bg-slate-100 p-3 text-slate-600">
                    <Icon size={21} />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-semibold text-slate-900">
                        {alert.title}
                      </h3>
                      <SeverityBadge severity={alert.severity} />
                    </div>

                    <p className="mt-1 text-sm font-medium text-slate-600">
                      {alert.facility}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      {alert.detail}
                    </p>

                    <button className="mt-4 flex items-center gap-1 text-sm font-semibold text-emerald-600">
                      Investigate
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </DashboardShell>
  )
}

/* -------------------------------------------------------------------------- */
/* MEDICINE INTELLIGENCE                                                      */
/* -------------------------------------------------------------------------- */

export function MedicineIntelligenceDashboard({
  navigate,
  activeView,
}: Props) {
  return (
    <DashboardShell
      activeView={activeView}
      navigate={navigate}
    >
      <PageHeader
        icon={Pill}
        title="Medicine Shortage Intelligence"
        subtitle="Identify facilities at risk of medicine shortages and recommend redistribution before stockouts occur."
        badge="Supply Intelligence"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Pill}
          label="Medicines Monitored"
          value="128"
          helper="Across facilities"
          trend={6}
        />
        <StatCard
          icon={AlertTriangle}
          label="Critical Shortages"
          value="4"
          helper="Immediate attention"
          tone="red"
        />
        <StatCard
          icon={Clock3}
          label="Average Days Left"
          value="11.4"
          helper="Current stock coverage"
          tone="amber"
        />
        <StatCard
          icon={RefreshCw}
          label="Redistributions"
          value="17"
          helper="Recommended this month"
          trend={24}
          tone="blue"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SectionTitle
          icon={Pill}
          title="Medicine Risk Table"
          subtitle="Days left is calculated from current stock and estimated daily demand."
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-3 py-3">Medicine</th>
                <th className="px-3 py-3">Facility</th>
                <th className="px-3 py-3">Stock</th>
                <th className="px-3 py-3">Daily Demand</th>
                <th className="px-3 py-3">Days Left</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Suggested Redistribution</th>
              </tr>
            </thead>

            <tbody>
              {medicines.map((item) => (
                <tr
                  key={`${item.medicine}-${item.facility}`}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="px-3 py-4 font-semibold text-slate-800">
                    {item.medicine}
                  </td>
                  <td className="px-3 py-4 text-sm text-slate-600">
                    {item.facility}
                  </td>
                  <td className="px-3 py-4 text-sm text-slate-600">
                    {item.stock}
                  </td>
                  <td className="px-3 py-4 text-sm text-slate-600">
                    {item.demand}
                  </td>
                  <td className="px-3 py-4">
                    <span
                      className={`font-bold ${
                        item.days <= 4
                          ? 'text-red-600'
                          : item.days <= 10
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                      }`}
                    >
                      {item.days} days
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <SeverityBadge severity={item.status} />
                  </td>
                  <td className="px-3 py-4 text-sm text-slate-600">
                    {item.redistribution}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SectionTitle
          icon={RefreshCw}
          title="Recommended Redistribution"
          subtitle="Move excess inventory to facilities with higher projected demand."
        />

        <div className="grid gap-4 md:grid-cols-3">
          {redistribution.map((item) => (
            <div
              key={`${item.medicine}-${item.to}`}
              className="rounded-2xl border border-slate-200 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">
                  {item.medicine}
                </span>
                <SeverityBadge severity={item.urgency} />
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="rounded-lg bg-slate-100 px-2 py-1">
                  {item.from}
                </span>
                <ArrowRight size={16} className="text-slate-400" />
                <span className="rounded-lg bg-emerald-50 px-2 py-1 text-emerald-700">
                  {item.to}
                </span>
              </div>

              <p className="mt-4 text-sm text-slate-500">
                Recommended quantity:{' '}
                <strong className="text-slate-800">
                  {item.quantity}
                </strong>
              </p>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}

/* -------------------------------------------------------------------------- */
/* WORKFORCE INTELLIGENCE                                                     */
/* -------------------------------------------------------------------------- */

export function WorkforceIntelligenceDashboard({
  navigate,
  activeView,
}: Props) {
  return (
    <DashboardShell
      activeView={activeView}
      navigate={navigate}
    >
      <PageHeader
        icon={Users}
        title="Healthcare Workforce Intelligence"
        subtitle="Understand doctor availability, specialist gaps, and communities affected by workforce shortages."
        badge="Workforce Analytics"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Doctors Available"
          value="72%"
          helper="Current availability"
          trend={4}
        />
        <StatCard
          icon={Clock3}
          label="Limited Availability"
          value="18%"
          helper="Reduced capacity"
          tone="amber"
        />
        <StatCard
          icon={AlertTriangle}
          label="Unavailable"
          value="10%"
          helper="Immediate workforce gap"
          tone="red"
        />
        <StatCard
          icon={Stethoscope}
          label="Specialist Gaps"
          value="11"
          helper="Across monitored areas"
          tone="purple"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle
            icon={Users}
            title="Doctor Availability"
          />

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={workforceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={4}
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#f59e0b" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle
            icon={Stethoscope}
            title="Specialist Gaps"
            subtitle="Priority based on unmet demand"
          />

          <div className="space-y-4">
            {specialistGaps.map((item) => (
              <div
                key={item.specialist}
                className="rounded-xl border border-slate-100 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {item.specialist}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.affected} affected
                    </p>
                  </div>

                  <SeverityBadge severity={item.level} />
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-slate-500">
                      Unmet demand
                    </span>
                    <span className="font-semibold text-slate-700">
                      {item.demand}%
                    </span>
                  </div>
                  <Progress value={item.demand} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SectionTitle
          icon={MapPin}
          title="Demand vs Workforce"
          subtitle="High-demand villages requiring additional workforce capacity"
        />

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={demandData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="village" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar
                dataKey="demand"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardShell>
  )
}

/* -------------------------------------------------------------------------- */
/* FACILITY PERFORMANCE                                                       */
/* -------------------------------------------------------------------------- */

export function FacilityPerformanceDashboard({
  navigate,
  activeView,
}: Props) {
  const [selectedFacility, setSelectedFacility] = useState(
    facilities[0]
  )

  const averageScore = Math.round(
    facilities.reduce((sum, item) => sum + item.score, 0) /
      facilities.length
  )

  return (
    <DashboardShell
      activeView={activeView}
      navigate={navigate}
    >
      <PageHeader
        icon={Building2}
        title="Facility Performance Dashboard"
        subtitle="Compare PHCs and CHCs using accessibility, workforce, medicine, waiting time, service availability and data reliability."
        badge="Facility Intelligence"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Building2}
          label="Facilities Monitored"
          value={facilities.length}
          helper="PHCs and CHCs"
        />
        <StatCard
          icon={Target}
          label="Average Score"
          value={`${averageScore}/100`}
          helper="Overall performance"
          trend={7}
        />
        <StatCard
          icon={Users}
          label="Doctor Availability"
          value="72%"
          helper="Across facilities"
        />
        <StatCard
          icon={Pill}
          label="Medicine Availability"
          value="76%"
          helper="Average availability"
          tone="blue"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle
            icon={Building2}
            title="Facilities"
          />

          <div className="space-y-3">
            {facilities.map((facility) => (
              <button
                key={facility.name}
                onClick={() => setSelectedFacility(facility)}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  selectedFacility.name === facility.name
                    ? 'border-emerald-300 bg-emerald-50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {facility.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {facility.type}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-900">
                      {facility.score}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      SCORE
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle
            icon={Activity}
            title={selectedFacility.name}
            subtitle={selectedFacility.type}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['Doctor availability', selectedFacility.doctor],
              ['Medicine availability', selectedFacility.medicine],
              ['Service availability', selectedFacility.service],
              ['Data reliability', selectedFacility.reliability],
            ].map(([label, value]) => (
              <div
                key={label as string}
                className="rounded-xl bg-slate-50 p-4"
              >
                <div className="mb-2 flex justify-between">
                  <span className="text-sm text-slate-600">
                    {label}
                  </span>
                  <strong className="text-slate-900">
                    {value}%
                  </strong>
                </div>

                <Progress value={value as number} />
              </div>
            ))}

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Average waiting time
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {selectedFacility.waiting} min
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Patient load
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {selectedFacility.load}%
              </p>
              <div className="mt-2">
                <Progress value={selectedFacility.load} />
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-emerald-600" size={20} />
              <div>
                <p className="font-semibold text-emerald-800">
                  Overall Facility Score
                </p>
                <p className="text-sm text-emerald-700">
                  {selectedFacility.score}/100 based on current indicators.
                </p>
              </div>

              <div className="ml-auto text-3xl font-bold text-emerald-700">
                {selectedFacility.score}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}

/* -------------------------------------------------------------------------- */
/* MEDICAL CAMP PLANNING                                                      */
/* -------------------------------------------------------------------------- */

export function MedicalCampPlanningDashboard({
  navigate,
  activeView,
}: Props) {
  const [scheduled, setScheduled] = useState<string[]>([])

  const totalBeneficiaries = useMemo(
    () =>
      campRecommendations.reduce(
        (sum, item) => sum + item.beneficiaries,
        0
      ),
    []
  )

  return (
    <DashboardShell
      activeView={activeView}
      navigate={navigate}
    >
      <PageHeader
        icon={Calendar}
        title="Medical Camp Planning"
        subtitle="Automatically identify villages where medical camps can have the highest impact using healthcare demand, workforce gaps and accessibility."
        badge="AI Recommendations"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Calendar}
          label="Recommended Camps"
          value={campRecommendations.length}
          helper="Priority locations"
          tone="purple"
        />
        <StatCard
          icon={Users}
          label="Potential Beneficiaries"
          value={totalBeneficiaries}
          helper="Across recommendations"
          trend={19}
        />
        <StatCard
          icon={Target}
          label="Highest Gap Score"
          value="86/100"
          helper="Village A"
          tone="red"
        />
        <StatCard
          icon={TrendingUp}
          label="Camp Reach"
          value="+24%"
          helper="Projected improvement"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle
            icon={Calendar}
            title="Camp Activity Trend"
          />

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={campTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="camps"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Camps"
                />
                <Line
                  type="monotone"
                  dataKey="beneficiaries"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="Beneficiaries"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle
            icon={Brain}
            title="Recommendation Logic"
            subtitle="Factors used to rank villages"
          />

          <div className="space-y-3">
            {[
              ['Healthcare demand', '35%'],
              ['Specialist gap', '25%'],
              ['Distance/access', '20%'],
              ['Transport availability', '10%'],
              ['Population impact', '10%'],
            ].map(([factor, weight]) => (
              <div
                key={factor}
                className="flex items-center justify-between rounded-xl bg-slate-50 p-3"
              >
                <span className="text-sm text-slate-700">
                  {factor}
                </span>
                <span className="font-semibold text-emerald-600">
                  {weight}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {campRecommendations.map((camp) => {
          const isScheduled = scheduled.includes(camp.village)

          return (
            <div
              key={camp.village}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-bold text-slate-900">
                      {camp.village}
                    </h3>
                    <SeverityBadge severity={camp.priority} />
                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                      Gap Score {camp.gap}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">
                        Population
                      </p>
                      <p className="mt-1 font-bold text-slate-900">
                        {camp.population.toLocaleString()}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">
                        Estimated beneficiaries
                      </p>
                      <p className="mt-1 font-bold text-slate-900">
                        {camp.beneficiaries}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">
                        Priority
                      </p>
                      <p className="mt-1 font-bold text-red-600">
                        {camp.priority}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="mb-2 text-sm font-semibold text-slate-700">
                      Identified problems
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {camp.problems.map((problem) => (
                        <span
                          key={problem}
                          className="rounded-lg bg-red-50 px-3 py-1.5 text-xs text-red-700"
                        >
                          {problem}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="mb-2 text-sm font-semibold text-slate-700">
                      Recommended departments
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {camp.departments.map((department) => (
                        <span
                          key={department}
                          className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700"
                        >
                          {department}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:w-48">
                  <button
                    onClick={() =>
                      setScheduled((current) =>
                        current.includes(camp.village)
                          ? current
                          : [...current, camp.village]
                      )
                    }
                    className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      isScheduled
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {isScheduled ? (
                      <>
                        <CheckCircle2 size={17} />
                        Camp Scheduled
                      </>
                    ) : (
                      <>
                        <Calendar size={17} />
                        Schedule Camp
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </DashboardShell>
  )
}

/* -------------------------------------------------------------------------- */
/* REFERRAL BOTTLENECK                                                        */
/* -------------------------------------------------------------------------- */

export function ReferralBottleneckDashboard({
  navigate,
  activeView,
}: Props) {
  return (
    <DashboardShell
      activeView={activeView}
      navigate={navigate}
    >
      <PageHeader
        icon={Route}
        title="Referral Bottleneck Dashboard"
        subtitle="Track PHC → CHC → District Hospital referrals and identify facilities causing dangerous delays."
        badge="Referral Intelligence"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          icon={Route}
          label="Total Referrals"
          value="184"
          helper="This month"
        />
        <StatCard
          icon={Clock3}
          label="Pending"
          value="21"
          helper="Awaiting action"
          tone="amber"
        />
        <StatCard
          icon={CheckCircle2}
          label="Accepted"
          value="163"
          helper="Successfully accepted"
        />
        <StatCard
          icon={Clock3}
          label="Avg Referral Time"
          value="16.2h"
          helper="Current average"
          tone="blue"
        />
        <StatCard
          icon={AlertTriangle}
          label="Delayed >24h"
          value="12"
          helper="Requires escalation"
          tone="red"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SectionTitle
          icon={TrendingUp}
          title="Referral Trend"
          subtitle="Total referrals versus delayed referrals"
        />

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={referralTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Total referrals"
              />
              <Line
                type="monotone"
                dataKey="delayed"
                stroke="#ef4444"
                strokeWidth={3}
                name="Delayed referrals"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SectionTitle
          icon={AlertTriangle}
          title="Facilities Causing Bottlenecks"
          subtitle="Facilities with high referral volume, delays or recurring issues"
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-3 py-3">Facility</th>
                <th className="px-3 py-3">Referrals</th>
                <th className="px-3 py-3">Pending</th>
                <th className="px-3 py-3">Accepted</th>
                <th className="px-3 py-3">Avg Time</th>
                <th className="px-3 py-3">Delayed</th>
                <th className="px-3 py-3">Primary Cause</th>
              </tr>
            </thead>

            <tbody>
              {referralFacilities.map((item) => (
                <tr
                  key={item.facility}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="px-3 py-4 font-semibold text-slate-800">
                    {item.facility}
                  </td>
                  <td className="px-3 py-4">{item.referrals}</td>
                  <td className="px-3 py-4 text-amber-600">
                    {item.pending}
                  </td>
                  <td className="px-3 py-4 text-emerald-600">
                    {item.accepted}
                  </td>
                  <td className="px-3 py-4">{item.avgTime}h</td>
                  <td className="px-3 py-4 font-semibold text-red-600">
                    {item.delayed}
                  </td>
                  <td className="px-3 py-4 text-sm text-slate-600">
                    {item.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          ['PHC', 'Primary care', 'Initial referral'],
          ['CHC', 'Specialist / secondary care', 'Intermediate referral'],
          ['District Hospital', 'Advanced care', 'Final escalation'],
        ].map(([title, subtitle, detail], index) => (
          <div
            key={title}
            className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                {index === 0 ? (
                  <Hospital size={20} />
                ) : index === 1 ? (
                  <Building2 size={20} />
                ) : (
                  <HeartPulse size={20} />
                )}
              </div>

              <div>
                <p className="font-bold text-slate-900">{title}</p>
                <p className="text-xs text-slate-500">{subtitle}</p>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-600">{detail}</p>
          </div>
        ))}
      </div>
    </DashboardShell>
  )
}

/* -------------------------------------------------------------------------- */
/* HEALTHCARE DEMAND                                                          */
/* -------------------------------------------------------------------------- */

export function HealthcareDemandDashboard({
  navigate,
  activeView,
}: Props) {
  return (
    <DashboardShell
      activeView={activeView}
      navigate={navigate}
    >
      <PageHeader
        icon={BarChart3}
        title="Healthcare Demand Dashboard"
        subtitle="Understand patient demand by village, department, age group and time period to guide resource allocation and camp planning."
        badge="Demand Intelligence"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Monthly Patients"
          value="12,840"
          helper="Across monitored facilities"
          trend={14}
        />
        <StatCard
          icon={TrendingUp}
          label="Demand Growth"
          value="+18%"
          helper="Compared with last month"
          tone="amber"
        />
        <StatCard
          icon={Stethoscope}
          label="Highest Demand"
          value="General Medicine"
          helper="86% demand index"
        />
        <StatCard
          icon={MapPin}
          label="High-Demand Villages"
          value="7"
          helper="Potential intervention areas"
          tone="red"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle
            icon={MapPin}
            title="Village Demand"
          />

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={villageDemand}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="village" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="pediatrics"
                  fill="#3b82f6"
                  name="Pediatrics"
                />
                <Bar
                  dataKey="women"
                  fill="#ec4899"
                  name="Women's Health"
                />
                <Bar
                  dataKey="general"
                  fill="#10b981"
                  name="General Medicine"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle
            icon={Stethoscope}
            title="Department Demand"
          />

          <div className="space-y-4">
            {departmentDemand.map((item) => (
              <div key={item.department}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">
                    {item.department}
                  </span>
                  <span className="font-bold text-slate-900">
                    {item.demand}%
                  </span>
                </div>
                <Progress value={item.demand} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle
            icon={Users}
            title="Demand by Age Group"
          />

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageDemand}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="demand"
                  fill="#8b5cf6"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle
            icon={TrendingUp}
            title="Weekly Patient Demand"
            subtitle="Daily patient volume"
          />

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyDemand}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="patients"
                  stroke="#10b981"
                  fill="#d1fae5"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
        <div className="flex items-start gap-3">
          <Brain className="mt-0.5 text-emerald-600" size={22} />
          <div>
            <h3 className="font-semibold text-emerald-900">
              Demand → Camp Recommendation
            </h3>
            <p className="mt-1 text-sm text-emerald-800">
              Rising pediatric demand in Village A and women's healthcare
              demand in Village B are contributing to their medical camp
              priority scores.
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}

/* -------------------------------------------------------------------------- */
/* DATA RELIABILITY                                                           */
/* -------------------------------------------------------------------------- */

export function DataReliabilityDashboard({
  navigate,
  activeView,
}: Props) {
  return (
    <DashboardShell
      activeView={activeView}
      navigate={navigate}
    >
      <PageHeader
        icon={Database}
        title="Data Reliability Dashboard"
        subtitle="Measure how fresh, verified and historically accurate healthcare facility data is before it is used for decisions."
        badge="Trust & Verification"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Database}
          label="Average Reliability"
          value="92%"
          helper="Across monitored facilities"
          trend={5}
        />
        <StatCard
          icon={RefreshCw}
          label="Fresh Data"
          value="87%"
          helper="Updated within threshold"
        />
        <StatCard
          icon={ShieldCheck}
          label="Verified Facilities"
          value="34"
          helper="Recently verified"
          tone="blue"
        />
        <StatCard
          icon={AlertTriangle}
          label="Needs Review"
          value="5"
          helper="Data quality warnings"
          tone="amber"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SectionTitle
          icon={Database}
          title="Facility Data Reliability"
          subtitle="Freshness, citizen reports and historical accuracy"
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-3 py-3">Facility</th>
                <th className="px-3 py-3">Reliability</th>
                <th className="px-3 py-3">Update Frequency</th>
                <th className="px-3 py-3">Last Verification</th>
                <th className="px-3 py-3">Citizen Reports</th>
                <th className="px-3 py-3">Historical Accuracy</th>
                <th className="px-3 py-3">Discrepancies</th>
                <th className="px-3 py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {reliabilityFacilities.map((item) => (
                <tr
                  key={item.facility}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="px-3 py-4 font-semibold text-slate-800">
                    {item.facility}
                  </td>
                  <td className="px-3 py-4 font-bold text-emerald-600">
                    {item.reliability}%
                  </td>
                  <td className="px-3 py-4 text-sm text-slate-600">
                    {item.frequency}
                  </td>
                  <td className="px-3 py-4 text-sm text-slate-600">
                    {item.verification}
                  </td>
                  <td className="px-3 py-4">{item.reports}</td>
                  <td className="px-3 py-4">
                    {item.historical}%
                  </td>
                  <td className="px-3 py-4 text-red-600">
                    {item.discrepancies}
                  </td>
                  <td className="px-3 py-4">
                    <SeverityBadge severity={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle
            icon={Clock3}
            title="Data Freshness Rules"
          />

          <div className="space-y-3">
            {[
              [
                'Doctor availability',
                'Warning after 30 minutes',
              ],
              [
                'Medicine stock',
                'Warning after 2 hours',
              ],
              [
                'Bed availability',
                'Warning after 15 minutes',
              ],
              [
                'Facility services',
                'Warning after 24 hours',
              ],
            ].map(([name, rule]) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
              >
                <span className="text-sm font-medium text-slate-700">
                  {name}
                </span>
                <span className="text-xs font-semibold text-amber-600">
                  {rule}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle
              className="mt-0.5 text-orange-600"
              size={22}
            />

            <div>
              <h3 className="font-semibold text-orange-900">
                Data Reliability Warning
              </h3>

              <p className="mt-2 text-sm leading-6 text-orange-800">
                PHC Baramati Rural has not verified doctor availability
                recently. The dashboard should not treat the current
                availability value as fully reliable until verification.
              </p>

              <button className="mt-4 flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white">
                <RefreshCw size={15} />
                Request Verification
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}

/* -------------------------------------------------------------------------- */
/* CITIZEN ACCESSIBILITY                                                      */
/* -------------------------------------------------------------------------- */

export function CitizenAccessibilityDashboard({
  navigate,
  activeView,
}: Props) {
  const totalEmergency = accessibilityVillages.reduce(
    (sum, item) => sum + item.emergency,
    0
  )

  const totalTeleconsultations = accessibilityVillages.reduce(
    (sum, item) => sum + item.tele,
    0
  )

  return (
    <DashboardShell
      activeView={activeView}
      navigate={navigate}
    >
      <PageHeader
        icon={MapPin}
        title="Citizen Accessibility Dashboard"
        subtitle="Measure whether citizens can actually reach and use healthcare services across rural and underserved communities."
        badge="Citizen Impact"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          icon={MapPin}
          label="Avg Travel Distance"
          value="13.9 km"
          helper="Current average"
          trend={-9}
          tone="blue"
        />
        <StatCard
          icon={Clock3}
          label="Avg Travel Time"
          value="33 min"
          helper="Current average"
          trend={-8}
        />
        <StatCard
          icon={Wifi}
          label="Teleconsultations"
          value={totalTeleconsultations}
          helper="Across villages"
          trend={17}
        />
        <StatCard
          icon={Ambulance}
          label="Emergency Requests"
          value={totalEmergency}
          helper="This month"
          tone="red"
        />
        <StatCard
          icon={Calendar}
          label="Camp Registrations"
          value="234"
          helper="This month"
          trend={22}
          tone="purple"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SectionTitle
          icon={TrendingDown}
          title="Accessibility Improvement"
          subtitle="Travel distance and time are declining as interventions expand."
        />

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={accessibilityTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="distance"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Distance (km)"
              />
              <Line
                type="monotone"
                dataKey="time"
                stroke="#10b981"
                strokeWidth={3}
                name="Time (min)"
              />
              <Line
                type="monotone"
                dataKey="tele"
                stroke="#8b5cf6"
                strokeWidth={3}
                name="Teleconsultations"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SectionTitle
          icon={MapPin}
          title="Village Accessibility"
          subtitle="Citizen-level access indicators"
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-3 py-3">Village</th>
                <th className="px-3 py-3">Distance</th>
                <th className="px-3 py-3">Travel Time</th>
                <th className="px-3 py-3">Teleconsultations</th>
                <th className="px-3 py-3">Emergency</th>
                <th className="px-3 py-3">Camp Registrations</th>
                <th className="px-3 py-3">Unsuccessful Visits</th>
                <th className="px-3 py-3">Feedback</th>
              </tr>
            </thead>

            <tbody>
              {accessibilityVillages.map((item) => (
                <tr
                  key={item.village}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="px-3 py-4 font-semibold text-slate-800">
                    {item.village}
                  </td>
                  <td className="px-3 py-4">
                    {item.distance} km
                  </td>
                  <td className="px-3 py-4">
                    {item.time} min
                  </td>
                  <td className="px-3 py-4 text-blue-600">
                    {item.tele}
                  </td>
                  <td className="px-3 py-4 text-red-600">
                    {item.emergency}
                  </td>
                  <td className="px-3 py-4 text-purple-600">
                    {item.camp}
                  </td>
                  <td className="px-3 py-4 text-orange-600">
                    {item.visits}
                  </td>
                  <td className="px-3 py-4 font-semibold text-emerald-600">
                    {item.feedback}/5
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600 w-fit">
            <Wifi size={20} />
          </div>
          <h3 className="mt-4 font-semibold text-slate-900">
            Teleconsultation
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Reduces unnecessary travel for citizens in remote villages.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="rounded-xl bg-purple-50 p-3 text-purple-600 w-fit">
            <Calendar size={20} />
          </div>
          <h3 className="mt-4 font-semibold text-slate-900">
            Medical Camps
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Brings targeted services closer to high-gap communities.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="rounded-xl bg-red-50 p-3 text-red-600 w-fit">
            <Ambulance size={20} />
          </div>
          <h3 className="mt-4 font-semibold text-slate-900">
            Emergency Access
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Tracks emergency requests and identifies areas requiring faster
            response.
          </p>
        </div>
      </div>
    </DashboardShell>
  )
}

/* -------------------------------------------------------------------------- */
/* DEFAULT EXPORT                                                             */
/* -------------------------------------------------------------------------- */

export default {
  EarlyWarningDashboard,
  MedicineIntelligenceDashboard,
  WorkforceIntelligenceDashboard,
  FacilityPerformanceDashboard,
  MedicalCampPlanningDashboard,
  ReferralBottleneckDashboard,
  HealthcareDemandDashboard,
  DataReliabilityDashboard,
  CitizenAccessibilityDashboard,
}