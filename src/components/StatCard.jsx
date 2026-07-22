import Icon from './Icon';

export default function StatCard({ item }) {
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
