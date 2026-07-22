const STATUS_STYLES = {
  Active: { bg: '#E7F7EC', color: '#16A34A' },
  Pending: { bg: '#FEF6E7', color: '#D97706' },
  Expired: { bg: '#FDECEF', color: '#E11D48' },
  Expiring: { bg: '#FEF6E7', color: '#D97706' },
};

export default function Badge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.Active;
  return (
    <span
      className="inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[10.5px] font-bold"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {status}
    </span>
  );
}
