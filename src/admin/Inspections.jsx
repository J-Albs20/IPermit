import { useState } from 'react';
import Icon from '../components/Icon';
import AdminShell from '../components/AdminShell';

const STATS = [
  {
    label: 'TOTAL THIS YEAR',
    value: '342',
    sub: 'Since Jan 2026',
    subColor: '#8A8FA3',
    icon: 'clipboard',
    iconColor: '#4F46E5',
    iconBg: '#EEF0FF',
  },
  {
    label: 'SCHEDULED',
    value: '28',
    sub: 'Upcoming visits',
    subColor: '#8A8FA3',
    icon: 'flag',
    iconColor: '#D97706',
    iconBg: '#FEF6E7',
  },
  {
    label: 'PASSED',
    value: '287',
    sub: '84% pass rate',
    subColor: '#16A34A',
    icon: 'check',
    iconColor: '#16A34A',
    iconBg: '#E7F7EC',
  },
  {
    label: 'CONDITIONAL',
    value: '31',
    sub: 'Needs follow-up',
    subColor: '#8A8FA3',
    icon: 'warning',
    iconColor: '#D97706',
    iconBg: '#FEF6E7',
  },
];

const FILTERS = [
  { key: 'All', label: 'All 342' },
  { key: 'Scheduled', label: 'Scheduled 28' },
  { key: 'Ongoing', label: 'Ongoing 5' },
  { key: 'Passed', label: 'Passed 287' },
  { key: 'Conditional', label: 'Conditional 31' },
  { key: 'Failed', label: 'Failed 24' },
];

const TYPE_STYLES = {
  Routine: { bg: '#EEF0FF', color: '#4F46E5' },
  'Follow-up': { bg: '#FEF6E7', color: '#D97706' },
};

function scoreStyle(score) {
  if (score >= 85) return { bg: '#E7F7EC', color: '#16A34A' };
  if (score >= 60) return { bg: '#FEF6E7', color: '#D97706' };
  return { bg: '#FDECEF', color: '#E11D48' };
}

const INSPECTIONS = [
  {
    ref: 'INSP-2026-42',
    name: 'Jollibee San Carlos',
    address: 'Corners St, Brgy. IV',
    inspector: 'R. Dalisay',
    date: 'May 17, 2026',
    type: 'Routine',
    score: 94,
    status: 'Passed',
  },
  {
    ref: 'INSP-2026-41',
    name: 'Sunshine Eatery',
    address: 'Burgos Ave, Brgy. II',
    inspector: 'M. Vegas',
    date: 'May 16, 2026',
    type: 'Routine',
    score: 88,
    status: 'Passed',
  },
  {
    ref: 'INSP-2026-40',
    name: 'Pala Sizzler',
    address: 'Portales, Brgy. III',
    inspector: 'B. Leonar',
    date: 'May 15, 2026',
    type: 'Follow-up',
    score: 67,
    status: 'Conditional',
  },
  {
    ref: 'INSP-2026-39',
    name: "Carmel's Restaurant",
    address: 'Burgos Ave, Brgy. II',
    inspector: 'R. Dalisay',
    date: 'May 14, 2026',
    type: 'Routine',
    score: 41,
    status: 'Failed',
  },
  {
    ref: 'INSP-2026-38',
    name: 'Mang Inasal San Carlos',
    address: 'Alcona St, Brgy. IV',
    inspector: 'G. Garcia',
    date: 'May 12, 2026',
    type: 'Routine',
    score: 96,
    status: 'Passed',
  },
  {
    ref: 'INSP-2026-37',
    name: 'Canton Station',
    address: 'Pantalan, Brgy. IV',
    inspector: 'B. Leonar',
    date: 'May 11, 2026',
    type: 'Follow-up',
    score: 49,
    status: 'Failed',
  },
];

const UPCOMING = [
  { day: '20', month: 'MAY', name: 'Jollibee San Carlos', meta: 'R. Dalisay · 9:00 am' },
  { day: '21', month: 'MAY', name: 'Sunshine Eatery', meta: 'M. Vegas · 10:00 am' },
  { day: '21', month: 'MAY', name: 'Pala Sizzler', meta: 'B. Leonar · 1:00 pm' },
  { day: '22', month: 'MAY', name: "Carmel's Restaurant", meta: 'R. Dalisay · 2:00 pm' },
];

const INSPECTORS = [
  { name: 'G. Garcia', pct: 94, count: '11 inspections' },
  { name: 'R. Dalisay', pct: 92, count: '9 inspections' },
  { name: 'B. Leonar', pct: 85, count: '8 inspections' },
  { name: 'M. Vegas', pct: 78, count: '6 inspections' },
];

function StatCard({ item }) {
  return (
    <div className="w-[calc(50%-8px)] rounded-xl border border-line bg-card p-4 xl:w-[calc(25%-12px)]">
      <div
        className="mb-2.5 flex h-[30px] w-[30px] items-center justify-center rounded-lg"
        style={{ backgroundColor: item.iconBg }}
      >
        <Icon name={item.icon} size={15} color={item.iconColor} />
      </div>
      <p className="mb-1.5 text-[9.5px] font-medium tracking-wide text-muted">{item.label}</p>
      <p className="text-2xl font-bold text-ink">{item.value}</p>
      <p className="mt-1 text-[11px]" style={{ color: item.subColor }}>
        {item.sub}
      </p>
    </div>
  );
}

