import { useState } from 'react';
import Icon from '../components/Icon';
import StatCard from '../components/StatCard';
import AdminShell from '../components/AdminShell';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';
import { useData } from '../context/DataContext';
import { ESTABLISHMENT_OPTIONS } from '../data/seed';

const STATUS_STYLES = {
  Valid: { bg: '#E7F7EC', color: '#16A34A' },
  Expired: { bg: '#FDECEF', color: '#E11D48' },
  'Pending Confirmation': { bg: '#FEF6E7', color: '#D97706' },
};

const FILTERS = ['All', 'Pending Confirmation', 'Valid', 'Expired'];

const EMPTY_FORM = { holder: '', type: 'Personal', establishment: '' };

export function StatusPill({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.Valid;
  return (
    <span
      className="inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[10.5px] font-bold"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {status}
    </span>
  );
}

function FilterTabs({ active, onChange, counts }) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`rounded-lg border px-3.5 py-2 text-xs font-semibold ${
            active === f
              ? 'border-indigo bg-indigo text-white'
              : 'border-line bg-card text-muted hover:bg-bg'
          }`}
        >
          {f} {counts[f]}
        </button>
      ))}
    </div>
  );
}

export default function HealthCards() {
  const { healthCards, addHealthCard, confirmHealthCard } = useData();
  const [activeFilter, setActiveFilter] = useState('All');
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const { showToast, Toast } = useToast();

  const filtered = healthCards.filter((c) => activeFilter === 'All' || c.status === activeFilter);

  const counts = {
    All: healthCards.length,
    'Pending Confirmation': healthCards.filter((c) => c.status === 'Pending Confirmation').length,
    Valid: healthCards.filter((c) => c.status === 'Valid').length,
    Expired: healthCards.filter((c) => c.status === 'Expired').length,
  };

  const STATS = [
    {
      label: 'TOTAL HEALTH CARDS',
      value: String(healthCards.length),
      sub: 'Personal + Employee',
      subColor: '#8A8FA3',
      icon: 'healthCard',
      iconColor: '#4F46E5',
      iconBg: '#EEF0FF',
    },
    {
      label: 'PENDING CONFIRMATION',
      value: String(counts['Pending Confirmation']),
      sub: 'Awaiting admin review',
      subColor: '#8A8FA3',
      icon: 'clipboard',
      iconColor: '#D97706',
      iconBg: '#FEF6E7',
    },
    {
      label: 'VALID',
      value: String(counts.Valid),
      sub: 'Currently active',
      subColor: '#16A34A',
      icon: 'check',
      iconColor: '#16A34A',
      iconBg: '#E7F7EC',
    },
    {
      label: 'EXPIRED',
      value: String(counts.Expired),
      sub: 'Needs renewal',
      subColor: '#E11D48',
      icon: 'close',
      iconColor: '#E11D48',
      iconBg: '#FDECEF',
    },
  ];

  const onConfirm = (id) => {
    const card = healthCards.find((c) => c.id === id);
    confirmHealthCard(id);
    showToast(`${card?.holder}'s health card confirmed and marked Valid.`);
  };

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setCreating(true);
  };

  const saveCreate = () => {
    if (!form.holder.trim()) {
      showToast('Enter a holder name first.');
      return;
    }
    addHealthCard(form);
    showToast(`Health card application for ${form.holder} recorded — awaiting confirmation.`);
    setCreating(false);
  };

  return (
    <AdminShell actionLabel="New Health Card" onActionPress={openCreate}>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-ink">Health Cards</h1>
        <p className="mt-1 text-[12.5px] text-muted">
          Every business must have a valid health card on file for each employee before a
          sanitary permit can be issued or renewed.
        </p>
      </div>

      <div className="mb-1 flex flex-wrap justify-between gap-4">
        {STATS.map((item) => (
          <StatCard key={item.label} item={item} />
        ))}
      </div>

      <div className="mt-4">
        <FilterTabs active={activeFilter} onChange={setActiveFilter} counts={counts} />

        <div className="rounded-xl border border-line bg-card p-4.5 md:p-[18px]">
          <p className="mb-3 text-[14.5px] font-bold text-ink">Health Card Records</p>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto lg:block">
            <div className="mb-1 flex min-w-[820px] border-b border-line pb-2">
              <span className="flex-1 text-[10.5px] font-bold text-muted">Card No.</span>
              <span className="flex-[1.4] text-[10.5px] font-bold text-muted">Holder</span>
              <span className="flex-1 text-[10.5px] font-bold text-muted">Type</span>
              <span className="flex-[1.4] text-[10.5px] font-bold text-muted">Establishment</span>
              <span className="flex-1 text-[10.5px] font-bold text-muted">Expires</span>
              <span className="flex-1 text-[10.5px] font-bold text-muted">Status</span>
              <span className="flex-[1.1] text-right text-[10.5px] font-bold text-muted">Action</span>
            </div>
            {filtered.map((c, idx) => (
              <div
                key={c.id}
                className={`flex min-w-[820px] items-center py-3 ${
                  idx < filtered.length - 1 ? 'border-b border-line' : ''
                }`}
              >
                <span className="flex-1 text-[12.5px] font-bold text-indigo">{c.cardNo}</span>
                <span className="flex-[1.4] text-[12.5px] font-semibold text-ink">{c.holder}</span>
                <span className="flex-1 text-[12.5px] text-muted">{c.type}</span>
                <span className="flex-[1.4] text-[12.5px] text-muted">
                  {c.establishment || '—'}
                </span>
                <span className="flex-1 text-[12.5px] text-muted">{c.expires}</span>
                <div className="flex-1">
                  <StatusPill status={c.status} />
                </div>
                <div className="flex flex-[1.1] justify-end">
                  {c.status === 'Pending Confirmation' ? (
                    <button
                      onClick={() => onConfirm(c.id)}
                      className="flex items-center rounded-lg border border-green bg-green-bg px-2.5 py-1.5 text-[11px] font-semibold text-green"
                    >
                      <Icon name="check" size={13} color="#16A34A" />
                      <span className="ml-1">Confirm</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-muted">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Compact stacked cards */}
          <div className="lg:hidden">
            {filtered.map((c, idx) => (
              <div key={c.id} className={`py-3 ${idx < filtered.length - 1 ? 'border-b border-line' : ''}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[12.5px] font-bold text-indigo">{c.cardNo}</p>
                    <p className="mt-1 text-[13px] font-semibold text-ink">{c.holder}</p>
                    <p className="mt-0.5 text-[10.5px] text-muted">
                      {c.type}
                      {c.establishment ? ` · ${c.establishment}` : ''}
                    </p>
                    <p className="mt-0.5 text-[10.5px] text-muted">Expires {c.expires}</p>
                  </div>
                  <StatusPill status={c.status} />
                </div>
                {c.status === 'Pending Confirmation' && (
                  <button
                    onClick={() => onConfirm(c.id)}
                    className="mt-2.5 flex items-center rounded-lg border border-green bg-green-bg px-2.5 py-1.5 text-[11px] font-semibold text-green"
                  >
                    <Icon name="check" size={13} color="#16A34A" />
                    <span className="ml-1">Confirm</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="py-6 text-center text-[12.5px] text-muted">No health cards match this filter.</p>
          )}
        </div>
      </div>

      {/* New health card modal */}
      {creating && (
        <Modal
          title="New Health Card"
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
          <p className="mb-4 text-[12px] text-muted">
            New applications are recorded as <b>Pending Confirmation</b> until an admin staff
            member reviews and confirms them.
          </p>
          <div className="grid grid-cols-1 gap-4">
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
            <div>
              <label className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-wide text-muted">
                Card Type
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value, establishment: '' }))}
                className="w-full rounded-lg border border-line px-3 py-2.5 text-[13px] text-ink focus:outline-none focus:ring-1 focus:ring-indigo"
              >
                <option value="Personal">Personal</option>
                <option value="Employee">Employee (linked to a business)</option>
              </select>
            </div>
            {form.type === 'Employee' && (
              <div>
                <label className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-wide text-muted">
                  Establishment
                </label>
                <select
                  value={form.establishment}
                  onChange={(e) => setForm((f) => ({ ...f, establishment: e.target.value }))}
                  className="w-full rounded-lg border border-line px-3 py-2.5 text-[13px] text-ink focus:outline-none focus:ring-1 focus:ring-indigo"
                >
                  <option value="">Select establishment…</option>
                  {ESTABLISHMENT_OPTIONS.map((e) => (
                    <option key={e}>{e}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </Modal>
      )}

      {Toast}
    </AdminShell>
  );
}
