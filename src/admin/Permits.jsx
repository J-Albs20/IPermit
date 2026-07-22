import { useState } from 'react';
import Icon from '../components/Icon';
import StatCard from '../components/StatCard';
import AdminShell from '../components/AdminShell';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';
import { useData } from '../context/DataContext';
import { getBusinessCompliance, getPersonalCompliance } from '../data/healthCards';
import { ESTABLISHMENT_OPTIONS } from '../data/seed';

const STATS = [
  {
    label: 'TOTAL ESTABLISHMENTS',
    value: '1,248',
    sub: '+34 this month',
    subColor: '#16A34A',
    icon: 'establishments',
    iconColor: '#4F46E5',
    iconBg: '#EEF0FF',
  },
  {
    label: 'ACTIVE PERMITS',
    value: '987',
    sub: '79 % compliance',
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

const STATUS_FILTERS = [
  { key: 'All', label: 'All' },
  { key: 'Active', label: 'Active' },
  { key: 'Expiring', label: 'Expiring' },
  { key: 'Expired', label: 'Expired' },
  { key: 'Pending', label: 'Pending' },
];
const CATEGORY_FILTERS = ['All', 'Personal', 'Business'];

const STATUS_ACTION = {
  Active: { icon: 'print', color: '#8A8FA3', label: 'Print' },
  Pending: { icon: 'checkCircle', color: '#16A34A', label: 'Approve' },
  Expired: { icon: 'download', color: '#4F46E5', label: 'Download' },
  Expiring: { icon: 'refresh', color: '#D97706', label: 'Renew' },
};

export function FilterTabs({ options, active, onChange, counts }) {
  return (
    <div className="mb-2 flex flex-wrap gap-2">
      {options.map((opt) => {
        const key = typeof opt === 'string' ? opt : opt.key;
        const label = typeof opt === 'string' ? opt : opt.label;
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`rounded-lg border px-3.5 py-2 text-xs font-semibold ${
              isActive
                ? 'border-indigo bg-indigo text-white'
                : 'border-line bg-card text-muted hover:bg-bg'
            }`}
          >
            {label} {counts && counts[key] !== undefined ? counts[key] : ''}
          </button>
        );
      })}
    </div>
  );
}

export function StatusPill({ status }) {
  const styles = {
    Active: { bg: '#E7F7EC', color: '#16A34A' },
    Valid: { bg: '#E7F7EC', color: '#16A34A' },
    Pending: { bg: '#FEF6E7', color: '#D97706' },
    'Pending Confirmation': { bg: '#FEF6E7', color: '#D97706' },
    Expired: { bg: '#FDECEF', color: '#E11D48' },
    Expiring: { bg: '#FEF6E7', color: '#D97706' },
  }[status] || { bg: '#F3F4F8', color: '#4B5160' };
  return (
    <span
      className="inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[10.5px] font-bold"
      style={{ backgroundColor: styles.bg, color: styles.color }}
    >
      {status}
    </span>
  );
}

export function CategoryPill({ category }) {
  const style =
    category === 'Personal'
      ? { bg: '#EEF0FF', color: '#4F46E5' }
      : { bg: '#F3F4F8', color: '#4B5160' };
  return (
    <span
      className="inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[10.5px] font-bold"
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      {category}
    </span>
  );
}

export function HealthCardPill({ permit, cards }) {
  if (permit.category === 'Business') {
    const { compliant, total, validCount } = getBusinessCompliance(permit.name, cards);
    return (
      <span
        className="inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[10.5px] font-bold"
        style={
          compliant
            ? { backgroundColor: '#E7F7EC', color: '#16A34A' }
            : { backgroundColor: '#FDECEF', color: '#E11D48' }
        }
        title={
          total === 0
            ? 'No employee health cards on file'
            : `${validCount}/${total} employee health cards valid`
        }
      >
        {total === 0 ? 'No records' : `${validCount}/${total} Valid`}
      </span>
    );
  }
  const { compliant } = getPersonalCompliance(permit.holder, cards);
  return (
    <span
      className="inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[10.5px] font-bold"
      style={
        compliant
          ? { backgroundColor: '#E7F7EC', color: '#16A34A' }
          : { backgroundColor: '#FDECEF', color: '#E11D48' }
      }
    >
      {compliant ? 'Valid' : 'Missing/Expired'}
    </span>
  );
}

export function expiresColor(status) {
  if (status === 'Expired') return '#E11D48';
  if (status === 'Expiring') return '#D97706';
  return '#8A8FA3';
}

