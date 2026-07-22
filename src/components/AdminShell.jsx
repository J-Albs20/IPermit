import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function AdminShell({ actionLabel, actionIcon, onActionPress, hideAction, children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen bg-bg">
      {/* Desktop / tablet sidebar (icon-only below lg, full above) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-56">
            <Sidebar onNavigate={() => setDrawerOpen(false)} />
          </div>
          <button
            className="flex-1 bg-black/35"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          onMenuPress={() => setDrawerOpen(true)}
          actionLabel={actionLabel}
          actionIcon={actionIcon}
          onActionPress={onActionPress}
          hideAction={hideAction}
        />
        <main className="flex-1 overflow-y-auto p-5">{children}</main>
      </div>
    </div>
  );
}
