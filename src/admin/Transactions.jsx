import { useState } from 'react';
import Icon from '../components/Icon';
import Modal from '../components/Modal';
import AdminShell from '../components/AdminShell';
import { useToast } from '../components/Toast';
import { useData } from '../context/DataContext';
import { StatusPill, CategoryPill, HealthCardPill, expiresColor } from './Permits';
import { StatusPill as HealthCardStatusPill } from './HealthCards';

const TABS = ['Sanitary Permit', 'Health Certificate', 'Logbook'];
const LOG_FILTERS = ['All', 'Sanitary Permit', 'Sanitary Permit Business', 'Health Card'];

function TabBar({ active, onChange }) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {TABS.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`rounded-lg border px-3.5 py-2 text-xs font-semibold ${
            active === t
              ? 'border-indigo bg-indigo text-white'
              : 'border-line bg-card text-muted hover:bg-bg'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

function SanitaryPermitTab() {
  const { permits, healthCards, renewPermit, deletePermit } = useData();
  const [viewing, setViewing] = useState(null);
  const { showToast, Toast } = useToast();

  const onRenew = (p) => {
    if (p.status !== 'Expiring') {
      showToast(`${p.permitNo} isn't in a renewable state right now.`);
      return;
    }
    const result = renewPermit(p.id);
    showToast(result.message);
  };

  const onDelete = (p) => {
    deletePermit(p.id);
    showToast(`${p.permitNo} deleted from records.`);
  };

  return (
    <div className="rounded-xl border border-line bg-card p-4.5 md:p-[18px]">
      <p className="mb-3 text-[14.5px] font-bold text-ink">Sanitary Permit Transactions</p>
      <div className="divide-y divide-line">
        {permits.map((p) => (
          <div key={p.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[12.5px] font-bold text-indigo">{p.permitNo}</p>
                <CategoryPill category={p.category} />
                <StatusPill status={p.status} />
              </div>
              <p className="mt-1 text-[13px] font-semibold text-ink">{p.name}</p>
              <p
                className="mt-0.5 text-[10.5px]"
                style={{ color: expiresColor(p.status) }}
              >
                Expires {p.expires}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <button onClick={() => onRenew(p)} title="Renew">
                <Icon name="refresh" size={16} color={p.status === 'Expiring' ? '#D97706' : '#C9CCD6'} />
              </button>
              <button onClick={() => setViewing(p)} title="View">
                <Icon name="eye" size={16} color="#8A8FA3" />
              </button>
              <button onClick={() => onDelete(p)} title="Delete">
                <Icon name="trash" size={16} color="#E11D48" />
              </button>
            </div>
          </div>
        ))}
      </div>

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
      {Toast}
    </div>
  );
}

function HealthCertificateTab() {
  const { healthCards, deleteHealthCard } = useData();
  const [viewing, setViewing] = useState(null);
  const { showToast, Toast } = useToast();

  const onDelete = (c) => {
    deleteHealthCard(c.id);
    showToast(`${c.cardNo} deleted from records.`);
  };

  return (
    <div className="rounded-xl border border-line bg-card p-4.5 md:p-[18px]">
      <p className="mb-3 text-[14.5px] font-bold text-ink">Health Certificate Transactions</p>
      <div className="divide-y divide-line">
        {healthCards.map((c) => (
          <div key={c.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[12.5px] font-bold text-indigo">{c.cardNo}</p>
                <HealthCardStatusPill status={c.status} />
              </div>
              <p className="mt-1 text-[13px] font-semibold text-ink">{c.holder}</p>
              <p className="mt-0.5 text-[10.5px] text-muted">
                {c.type}
                {c.establishment ? ` · ${c.establishment}` : ''} · Expires {c.expires}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <button onClick={() => setViewing(c)} title="View">
                <Icon name="eye" size={16} color="#8A8FA3" />
              </button>
              <button onClick={() => onDelete(c)} title="Delete">
                <Icon name="trash" size={16} color="#E11D48" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {viewing && (
        <Modal title={viewing.cardNo} onClose={() => setViewing(null)}>
          <div className="space-y-3 text-[13px]">
            <div className="flex justify-between border-b border-line pb-2">
              <span className="text-muted">Holder</span>
              <span className="font-medium text-ink">{viewing.holder}</span>
            </div>
            <div className="flex justify-between border-b border-line pb-2">
              <span className="text-muted">Type</span>
              <span className="font-medium text-ink">{viewing.type}</span>
            </div>
            <div className="flex justify-between border-b border-line pb-2">
              <span className="text-muted">Establishment</span>
              <span className="font-medium text-ink">{viewing.establishment || '—'}</span>
            </div>
            <div className="flex justify-between border-b border-line pb-2">
              <span className="text-muted">Issued</span>
              <span className="font-medium text-ink">{viewing.issued}</span>
            </div>
            <div className="flex justify-between border-b border-line pb-2">
              <span className="text-muted">Expires</span>
              <span className="font-medium text-ink">{viewing.expires}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Status</span>
              <HealthCardStatusPill status={viewing.status} />
            </div>
          </div>
        </Modal>
      )}
      {Toast}
    </div>
  );
}

function ACTION_COLOR(action) {
  return (
    {
      Created: '#4F46E5',
      Approved: '#16A34A',
      Confirmed: '#16A34A',
      Renewed: '#16A34A',
      Rejected: '#E11D48',
      Deleted: '#E11D48',
    }[action] || '#8A8FA3'
  );
}

function LogbookTab() {
  const { logbook } = useData();
  const [filter, setFilter] = useState('All');

  const filtered = logbook.filter((l) => filter === 'All' || l.category === filter);

  return (
    <div className="rounded-xl border border-line bg-card p-4.5 md:p-[18px]">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[14.5px] font-bold text-ink">Logbook</p>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {LOG_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg border px-3 py-1.5 text-[11px] font-semibold ${
              filter === f
                ? 'border-indigo bg-indigo text-white'
                : 'border-line bg-card text-muted hover:bg-bg'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-[12.5px] text-muted">
          No activity recorded yet. Actions across Permits, Health Cards, and the Incoming
          queues will show up here.
        </p>
      ) : (
        <div className="divide-y divide-line">
          {filtered.map((entry) => (
            <div key={entry.id} className="flex items-start gap-3 py-3">
              <span
                className="mt-1 h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: ACTION_COLOR(entry.action) }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[12px] font-bold" style={{ color: ACTION_COLOR(entry.action) }}>
                    {entry.action}
                  </span>
                  <span className="rounded-full bg-bg px-2 py-0.5 text-[10px] font-semibold text-muted">
                    {entry.category}
                  </span>
                </div>
                <p className="mt-1 text-[12.5px] text-ink">{entry.description}</p>
              </div>
              <span className="shrink-0 whitespace-nowrap text-[10.5px] text-muted">
                {entry.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Transactions() {
  const [tab, setTab] = useState('Sanitary Permit');

  return (
    <AdminShell hideAction>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-ink">Transactions</h1>
        <p className="mt-1 text-[12.5px] text-muted">
          Renew, review, or remove permit and health card records, and audit recent activity.
        </p>
      </div>

      <TabBar active={tab} onChange={setTab} />

      {tab === 'Sanitary Permit' && <SanitaryPermitTab />}
      {tab === 'Health Certificate' && <HealthCertificateTab />}
      {tab === 'Logbook' && <LogbookTab />}
    </AdminShell>
  );
}