export default function Permits() {
  const { permits, healthCards, approvePermit, renewPermit, addPermit } = useData();
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [viewing, setViewing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ category: 'Business', name: '', holder: '', owner: '' });
  const { showToast, Toast } = useToast();

  const filtered = permits.filter(
    (p) =>
      (statusFilter === 'All' || p.status === statusFilter) &&
      (categoryFilter === 'All' || p.category === categoryFilter)
  );

  const statusCounts = {
    All: permits.length,
    Active: permits.filter((p) => p.status === 'Active').length,
    Expiring: permits.filter((p) => p.status === 'Expiring').length,
    Expired: permits.filter((p) => p.status === 'Expired').length,
    Pending: permits.filter((p) => p.status === 'Pending').length,
  };

  const runAction = (permit) => {
    if (permit.status === 'Pending') {
      const result = approvePermit(permit.id);
      showToast(result.message);
      return;
    }
    if (permit.status === 'Expiring') {
      const result = renewPermit(permit.id);
      showToast(result.message);
      return;
    }
    showToast(`${STATUS_ACTION[permit.status].label} action completed for ${permit.permitNo}.`);
  };

  const openCreate = () => {
    setForm({ category: 'Business', name: '', holder: '', owner: '' });
    setCreating(true);
  };

  const saveCreate = () => {
    const name = form.category === 'Business' ? form.name : form.holder;
    if (!name?.trim()) {
      showToast('Fill in the required name/holder field first.');
      return;
    }
    addPermit(form);
    showToast(`Sanitary Permit (${form.category}) application recorded for ${name}.`);
    setCreating(false);
  };

  return (
    <AdminShell actionLabel="Issue Permit" onActionPress={openCreate}>
      <h1 className="mb-5 text-2xl font-bold text-ink">Permits</h1>

      <div className="mb-1 flex flex-wrap justify-between gap-4">
        {STATS.map((item) => (
          <StatCard key={item.label} item={item} />
        ))}
      </div>

      <div className="mt-4">
        <FilterTabs options={CATEGORY_FILTERS} active={categoryFilter} onChange={setCategoryFilter} />
        <FilterTabs options={STATUS_FILTERS} active={statusFilter} onChange={setStatusFilter} counts={statusCounts} />

        <div className="rounded-xl border border-line bg-card p-4.5 md:p-[18px]">
          <p className="mb-3 text-[14.5px] font-bold text-ink">Permits</p>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto xl:block">
            <div className="mb-1 flex min-w-[1000px] border-b border-line pb-2">
              <span className="flex-1 text-[10.5px] font-bold text-muted">Permit No.</span>
              <span className="flex-[1.6] text-[10.5px] font-bold text-muted">Establishment / Holder</span>
              <span className="flex-[0.9] text-[10.5px] font-bold text-muted">Category</span>
              <span className="flex-[1.1] text-[10.5px] font-bold text-muted">Health Card</span>
              <span className="flex-1 text-[10.5px] font-bold text-muted">Expires</span>
              <span className="flex-1 text-[10.5px] font-bold text-muted">Status</span>
              <span className="flex-[0.9] text-right text-[10.5px] font-bold text-muted">Action</span>
            </div>
            {filtered.map((item, idx) => {
              const action = STATUS_ACTION[item.status] || STATUS_ACTION.Active;
              const isEmph = item.status === 'Expired' || item.status === 'Expiring';
              return (
                <div
                  key={item.permitNo}
                  className={`flex min-w-[1000px] items-center py-3 ${
                    idx < filtered.length - 1 ? 'border-b border-line' : ''
                  }`}
                >
                  <span className="flex-1 text-[12.5px] font-bold text-indigo">{item.permitNo}</span>
                  <div className="flex-[1.6]">
                    <p className="text-[13px] font-semibold text-ink">{item.name}</p>
                    <p className="mt-0.5 text-[10.5px] text-muted">
                      {item.category === 'Business' ? item.address : `Owner: ${item.holder}`}
                    </p>
                  </div>
                  <div className="flex-[0.9]">
                    <CategoryPill category={item.category} />
                  </div>
                  <div className="flex-[1.1]">
                    <HealthCardPill permit={item} cards={healthCards} />
                  </div>
                  <span
                    className="flex-1 text-[12.5px]"
                    style={{ color: expiresColor(item.status), fontWeight: isEmph ? 700 : 400 }}
                  >
                    {item.expires}
                  </span>
                  <div className="flex-1">
                    <StatusPill status={item.status} />
                  </div>
                  <div className="flex flex-[0.9] items-center justify-end">
                    <button onClick={() => setViewing(item)}>
                      <Icon name="eye" size={15} color="#8A8FA3" />
                    </button>
                    <button className="ml-3" onClick={() => runAction(item)} title={action.label}>
                      <Icon name={action.icon} size={15} color={action.color} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Compact stacked cards below xl */}
          <div className="xl:hidden">
            {filtered.map((item, idx) => {
              const action = STATUS_ACTION[item.status] || STATUS_ACTION.Active;
              return (
                <div key={item.permitNo} className={`py-3 ${idx < filtered.length - 1 ? 'border-b border-line' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-[12.5px] font-bold text-indigo">{item.permitNo}</p>
                      <p className="mt-1 text-[13px] font-semibold text-ink">{item.name}</p>
                      <p className="mt-0.5 text-[10.5px] text-muted">
                        {item.category === 'Business' ? item.address : `Owner: ${item.holder}`}
                      </p>
                      <p className="mt-1 text-[10.5px] text-muted">
                        Expires{' '}
                        <span
                          style={{
                            color: expiresColor(item.status),
                            fontWeight: item.status === 'Expired' || item.status === 'Expiring' ? 700 : 400,
                          }}
                        >
                          {item.expires}
                        </span>
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <CategoryPill category={item.category} />
                        <StatusPill status={item.status} />
                        <HealthCardPill permit={item} cards={healthCards} />
                      </div>
                    </div>
                    <div className="ml-3 flex shrink-0 flex-col items-end">
                      <button onClick={() => setViewing(item)}>
                        <Icon name="eye" size={14} color="#8A8FA3" />
                      </button>
                      <button className="mt-2.5" onClick={() => runAction(item)} title={action.label}>
                        <Icon name={action.icon} size={14} color={action.color} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <p className="py-6 text-center text-[12.5px] text-muted">No permits match this filter.</p>
          )}
        </div>
      </div>

      {/* View modal */}
      {viewing && (
        <Modal title={viewing.permitNo} onClose={() => setViewing(null)}>
          <div className="space-y-3 text-[13px]">
            <div className="flex justify-between border-b border-line pb-2">
              <span className="text-muted">{viewing.category === 'Business' ? 'Establishment' : 'Holder'}</span>
              <span className="font-medium text-ink">{viewing.name}</span>
            </div>
            <div className="flex justify-between border-b border-line pb-2">
              <span className="text-muted">Category</span>
              <CategoryPill category={viewing.category} />
            </div>
            <div className="flex justify-between border-b border-line pb-2">
              <span className="text-muted">Issued</span>
              <span className="font-medium text-ink">{viewing.issued}</span>
            </div>
            <div className="flex justify-between border-b border-line pb-2">
              <span className="text-muted">Expires</span>
              <span className="font-medium text-ink">{viewing.expires}</span>
            </div>
            <div className="flex justify-between border-b border-line pb-2">
              <span className="text-muted">Status</span>
              <StatusPill status={viewing.status} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Health Card Compliance</span>
              <HealthCardPill permit={viewing} cards={healthCards} />
            </div>
          </div>
        </Modal>
      )}

      {/* Create modal */}
      {creating && (
        <Modal
          title="Issue Permit"
          onClose={() => setCreating(false)}
          footer={
            <>
              <button
                onClick={() => setCreating(false)}
                className="rounded-lg border border-line px-4 py-2.5 text-[12.5px] font-semibold text-ink"
              >
                Cancel
              </button>
              <button
                onClick={saveCreate}
                className="rounded-lg bg-indigo px-4 py-2.5 text-[12.5px] font-semibold text-white"
              >
                Record Application
              </button>
            </>
          }
        >
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-wide text-muted">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full rounded-lg border border-line px-3 py-2.5 text-[13px] text-ink focus:outline-none focus:ring-1 focus:ring-indigo"
              >
                <option value="Business">Sanitary Permit (Business)</option>
                <option value="Personal">Sanitary Permit (Personal)</option>
              </select>
            </div>
            {form.category === 'Business' ? (
              <>
                <div>
                  <label className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-wide text-muted">
                    Establishment
                  </label>
                  <select
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-lg border border-line px-3 py-2.5 text-[13px] text-ink focus:outline-none focus:ring-1 focus:ring-indigo"
                  >
                    <option value="">Select establishment…</option>
                    {ESTABLISHMENT_OPTIONS.map((e) => (
                      <option key={e}>{e}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-wide text-muted">
                    Owner
                  </label>
                  <input
                    value={form.owner}
                    onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))}
                    className="w-full rounded-lg border border-line px-3 py-2.5 text-[13px] text-ink focus:outline-none focus:ring-1 focus:ring-indigo"
                  />
                </div>
                {form.name && (
                  <p className="text-[11.5px] text-muted">
                    Employee health card status:{' '}
                    <HealthCardPill permit={{ category: 'Business', name: form.name }} cards={healthCards} />
                  </p>
                )}
              </>
            ) : (
              <div>
                <label className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-wide text-muted">
                  Holder Name
                </label>
                <input
                  value={form.holder}
                  onChange={(e) => setForm((f) => ({ ...f, holder: e.target.value }))}
                  className="w-full rounded-lg border border-line px-3 py-2.5 text-[13px] text-ink focus:outline-none focus:ring-1 focus:ring-indigo"
                />
              </div>
            )}
            <p className="text-[11px] text-muted">
              New applications are recorded as <b>Pending</b>. Approving them will check health
              card compliance automatically.
            </p>
          </div>
        </Modal>
      )}

      {Toast}
    </AdminShell>
  );
}
