import Icon from '../components/Icon';
import Badge from '../components/Badge';
import StatCard from '../components/StatCard';
import AdminShell from '../components/AdminShell';

const STATS = [
  {
    label: 'TOTAL ESTABLISHMENTS',
    value: '1,248',
    sub: '+14 registered this month',
    subColor: '#16A34A',
    icon: 'establishments',
    iconColor: '#4F46E5',
    iconBg: '#EEF0FF',
  },
  {
    label: 'ACTIVE PERMITS',
    value: '987',
    sub: '79.1% compliance rate',
    subColor: '#8A8FA3',
    icon: 'check',
    iconColor: '#16A34A',
    iconBg: '#E7F7EC',
  },
  {
    label: 'EXPIRING SOON',
    value: '143',
    sub: 'Within 30 days',
    subColor: '#8A8FA3',
    icon: 'warning',
    iconColor: '#D97706',
    iconBg: '#FEF6E7',
  },
  {
    label: 'EXPIRED PERMITS',
    value: '118',
    sub: 'Need immediate action',
    subColor: '#E11D48',
    icon: 'close',
    iconColor: '#E11D48',
    iconBg: '#FDECEF',
  },
];

const APPLICATIONS = [
  { name: 'Jollibee San Carlos', type: 'Food Service', status: 'Active', date: 'May 21, 2026' },
  { name: 'Sunshine Eatery', type: 'Food Service', status: 'Active', date: 'May 22, 2026' },
  { name: 'Pala Sizzler', type: 'Food Service', status: 'Pending', date: 'May 23, 2026' },
  { name: "Carmel's Restaurant", type: 'Food Service', status: 'Expired', date: 'Jan 10, 2026' },
  { name: 'Mang Inasal San Carlos', type: 'Food Service', status: 'Expiring', date: 'May 28, 2026' },
  { name: 'Canton Station', type: 'Food Service', status: 'Active', date: 'May 20, 2026' },
];

const ACTIVITY = [
  { text: 'New permit issued – Jollibee San Carlos Branch', time: 'now', dot: '#16A34A' },
  { text: 'Renewal application – Sunshine Eatery submitted', time: '3m', dot: '#4F46E5' },
  { text: 'Inspection scheduled – Pala Sizzler · June 1', time: '5m', dot: '#4F46E5' },
  { text: "Permit Expired – Carmel's Restaurant lapsed", time: '30m', dot: '#E11D48' },
  { text: 'New establishment – Canton Station Registered', time: '1h', dot: '#16A34A' },
  { text: 'Inspection scheduled – Chowking · June 1', time: '2h', dot: '#4F46E5' },
];

const BARANGAYS = [
  { name: 'Barangay I', pct: 95, color: '#16A34A' },
  { name: 'Barangay II', pct: 90, color: '#16A34A' },
  { name: 'Barangay III', pct: 89, color: '#16A34A' },
  { name: 'Barangay IV', pct: 61, color: '#D97706' },
  { name: 'Barangay V', pct: 38, color: '#E11D48' },
];

const CHART = [
  { m: 'Jan', v: 55 },
  { m: 'Feb', v: 70 },
  { m: 'Mar', v: 62 },
  { m: 'Apr', v: 85 },
  { m: 'May', v: 140 },
  { m: 'Jun', v: 58 },
  { m: 'Jul', v: 40 },
  { m: 'Aug', v: 35 },
  { m: 'Sep', v: 30 },
];