function FilterTabs({ active, onChange }) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {FILTERS.map((f) => {
        const isActive = f.key === active;
        return (
          <button
            key={f.key}
            onClick={() => onChange(f.key)}
            className={`rounded-lg border px-3.5 py-2 text-xs font-semibold ${
              isActive
                ? 'border-indigo bg-indigo text-white'
                : 'border-line bg-card text-muted hover:bg-bg'
            }`}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}

function TypePill({ type }) {
  const s = TYPE_STYLES[type] || TYPE_STYLES.Routine;
  return (
    <span
      className="inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[10.5px] font-bold"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {type}
    </span>
  );
}

function ScorePill({ score }) {
  const s = scoreStyle(score);
  return (
    <span
      className="inline-block rounded-full px-2.5 py-1 text-[11px] font-bold"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {score}
    </span>
  );
}

function InspectionsTable({ data }) {
  return (
    <div className="rounded-xl border border-line bg-card p-4.5 md:p-[18px]">
      <p className="mb-3 text-[14.5px] font-bold text-ink">Inspections</p>

      {/* Desktop table */}
      <div className="hidden lg:block">
        <div className="mb-1 flex border-b border-line pb-2">
          <span className="flex-1 text-[10.5px] font-bold text-muted">Ref No.</span>
          <span className="flex-[1.8] text-[10.5px] font-bold text-muted">Establishments</span>
          <span className="flex-[1.1] text-[10.5px] font-bold text-muted">Inspector</span>
          <span className="flex-[1.1] text-[10.5px] font-bold text-muted">Date</span>
          <span className="flex-1 text-[10.5px] font-bold text-muted">Type</span>
          <span className="flex-[0.8] text-[10.5px] font-bold text-muted">Score</span>
          <span className="flex-[0.8] text-right text-[10.5px] font-bold text-muted">Action</span>
        </div>
        {data.map((item, idx) => (
          <div
            key={item.ref}
            className={`flex items-center py-3 ${idx < data.length - 1 ? 'border-b border-line' : ''}`}
          >
            <span className="flex-1 text-[12.5px] font-bold text-indigo">{item.ref}</span>
            <div className="flex-[1.8]">
              <p className="text-[13px] font-semibold text-ink">{item.name}</p>
              <p className="mt-0.5 text-[10.5px] text-muted">{item.address}</p>
            </div>
            <span className="flex-[1.1] text-[12.5px] text-muted">{item.inspector}</span>
            <span className="flex-[1.1] text-[12.5px] text-muted">{item.date}</span>
            <div className="flex-1">
              <TypePill type={item.type} />
            </div>
            <div className="flex-[0.8]">
              <ScorePill score={item.score} />
            </div>
            <div className="flex flex-[0.8] items-center justify-end">
              <button>
                <Icon name="eye" size={15} color="#8A8FA3" />
              </button>
              <button className="ml-3">
                <Icon name="file" size={15} color="#8A8FA3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Compact stacked cards */}
      <div className="lg:hidden">
        {data.map((item, idx) => (
          <div key={item.ref} className={`py-3 ${idx < data.length - 1 ? 'border-b border-line' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-[12.5px] font-bold text-indigo">{item.ref}</p>
                <p className="mt-1 text-[13px] font-semibold text-ink">{item.name}</p>
                <p className="mt-0.5 text-[10.5px] text-muted">{item.address}</p>
                <p className="mt-1 text-[10.5px] text-muted">
                  {item.inspector} · {item.date}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <TypePill type={item.type} />
                  <ScorePill score={item.score} />
                </div>
              </div>
              <div className="ml-3 flex shrink-0 flex-col items-end">
                <button>
                  <Icon name="eye" size={14} color="#8A8FA3" />
                </button>
                <button className="mt-2.5">
                  <Icon name="file" size={14} color="#8A8FA3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UpcomingCard() {
  return (
    <div className="rounded-xl border border-line bg-card p-4">
      <p className="mb-3 text-[13px] font-bold text-ink">Upcoming This Week</p>
      {UPCOMING.map((u, idx) => (
        <div key={idx} className="mb-3 flex items-center last:mb-0">
          <div className="mr-3 flex w-10 shrink-0 flex-col items-center rounded-lg border border-line py-1">
            <span className="text-sm font-bold leading-none text-ink">{u.day}</span>
            <span className="mt-0.5 text-[9px] font-bold uppercase text-muted">{u.month}</span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-semibold text-ink">{u.name}</p>
            <p className="mt-0.5 text-[10.5px] text-muted">{u.meta}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function InspectorsCard() {
  return (
    <div className="mt-4 rounded-xl border border-line bg-card p-4">
      <p className="mb-3 text-[13px] font-bold text-ink">Inspectors This Month</p>
      {INSPECTORS.map((i) => (
        <div key={i.name} className="mb-3 flex items-center justify-between last:mb-0">
          <div>
            <p className="text-[12.5px] font-semibold text-ink">{i.name}</p>
            <p className="mt-0.5 text-[10.5px] text-muted">{i.count}</p>
          </div>
          <span className="text-[12.5px] font-bold text-green">{i.pct}%</span>
        </div>
      ))}
    </div>
  );
}

export default function Inspections() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered =
    activeFilter === 'All' ? INSPECTIONS : INSPECTIONS.filter((i) => i.status === activeFilter);

  return (
    <AdminShell actionLabel="Schedule Inspection">
      <h1 className="mb-5 text-2xl font-bold text-ink">Inspections</h1>

      <div className="mb-1 flex flex-wrap justify-between gap-4">
        {STATS.map((item) => (
          <StatCard key={item.label} item={item} />
        ))}
      </div>

      <div className="mt-4">
        <FilterTabs active={activeFilter} onChange={setActiveFilter} />

        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="lg:flex-1">
            <InspectionsTable data={filtered} />
          </div>
          <div className="lg:w-72">
            <UpcomingCard />
            <InspectorsCard />
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
