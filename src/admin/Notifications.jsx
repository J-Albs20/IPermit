import { useState } from 'react';
import Icon from '../components/Icon';
import AdminShell from '../components/AdminShell';

const FILTERS = [
  { key: 'All', label: 'All' },
  { key: 'Unread', label: 'Unread 5' },
  { key: 'Permits', label: 'Permits' },
  { key: 'Inspections', label: 'Inspections' },
  { key: 'System', label: 'System' },
];

const NOTIFICATIONS = [
  {
    icon: 'close',
    iconColor: '#E11D48',
    iconBg: '#FDECEF',
    title: 'Permit Expired – Pala Sizzler',
    desc: 'Health permit HP-2026-003 for Pala Sizzler (Barangay III) has expired as of Jan 10, 2026. Immediate action required.',
    time: '20 minutes ago',
    unread: true,
    category: 'Permits',
  },
  {
    icon: 'warning',
    iconColor: '#D97706',
    iconBg: '#FEF6E7',
    title: 'Permit Expiring Soon – Carmel\u2019s Restaurant',
    desc: 'Health permit HP-2026-004 for Carmel\u2019s Restaurant (Barangay II) will expire on May 28, 2026. Renewal required.',
    time: '2 hours ago',
    unread: true,
    category: 'Permits',
  },
  {
    icon: 'check',
    iconColor: '#16A34A',
    iconBg: '#E7F7EC',
    title: 'New Permit Issued – Jollibee San Carlos',
    desc: 'Health permit HP-2026-001 has been successfully issued to Jollibee San Carlos Branch. Valid until Dec 31, 2026.',
    time: '3 hours ago',
    unread: true,
    category: 'Permits',
  },
  {
    icon: 'clipboard',
    iconColor: '#4F46E5',
    iconBg: '#EEF0FF',
    title: 'Inspection Scheduled – Pala Sizzler',
    desc: 'A follow-up inspection has been scheduled for Pala Sizzler on June 1, 2026 at 10:00 AM. Inspector: B. Leonar.',
    time: '5 hours ago',
    unread: true,
    category: 'Inspections',
  },
  {
    icon: 'establishments',
    iconColor: '#8A8FA3',
    iconBg: '#F3F4F8',
    title: 'New Establishment Registered – Canton Station',
    desc: 'Canton Station (Pantalan, Barangay IV) has been registered in the system. Permit application is pending review.',
    time: '1 day ago',
    unread: true,
    category: 'Permits',
  },
  {
    icon: 'refresh',
    iconColor: '#16A34A',
    iconBg: '#E7F7EC',
    title: 'Renewal Application Submitted – Sunshine Eatery',
    desc: 'Sunshine Eatery has submitted their permit renewal application with all required documents. Review pending.',
    time: '2 days ago',
    unread: false,
    category: 'Permits',
  },
  {
    icon: 'clipboard',
    iconColor: '#E11D48',
    iconBg: '#FDECEF',
    title: 'Inspection Completed – Jollibee San Carlos',
    desc: 'Routine inspection of Jollibee San Carlos (INSP-2026-42) has been completed. Score: 94/100. Status: Passed.',
    time: '5 days ago',
    unread: false,
    category: 'Inspections',
  },
  {
    icon: 'warning',
    iconColor: '#4B5160',
    iconBg: '#ECEDF3',
    title: 'System Alert – 143 Permits Expiring This Month',
    desc: '143 health permits are due to expire within the next 30 days. Please review and notify establishments for renewal.',
    time: '1 week ago',
    unread: false,
    category: 'System',
  },
];

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

function NotificationRow({ item }) {
  return (
    <div className="flex items-start gap-3 border-b border-line px-4.5 py-4 last:border-b-0 md:px-[18px]">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: item.iconBg }}
      >
        <Icon name={item.icon} size={16} color={item.iconColor} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-ink">{item.title}</p>
        <p className="mt-1 text-[12px] leading-relaxed text-muted">{item.desc}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2 pl-2">
        <span className="whitespace-nowrap text-[10.5px] text-muted">{item.time}</span>
        {item.unread && <span className="h-2 w-2 rounded-full bg-indigo" />}
      </div>
    </div>
  );
}

export default function Notifications() {
  const [items, setItems] = useState(NOTIFICATIONS);
  const [active, setActive] = useState('All');

  const filtered = items.filter((n) => {
    if (active === 'All') return true;
    if (active === 'Unread') return n.unread;
    return n.category === active;
  });

  const unreadCount = items.filter((n) => n.unread).length;

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <AdminShell actionLabel="Mark All Read" actionIcon="check" onActionPress={markAllRead}>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-ink">Notifications</h1>
        <p className="mt-1 text-[12.5px] text-muted">
          You have {unreadCount} unread notification{unreadCount === 1 ? '' : 's'}
        </p>
      </div>

      <FilterTabs active={active} onChange={setActive} />

      <div className="rounded-xl border border-line bg-card">
        {filtered.length === 0 ? (
          <p className="p-6 text-center text-[12.5px] text-muted">No notifications here.</p>
        ) : (
          filtered.map((item, idx) => <NotificationRow key={idx} item={item} />)
        )}
      </div>
    </AdminShell>
  );
}