function ApplicationsCard() {
  const max = APPLICATIONS.length;
  return (
    <div className="mb-4 rounded-xl border border-line bg-card p-4.5 md:p-[18px]">
      <p className="mb-3 text-[14.5px] font-bold text-ink">Recent Applications</p>

      {/* Desktop table */}
      <div className="hidden md:block">
        <div className="mb-1 flex border-b border-line pb-2">
          <span className="flex-[2.2] text-[10.5px] font-bold text-muted">Establishment</span>
          <span className="flex-[1.4] text-[10.5px] font-bold text-muted">Type</span>
          <span className="flex-1 text-[10.5px] font-bold text-muted">Status</span>
          <span className="flex-[1.2] text-right text-[10.5px] font-bold text-muted">Date</span>
        </div>
        {APPLICATIONS.map((item, idx) => (
          <div
            key={item.name}
            className={`flex items-center py-2.5 ${idx < max - 1 ? 'border-b border-line' : ''}`}
          >
            <span className="flex-[2.2] text-[12.5px] font-semibold text-ink">{item.name}</span>
            <span className="flex-[1.4] text-[12.5px] text-indigo">{item.type}</span>
            <div className="flex-1">
              <Badge status={item.status} />
            </div>
            <span className="flex-[1.2] text-right text-[12.5px] text-muted">{item.date}</span>
          </div>
        ))}
      </div>

      {/* Mobile stacked cards */}
      <div className="md:hidden">
        {APPLICATIONS.map((item, idx) => (
          <div key={item.name} className={`py-2.5 ${idx < max - 1 ? 'border-b border-line' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-ink">{item.name}</p>
                <p className="mt-0.5 text-[11px] text-indigo">{item.type}</p>
              </div>
              <div className="text-right">
                <Badge status={item.status} />
                <p className="mt-1.5 text-[10.5px] text-muted">{item.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartCard() {
  const max = Math.max(...CHART.map((c) => c.v));
  return (
    <div className="rounded-xl border border-line bg-card p-4.5 md:p-[18px]">
      <div className="flex items-center justify-between">
        <p className="text-[14.5px] font-bold text-ink">Permit Issuance Overview</p>
        <span className="rounded-full bg-indigo-light px-2.5 py-1 text-[11px] font-bold text-indigo">
          2026
        </span>
      </div>
      <div className="mt-4 flex h-40 items-end justify-between">
        {CHART.map((c) => (
          <div key={c.m} className="flex flex-1 flex-col items-center">
            <div
              className="w-3.5 rounded"
              style={{
                height: `${Math.max(4, (c.v / max) * 130)}px`,
                backgroundColor: c.m === 'May' ? '#4F46E5' : '#C7CBF5',
              }}
            />
            <span className="mt-2 text-[10px] text-muted">{c.m}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityCard() {
  return (
    <div className="mb-4 rounded-xl border border-line bg-card p-4.5 md:p-[18px]">
      <p className="mb-3 text-[14.5px] font-bold text-ink">Recent Activity</p>
      {ACTIVITY.map((item, idx) => (
        <div
          key={item.text}
          className={`flex items-center py-2.5 ${
            idx < ACTIVITY.length - 1 ? 'border-b border-line' : ''
          }`}
        >
          <span
            className="mr-2.5 h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: item.dot }}
          />
          <span className="flex-1 pr-2 text-[12.5px] text-ink">{item.text}</span>
          <span className="whitespace-nowrap text-[10.5px] text-muted">{item.time}</span>
        </div>
      ))}
    </div>
  );
}

function ComplianceCard() {
  return (
    <div className="rounded-xl border border-line bg-card p-4.5 md:p-[18px]">
      <p className="mb-3 text-[14.5px] font-bold text-ink">Compliance by Barangay</p>
      {BARANGAYS.map((item) => (
        <div key={item.name} className="mb-3.5">
          <div className="mb-1.5 flex justify-between">
            <span className="text-[12.5px] font-semibold text-ink">{item.name}</span>
            <span className="text-[12.5px] font-bold" style={{ color: item.color }}>
              {item.pct}%
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-line">
            <div
              className="h-1.5 rounded-full"
              style={{ width: `${item.pct}%`, backgroundColor: item.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  return (
    <AdminShell actionLabel="New Application">
      <div className="mb-4.5 mb-5">
        <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
        <p className="mt-1 text-[12.5px] text-muted">Welcome back, Admin</p>
      </div>

      <div className="mb-1 flex flex-wrap justify-between gap-4">
        {STATS.map((item) => (
          <StatCard key={item.label} item={item} />
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-4 lg:flex-row">
        <div className="lg:w-[62%]">
          <ApplicationsCard />
          <ChartCard />
        </div>
        <div className="lg:flex-1">
          <ActivityCard />
          <ComplianceCard />
        </div>
      </div>
    </AdminShell>
  );
}
