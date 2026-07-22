import Icon from '../components/Icon';
import AdminShell from '../components/AdminShell';
import { useData } from '../context/DataContext';
import { useToast } from '../components/Toast';
import { CategoryPill, HealthCardPill } from './Permits';

export default function IncomingSanitaryPermits() {
  const { permits, healthCards, approvePermit, rejectPermit } = useData();
  const { showToast, Toast } = useToast();

  const incoming = permits.filter((p) => p.status === 'Pending');

  const onApprove = (permit) => {
    const result = approvePermit(permit.id);
    showToast(result.message);
  };

  const onReject = (permit) => {
    rejectPermit(permit.id, 'incomplete requirements');
    showToast(`${permit.permitNo} rejected and removed from the queue.`);
  };

  return (
    <AdminShell hideAction>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-ink">Incoming Sanitary Permit</h1>
        <p className="mt-1 text-[12.5px] text-muted">
          New sanitary permit applications waiting for admin review.
        </p>
      </div>

      <div className="rounded-xl border border-line bg-card p-4.5 md:p-[18px]">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[14.5px] font-bold text-ink">LIST</p>
          <span className="rounded-full bg-yellow-bg px-2.5 py-1 text-[11px] font-bold text-yellow">
            {incoming.length} pending
          </span>
        </div>

        {incoming.length === 0 ? (
          <p className="py-8 text-center text-[12.5px] text-muted">
            No pending sanitary permit applications right now.
          </p>
        ) : (
          <div className="divide-y divide-line">
            {incoming.map((p) => (
              <div key={p.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[12.5px] font-bold text-indigo">{p.permitNo}</p>
                    <CategoryPill category={p.category} />
                  </div>
                  <p className="mt-1 text-[13px] font-semibold text-ink">{p.name}</p>
                  <p className="mt-0.5 text-[10.5px] text-muted">
                    {p.category === 'Business' ? p.address : `Owner: ${p.holder}`}
                  </p>
                  <div className="mt-2">
                    <HealthCardPill permit={p} cards={healthCards} />
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => onReject(p)}
                    className="flex items-center rounded-lg border border-red bg-red-bg px-3 py-2 text-[11.5px] font-semibold text-red"
                  >
                    <Icon name="close" size={13} color="#E11D48" />
                    <span className="ml-1.5">Reject</span>
                  </button>
                  <button
                    onClick={() => onApprove(p)}
                    className="flex items-center rounded-lg border border-green bg-green-bg px-3 py-2 text-[11.5px] font-semibold text-green"
                  >
                    <Icon name="check" size={13} color="#16A34A" />
                    <span className="ml-1.5">Approve</span>
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
