import Icon from '../components/Icon';
import AdminShell from '../components/AdminShell';
import { useData } from '../context/DataContext';
import { useToast } from '../components/Toast';

export default function IncomingHealthCards() {
  const { healthCards, confirmHealthCard, rejectHealthCard } = useData();
  const { showToast, Toast } = useToast();

  const incoming = healthCards.filter((c) => c.status === 'Pending Confirmation');

  const onConfirm = (card) => {
    confirmHealthCard(card.id);
    showToast(`${card.holder}'s health card confirmed and marked Valid.`);
  };

  const onReject = (card) => {
    rejectHealthCard(card.id, 'incomplete requirements');
    showToast(`${card.cardNo} rejected and removed from the queue.`);
  };

  return (
    <AdminShell hideAction>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-ink">Incoming Health Card</h1>
        <p className="mt-1 text-[12.5px] text-muted">
          New health card applications waiting for admin confirmation.
        </p>
      </div>

      <div className="rounded-xl border border-line bg-card p-4.5 md:p-[18px]">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[14.5px] font-bold text-ink">List</p>
          <span className="rounded-full bg-yellow-bg px-2.5 py-1 text-[11px] font-bold text-yellow">
            {incoming.length} pending
          </span>
        </div>

        {incoming.length === 0 ? (
          <p className="py-8 text-center text-[12.5px] text-muted">
            No pending health card applications right now.
          </p>
        ) : (
          <div className="divide-y divide-line">
            {incoming.map((c) => (
              <div key={c.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[12.5px] font-bold text-indigo">{c.cardNo}</p>
                  <p className="mt-1 text-[13px] font-semibold text-ink">{c.holder}</p>
                  <p className="mt-0.5 text-[10.5px] text-muted">
                    {c.type}
                    {c.establishment ? ` · ${c.establishment}` : ''}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => onReject(c)}
                    className="flex items-center rounded-lg border border-red bg-red-bg px-3 py-2 text-[11.5px] font-semibold text-red"
                  >
                    <Icon name="close" size={13} color="#E11D48" />
                    <span className="ml-1.5">Reject</span>
                  </button>
                  <button
                    onClick={() => onConfirm(c)}
                    className="flex items-center rounded-lg border border-green bg-green-bg px-3 py-2 text-[11.5px] font-semibold text-green"
                  >
                    <Icon name="check" size={13} color="#16A34A" />
                    <span className="ml-1.5">Confirm</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {Toast}
    </AdminShell>
  );
}
