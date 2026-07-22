import Icon from './Icon';

export default function TopBar({
  onMenuPress,
  actionLabel = 'New Item',
  actionIcon = 'plus',
  onActionPress,
  hideAction = false,
}) {
  return (
    <div className="flex items-center justify-between border-b border-line bg-bg px-5 py-3">
      <button
        onClick={onMenuPress}
        className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-line bg-card lg:hidden"
      >
        <Icon name="menu" size={18} color="#1F2430" />
      </button>

      <div className="hidden w-[260px] items-center rounded-lg border border-line bg-card px-3 py-2 md:flex">
        <Icon name="search" size={14} color="#8A8FA3" />
        <input
          placeholder="Search..."
          className="ml-2 w-full bg-transparent text-[12.5px] text-ink placeholder:text-muted focus:outline-none"
        />
      </div>

      <div className="ml-auto flex items-center">
        <button className="ml-2.5 flex h-[34px] w-[34px] items-center justify-center rounded-full border border-line bg-card">
          <Icon name="notifications" size={16} color="#8A8FA3" />
        </button>
        <button className="ml-2.5 flex h-[34px] w-[34px] items-center justify-center rounded-full border border-line bg-card">
          <Icon name="moon" size={16} color="#8A8FA3" />
        </button>
        {!hideAction && (
          <button
            onClick={onActionPress}
            className="ml-2.5 flex items-center rounded-lg bg-indigo px-3.5 py-2.5 text-white"
          >
            <Icon name={actionIcon} size={14} color="#fff" />
            <span className="ml-1.5 hidden text-[12.5px] font-semibold sm:inline">{actionLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}
