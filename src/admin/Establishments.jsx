import { useState } from 'react';
import Icon from '../components/Icon';
import Badge from '../components/Badge';
import StatCard from '../components/StatCard';
import AdminShell from '../components/AdminShell';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';
import { useData } from '../context/DataContext';
import { BARANGAY_OPTIONS } from '../data/seed';

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

const FILTERS = [
  { key: 'All', label: 'All' },
  { key: 'Active', label: 'Active' },
  { key: 'Expiring', label: 'Expiring' },
  { key: 'Expired', label: 'Expired' },
  { key: 'Pending', label: 'Pending' },
];

const STATUS_OPTIONS = ['Active', 'Pending', 'Expiring', 'Expired'];

const EMPTY_FORM = { name: '', address: '', owner: '', barangay: BARANGAY_OPTIONS[0], type: 'Food Service', status: 'Pending' };

function FilterTabs({ active, onChange, counts }) {
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
            {f.label} {counts[f.key]}
          </button>
        );
      })}
    </div>
  );
}

function FormFields({ form, setForm }) {
  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-wide text-muted">
          Establishment Name
        </label>
        <input
          value={form.name}
          onChange={update('name')}
          className="w-full rounded-lg border border-line px-3 py-2.5 text-[13px] text-ink focus:outline-none focus:ring-1 focus:ring-indigo"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-wide text-muted">
          Address
        </label>
        <input
          value={form.address}
          onChange={update('address')}
          className="w-full rounded-lg border border-line px-3 py-2.5 text-[13px] text-ink focus:outline-none focus:ring-1 focus:ring-indigo"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-wide text-muted">
          Owner
        </label>
        <input
          value={form.owner}
          onChange={update('owner')}
          className="w-full rounded-lg border border-line px-3 py-2.5 text-[13px] text-ink focus:outline-none focus:ring-1 focus:ring-indigo"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-wide text-muted">
          Type
        </label>
        <input
          value={form.type}
          onChange={update('type')}
          className="w-full rounded-lg border border-line px-3 py-2.5 text-[13px] text-ink focus:outline-none focus:ring-1 focus:ring-indigo"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-wide text-muted">
          Barangay
        </label>
        <select
          value={form.barangay}
          onChange={update('barangay')}
          className="w-full rounded-lg border border-line px-3 py-2.5 text-[13px] text-ink focus:outline-none focus:ring-1 focus:ring-indigo"
        >
          {BARANGAY_OPTIONS.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-wide text-muted">
          Status
        </label>
        <select
          value={form.status}
          onChange={update('status')}
          className="w-full rounded-lg border border-line px-3 py-2.5 text-[13px] text-ink focus:outline-none focus:ring-1 focus:ring-indigo"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function Establishments() {
  const { establishments, addEstablishment, updateEstablishment } = useData();
  const [activeFilter, setActiveFilter] = useState('All');
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const { showToast, Toast } = useToast();

  const filtered =
    activeFilter === 'All'
      ? establishments
      : establishments.filter((e) => e.status === activeFilter);

  const counts = {
    All: establishments.length,
    Active: establishments.filter((e) => e.status === 'Active').length,
    Expiring: establishments.filter((e) => e.status === 'Expiring').length,
    Expired: establishments.filter((e) => e.status === 'Expired').length,
    Pending: establishments.filter((e) => e.status === 'Pending').length,
  };

  const openEdit = (item) => {
    setForm(item);
    setEditing(item);
  };

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setCreating(true);
  };

  const saveEdit = () => {
    updateEstablishment(editing.id, form);
    showToast(`${form.name} updated.`);
    setEditing(null);
  };

  const saveCreate = () => {
    addEstablishment(form);
    showToast(`${form.name || 'New establishment'} added.`);
    setCreating(false);
  };

  const Row = ({ item, compact }) =>
    compact ? (
      <div className="py-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-ink">{item.name}</p>
            <p className="mt-0.5 text-[10.5px] text-muted">{item.address}</p>
            <p className="mt-1 text-[10.5px] text-muted">
              {item.owner} · {item.barangay}
            </p>
          </div>
          <div className="items-end text-right">
            <Badge status={item.status} />
            <div className="mt-2 flex justify-end">
              <button onClick={() => setViewing(item)}>
                <Icon name="eye" size={14} color="#8A8FA3" />
              </button>
              <button className="ml-2.5" onClick={() => openEdit(item)}>
                <Icon name="edit" size={14} color="#8A8FA3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="flex items-center py-3">
        <div className="flex-[2]">
          <p className="text-[13px] font-semibold text-ink">{item.name}</p>
          <p className="mt-0.5 text-[10.5px] text-muted">{item.address}</p>
        </div>
        <span className="flex-[1.3] text-[12.5px] text-muted">{item.owner}</span>
        <span className="flex-[1.2] text-[12.5px] text-muted">{item.barangay}</span>
        <span className="flex-[1.3] text-[12.5px] text-indigo">{item.type}</span>
        <div className="flex-1">
          <Badge status={item.status} />
        </div>
        <div className="flex flex-[0.8] items-center justify-end">
          <button onClick={() => setViewing(item)}>
            <Icon name="eye" size={15} color="#8A8FA3" />
          </button>
          <button className="ml-3" onClick={() => openEdit(item)}>
            <Icon name="edit" size={15} color="#8A8FA3" />
          </button>
        </div>
      </div>
    );

  return (
    <AdminShell actionLabel="New Establishment" onActionPress={openCreate}>
      <h1 className="mb-5 text-2xl font-bold text-ink">Establishments</h1>

      <div className="mb-1 flex flex-wrap justify-between gap-4">
        {STATS.map((item) => (
          <StatCard key={item.label} item={item} />
        ))}
      </div>

      <div className="mt-4">
        <FilterTabs active={activeFilter} onChange={setActiveFilter} counts={counts} />

        <div className="rounded-xl border border-line bg-card p-4.5 md:p-[18px]">
          <p className="mb-3 text-[14.5px] font-bold text-ink">Establishments</p>

          <div className="hidden md:block">
            <div className="mb-1 flex border-b border-line pb-2">
              <span className="flex-[2] text-[10.5px] font-bold text-muted">Establishment</span>
              <span className="flex-[1.3] text-[10.5px] font-bold text-muted">Owner</span>
              <span className="flex-[1.2] text-[10.5px] font-bold text-muted">Barangay</span>
              <span className="flex-[1.3] text-[10.5px] font-bold text-muted">Type</span>
              <span className="flex-1 text-[10.5px] font-bold text-muted">Status</span>
              <span className="flex-[0.8] text-right text-[10.5px] font-bold text-muted">Action</span>
            </div>
            {filtered.map((item, idx) => (
              <div key={item.id} className={idx < filtered.length - 1 ? 'border-b border-line' : ''}>
                <Row item={item} compact={false} />
              </div>
            ))}
          </div>

          <div className="md:hidden">
            {filtered.map((item, idx) => (
              <div key={item.id} className={idx < filtered.length - 1 ? 'border-b border-line' : ''}>
                <Row item={item} compact />
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="py-6 text-center text-[12.5px] text-muted">No establishments match this filter.</p>
          )}
        </div>
      </div>

      {/* View modal */}
      {viewing && (
        <Modal title={viewing.name} onClose={() => setViewing(null)}>
          <div className="space-y-3 text-[13px]">
            <div className="flex justify-between border-b border-line pb-2">
              <span className="text-muted">Address</span>
              <span className="font-medium text-ink">{viewing.address}</span>
            </div>
            <div className="flex justify-between border-b border-line pb-2">
              <span className="text-muted">Owner</span>
              <span className="font-medium text-ink">{viewing.owner}</span>
            </div>
            <div className="flex justify-between border-b border-line pb-2">
              <span className="text-muted">Barangay</span>
              <span className="font-medium text-ink">{viewing.barangay}</span>
            </div>
            <div className="flex justify-between border-b border-line pb-2">
              <span className="text-muted">Type</span>
              <span className="font-medium text-indigo">{viewing.type}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Status</span>
              <Badge status={viewing.status} />
            </div>
          </div>
        </Modal>
      )}

      {/* Edit modal */}
      {editing && (
        <Modal
          title={`Edit ${editing.name}`}
          onClose={() => setEditing(null)}
          footer={
            <>
              <button
                onClick={() => setEditing(null)}
                className="rounded-lg border border-line px-4 py-2.5 text-[12.5px] font-semibold text-ink"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="rounded-lg bg-indigo px-4 py-2.5 text-[12.5px] font-semibold text-white"
              >
                Save Changes
              </button>
            </>
          }
        >
          <FormFields form={form} setForm={setForm} />
        </Modal>
      )}

      {/* Create modal */}
      {creating && (
        <Modal
          title="New Establishment"
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
                Add Establishment
              </button>
            </>
          }
        >
          <FormFields form={form} setForm={setForm} />
        </Modal>
      )}

      {Toast}
    </AdminShell>
  );
}
