import Icon from './Icon';

export default function Modal({ title, onClose, children, footer, width = 'max-w-lg' }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className={`relative z-10 w-full ${width} max-h-[90vh] overflow-y-auto rounded-xl bg-card p-5 shadow-xl`}>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[15px] font-bold text-ink">{title}</p>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-bg"
          >
            <Icon name="close" size={18} color="#8A8FA3" />
          </button>
        </div>

        <div>{children}</div>

        {footer && <div className="mt-5 flex justify-end gap-2.5">{footer}</div>}
      </div>
    </div>
  );
}
